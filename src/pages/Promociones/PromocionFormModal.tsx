import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import Input from "../../Components/components/input/Input";
import { ModalPrincipal } from "../../Components/components/Modal/Modals";
import { IAdminInventoryProductDto } from "../../api/Controller/Productos/InterfaceProducts";
//prettier-ignore
import { IAdminPromotionDto, IAdminPromotionMediaDto } from "../../api/Controller/Promociones/InterfacePromociones";
//prettier-ignore
import { buildEditableProducts, buildPromotionName, buildQuantityDrafts, calculatePromotion, calculatePromotionAvailableStock, calculatePromotionFromGrossMargin, currencyFormatter, getTomorrow, PromotionItem, QuantityDrafts, toNumber } from "./promotionCalculations";

interface IFormMedia extends IAdminPromotionMediaDto {
    file?: File;
}

interface PromocionFormModalProps {
    open: boolean;
    loading: boolean;
    editing: IAdminPromotionDto | null;
    products: IAdminInventoryProductDto[];
    onClose: () => void;
    onSubmit: (editing: IAdminPromotionDto | null, formData: FormData) => void | Promise<void>;
}

//prettier-ignore
const PromocionFormModal: React.FC<PromocionFormModalProps> = ({ open, loading, editing, products, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState<string | null>(null);
    const [finalPriceWithIva, setFinalPriceWithIva] = useState('');
    const [grossMarginPercent, setGrossMarginPercent] = useState('');
    const [stock, setStock] = useState('1');
    const [productSearch, setProductSearch] = useState('');
    const [quantityDrafts, setQuantityDrafts] = useState<QuantityDrafts>({});
    const [media, setMedia] = useState<IFormMedia[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open) {
            return;
        }

        if (editing) {
            setName(editing.name);
            setEndDate(editing.endDate);
            setFinalPriceWithIva(editing.finalPriceWithIva.toFixed(2));
            setGrossMarginPercent(editing.grossMarginPercent.toFixed(1));
            setStartDate(editing.startDate);
            setStock(String(editing.stock));
            setQuantityDrafts(buildQuantityDrafts(products, editing));
            setMedia(editing.media ?? []);
        } else {
            setName('');
            setEndDate(null);
            setFinalPriceWithIva('');
            setGrossMarginPercent('');
            setStartDate(getTomorrow());
            setStock('1');
            setQuantityDrafts(buildQuantityDrafts(products));
            setMedia([]);
        }
        setProductSearch('');
        setError('');
    }, [open, editing, products]);

    // Productos con el stock ya reservado por esta misma promocion devuelto.
    const formProducts = useMemo(
        () => buildEditableProducts(products, editing),
        [editing, products],
    );

    const promotionItems = useMemo<PromotionItem[]>(
        () =>
            formProducts
                .map((product) => ({
                    productId: product.id,
                    quantity: Math.max(0, Math.floor(toNumber(quantityDrafts[product.id] ?? '0'))),
                }))
                .filter((item) => item.quantity > 0),
        [formProducts, quantityDrafts],
    );

    const calculation = useMemo(() => {
        const manualFinalPrice = toNumber(finalPriceWithIva);

        if (manualFinalPrice > 0) {
            return calculatePromotion(promotionItems, formProducts, manualFinalPrice);
        }

        return calculatePromotionFromGrossMargin(promotionItems, formProducts, toNumber(grossMarginPercent));
    }, [finalPriceWithIva, formProducts, grossMarginPercent, promotionItems]);

    const availableStock = calculatePromotionAvailableStock(promotionItems, formProducts);
    const requestedStock = Math.floor(toNumber(stock));
    const totalUnits = promotionItems.reduce((sum, item) => sum + item.quantity, 0);

    const visibleProducts = useMemo(() => {
        const query = productSearch.trim().toLowerCase();

        if (!query) {
            return formProducts;
        }

        return formProducts.filter((product) =>
            `${product.name} ${product.category}`.toLowerCase().includes(query),
        );
    }, [formProducts, productSearch]);

    const handleQuantityChange = (productId: number, value: string) => {
        setQuantityDrafts((current) => ({ ...current, [productId]: value }));
    };

    const handleAgregarArchivos = (files: FileList | null) => {
        if (!files || files.length === 0) {
            return;
        }

        const nuevos: IFormMedia[] = Array.from(files).map((file, index) => ({
            id: 0,
            idArchivoStorageEntitys: 0,
            type: file.type.startsWith('video') ? 'video' : 'image',
            uri: URL.createObjectURL(file),
            altText: '',
            title: file.name,
            description: '',
            isCover: media.length === 0 && index === 0,
            file,
        }));

        setMedia((current) => [...current, ...nuevos]);
        setError('');
    };

    const updateMediaField = (index: number, field: 'title' | 'altText' | 'description', value: string) => {
        setMedia((current) => current.map((item, position) => (position === index ? { ...item, [field]: value } : item)));
    };

    const handleRemoveMedia = (index: number) => {
        setMedia((current) => {
            const next = current.filter((_, position) => position !== index);
            if (next.length > 0 && !next.some((item) => item.isCover)) {
                next[0] = { ...next[0], isCover: true };
            }
            return next;
        });
    };

    const handleSetCover = (index: number) => {
        setMedia((current) => current.map((item, position) => ({ ...item, isCover: position === index })));
    };

    const handleSubmit = async () => {
        if (editing && editing.status !== 'pending') {
            setError('Solo puedes editar promociones pendientes.');
            return;
        }

        if (promotionItems.length < 2) {
            setError('Selecciona al menos 2 productos para la promocion.');
            return;
        }

        if (promotionItems.length > 3) {
            setError('Usa maximo 3 productos distintos por promocion.');
            return;
        }

        if (calculation.finalPriceWithIva <= 0) {
            setError('Coloca el precio final que paga el cliente.');
            return;
        }

        if (!startDate.trim()) {
            setError('Coloca la fecha de inicio de la promocion.');
            return;
        }

        if (startDate.trim() < getTomorrow()) {
            setError('La fecha de inicio debe ser desde manana en adelante.');
            return;
        }

        if (endDate && endDate <= startDate.trim()) {
            setError('La fecha fin debe ser mayor a la fecha de inicio.');
            return;
        }

        if (requestedStock <= 0) {
            setError('Coloca un stock mayor a cero.');
            return;
        }

        if (requestedStock > availableStock) {
            setError('El stock de la promocion supera las unidades disponibles.');
            return;
        }

        const resolvedName = name.trim() || buildPromotionName(promotionItems, formProducts);

        const formData = new FormData();
        formData.append('Id', String(editing?.id ?? 0));
        formData.append('Name', resolvedName);
        formData.append('StartDate', startDate.trim());
        formData.append('EndDate', endDate ?? '');
        // Redondea a 2 decimales con punto como separador (las columnas son numeric(18,2)
        // y el back parsea con cultura invariante).
        const money = (value: number) => (Math.round(value * 100) / 100).toFixed(2);
        formData.append('Stock', String(requestedStock));
        formData.append('BaseCost', money(calculation.baseCost));
        formData.append('PvpWithoutIva', money(calculation.pvpWithoutIva));
        formData.append('IvaAmount', money(calculation.ivaAmount));
        formData.append('FinalPriceWithIva', money(calculation.finalPriceWithIva));
        formData.append('ProfitAmount', money(calculation.profitAmount));
        formData.append('GrossMarginPercent', money(calculation.grossMarginPercent));
        formData.append(
            'ItemsJson',
            JSON.stringify(
                promotionItems.map((item) => ({
                    productId: Number(item.productId),
                    quantity: item.quantity,
                })),
            ),
        );

        let fileIndex = 0;
        const mediaMeta = media.map((item) => {
            let thisFileIndex = -1;
            if (item.file) {
                thisFileIndex = fileIndex;
                fileIndex += 1;
                formData.append('Files', item.file);
            }
            return {
                id: item.id,
                idArchivoStorageEntitys: item.idArchivoStorageEntitys,
                type: item.type,
                altText: item.altText,
                title: item.title,
                description: item.description,
                isCover: item.isCover,
                fileIndex: thisFileIndex,
            };
        });

        formData.append('MediaJson', JSON.stringify(mediaMeta));

        await onSubmit(editing, formData);
    };

    return (
        <ModalPrincipal
            open={open}
            setOpen={() => onClose()}
            tittle={editing ? 'Editar promoción' : 'Nueva promoción'}
            width={1150}
            height={700}
            children={
                <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

                    <Card className="mb-3">
                        <Card.Header><Card.Title as="h5" className="mb-0">Resumen de la promoción</Card.Title></Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xl={3}><p className="mb-1 text-muted">Costo base</p><h6>{currencyFormatter.format(calculation.baseCost)}</h6></Col>
                                <Col xl={3}><p className="mb-1 text-muted">PVP sin IVA</p><h6>{currencyFormatter.format(calculation.pvpWithoutIva)}</h6></Col>
                                <Col xl={3}><p className="mb-1 text-muted">IVA</p><h6>{currencyFormatter.format(calculation.ivaAmount)}</h6></Col>
                                <Col xl={3}><p className="mb-1 text-muted">Precio final</p><h6 className="text-primary">{currencyFormatter.format(calculation.finalPriceWithIva)}</h6></Col>
                                <Col xl={3}><p className="mb-1 text-muted">Ganancia</p><h6 className={calculation.profitAmount < 0 ? 'text-danger' : 'text-success'}>{currencyFormatter.format(calculation.profitAmount)}</h6></Col>
                                <Col xl={3}><p className="mb-1 text-muted">Margen bruto</p><h6>{calculation.grossMarginPercent.toFixed(2)}%</h6></Col>
                                <Col xl={3}><p className="mb-1 text-muted">Unidades por combo</p><h6>{totalUnits}</h6></Col>
                                <Col xl={3}><p className="mb-1 text-muted">Stock disponible</p><h6>{availableStock}</h6></Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Row>
                        <Col xl={4}>
                            <Input
                                label="Nombre (opcional)"
                                placeholder="Se arma solo con los productos"
                                disabled={loading}
                                value={name}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setName(value)}
                            />
                        </Col>
                        <Col xl={4}>
                            <Input
                                label="Fecha de inicio"
                                type="date"
                                min={getTomorrow()}
                                disabled={loading}
                                value={startDate}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setStartDate(value)}
                            />
                        </Col>
                        <Col xl={4}>
                            <Input
                                label="Fecha fin (opcional)"
                                type="date"
                                disabled={loading}
                                value={endDate ?? ''}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setEndDate(value === '' ? null : value)}
                            />
                        </Col>
                        <Col xl={4}>
                            <Input
                                label="Precio final con IVA"
                                type="number"
                                min={0}
                                placeholder="Automático desde el margen"
                                disabled={loading}
                                value={finalPriceWithIva}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setFinalPriceWithIva(value)}
                            />
                        </Col>
                        <Col xl={4}>
                            <Input
                                label="Margen bruto (%)"
                                type="number"
                                placeholder="Se usa si no pones precio final"
                                disabled={loading}
                                value={grossMarginPercent}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setGrossMarginPercent(value)}
                            />
                        </Col>
                        <Col xl={4}>
                            <Input
                                label="Stock de la promoción"
                                type="number"
                                min={1}
                                disabled={loading}
                                value={stock}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setStock(value)}
                            />
                        </Col>
                    </Row>

                    <Card className="mb-3">
                        <Card.Header><Card.Title as="h5" className="mb-0">Productos del combo (2 a 3 distintos)</Card.Title></Card.Header>
                        <Card.Body>
                            <Input
                                label="Buscar producto"
                                placeholder="Nombre o categoria"
                                disabled={loading}
                                value={productSearch}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setProductSearch(value)}
                            />

                            <div style={{ maxHeight: 260, overflowY: 'auto' }}>
                                <Table responsive className="table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Categoría</th>
                                            <th>Stock</th>
                                            <th>Costo unitario</th>
                                            <th>Cantidad en combo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td>{product.name}</td>
                                                <td>{product.category || product.categorias?.[0]?.nombre || ''}</td>
                                                <td>{product.stock}</td>
                                                <td>{currencyFormatter.format(product.backendUnitCost ?? 0)}</td>
                                                <td style={{ maxWidth: 120 }}>
                                                    <Form.Control
                                                        type="number"
                                                        min={0}
                                                        disabled={loading}
                                                        value={quantityDrafts[product.id] ?? '0'}
                                                        onChange={({ target: { value } }) => handleQuantityChange(product.id, value)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                        {visibleProducts.length === 0 && (
                                            <tr><td colSpan={5} className="text-center text-muted">No hay productos disponibles.</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </Card.Body>
                    </Card>

                    <Input
                        label="Imagenes y videos"
                        type="file"
                        accept="image/*,video/*"
                        disabled={loading}
                        onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                            handleAgregarArchivos(target.files);
                            target.value = '';
                        }}
                    />

                    {media.length > 0 && (
                        <Row className="mb-3">
                            {media.map((item, index) => (
                                <Col xl={4} key={`${item.id}-${index}`} className="mb-3">
                                    <div className="border rounded p-2 h-100">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-bold text-primary">
                                                {item.isCover ? 'Portada' : item.type === 'video' ? 'Video' : 'Imagen'}
                                            </span>
                                            <div className="d-flex" style={{ gap: 6 }}>
                                                {!item.isCover && (
                                                    <Button size="sm" variant="outline-primary" onClick={() => handleSetCover(index)} disabled={loading}>
                                                        Portada
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="outline-danger" onClick={() => handleRemoveMedia(index)} disabled={loading}>
                                                    Quitar
                                                </Button>
                                            </div>
                                        </div>

                                        {item.type === 'video' ? (
                                            <video src={item.uri} controls style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
                                        ) : (
                                            <img src={item.uri} alt={item.altText} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
                                        )}

                                        <Input
                                            label="Titulo"
                                            disabled={loading}
                                            value={item.title}
                                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => updateMediaField(index, 'title', value)}
                                        />
                                        <Input
                                            label="Texto alternativo"
                                            disabled={loading}
                                            value={item.altText}
                                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => updateMediaField(index, 'altText', value)}
                                        />
                                        <Input
                                            label="Descripción"
                                            disabled={loading}
                                            value={item.description}
                                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => updateMediaField(index, 'description', value)}
                                        />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}

                    {error !== '' && <p className="text-danger fw-bold">{error}</p>}

                    <Button className="me-2" variant="primary" type="submit" disabled={loading}>
                        {editing ? 'Guardar cambios' : 'Crear promoción'}
                    </Button>
                    <Button variant="secondary" onClick={() => onClose()} disabled={loading}>Cerrar</Button>
                </Form>
            }
        />
    );
};

export default PromocionFormModal;
