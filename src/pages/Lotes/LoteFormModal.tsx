import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import Input from "../../Components/components/input/Input";
import { SelectPrincipal } from "../../Components/components/Select/Selects";
import { ModalPrincipal } from "../../Components/components/Modal/Modals";
import { IDropBoxGlobal } from "../../helper/VariablesGLobal";
import { UseProducts } from "../../api/Controller/Productos/ProductosController";
//prettier-ignore
import { DataDefaultFilterProductsAdminDto, IAdminInventoryProductDto } from "../../api/Controller/Productos/InterfaceProducts";
import { IAdminLoteDto, IUpsertLoteDto } from "../../api/Controller/Lotes/InterfaceLotes";
//prettier-ignore
import { IImpuestoDto, IUpsertImpuestoDto } from "../../api/Controller/Catalogos/Impuestos/InterfaceImpuestos";
import { IIvaDto } from "../../api/Controller/Catalogos/Iva/InterfaceIva";
//prettier-ignore
import { BatchItemDrafts, buildDraftFromProduct, buildFeeFromImpuesto, buildIvaFee, calculateBatch, currencyFormatter, DEFAULT_SALES_IVA_PERCENT, FeeDraft, IVA_FEE_ID, SelectedProduct, toNumber } from "./loteCalculations";
import ImpuestoFormModal from "./ImpuestoFormModal";

interface LoteFormModalProps {
    open: boolean;
    editing: IAdminLoteDto | null;
    ivaOptions: IIvaDto[];
    impuestosOptions: IImpuestoDto[];
    tipoImpuestoOptions: IDropBoxGlobal[];
    onClose: () => void;
    onSubmit: (id: number | null, data: IUpsertLoteDto) => void | Promise<void>;
    // Crea un impuesto en el catalogo y lo devuelve para agregarlo al lote.
    onCreateImpuesto: (data: IUpsertImpuestoDto) => Promise<IImpuestoDto | null>;
}

//prettier-ignore
const LoteFormModal: React.FC<LoteFormModalProps> = ({ open, editing, ivaOptions, impuestosOptions, tipoImpuestoOptions, onClose, onSubmit, onCreateImpuesto }) => {
    const [batchCode, setBatchCode] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [batchCost, setBatchCost] = useState('');
    const [arrivalDate, setArrivalDate] = useState('');
    const [publishDate, setPublishDate] = useState('');
    const [importerCommissionPercent, setImporterCommissionPercent] = useState('5');
    const [productSearch, setProductSearch] = useState('');
    const [searchResults, setSearchResults] = useState<IAdminInventoryProductDto[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [idIva, setIdIva] = useState<number | null>(null);
    const [fees, setFees] = useState<FeeDraft[]>([]);
    const [itemDrafts, setItemDrafts] = useState<BatchItemDrafts>({});
    const [loteProductoIds, setLoteProductoIds] = useState<Record<number, number>>({});
    const [error, setError] = useState('');
    const [isImpuestoFormOpen, setIsImpuestoFormOpen] = useState(false);
    const [idImpuestoAgregar, setIdImpuestoAgregar] = useState(0);

    const isEdit = editing != null;

    const salesIvaPercent =
        ivaOptions.find((iva) => iva.id === idIva)?.porcentaje ?? DEFAULT_SALES_IVA_PERCENT;

    // Precarga (editar) o reinicio (crear) cuando se abre el modal.
    useEffect(() => {
        if (!open) {
            return;
        }

        if (editing) {
            setBatchCode(editing.codigoLote);
            setDescripcion(editing.descripcion ?? '');
            setBatchCost(editing.valorLote ? String(editing.valorLote) : '');
            setArrivalDate(editing.fechaLlegada ?? '');
            setPublishDate(editing.fechaSalidaVenta ?? '');
            setImporterCommissionPercent('0');
            const ivaSeleccionado =
                ivaOptions.find((iva) => iva.id === editing.idIvaEntitys) ??
                ivaOptions.find((iva) => iva.esPredeterminado);
            setIdIva(ivaSeleccionado?.id ?? editing.idIvaEntitys ?? null);
            // Reconstruye los impuestos/tarifas guardados respetando el orden. El IVA
            // recupera su id estable para seguir sincronizado con el selector de arriba.
            const porcentajeIva = ivaSeleccionado?.porcentaje ?? editing.ivaPorcentaje;
            const feesGuardados: FeeDraft[] = (editing.impuestos ?? [])
                .slice()
                .sort((a, b) => a.orden - b.orden)
                .map((imp) => ({
                    id: imp.esIva ? IVA_FEE_ID : `fee-${imp.idLoteImpuesto}`,
                    idImpuesto: imp.idImpuesto ?? 0,
                    label: imp.nombre,
                    type: imp.esPorcentaje ? 'percent' : 'fixed',
                    amount: imp.valor ? String(imp.valor) : '',
                }));
            setFees(feesGuardados.length > 0 ? feesGuardados : [buildIvaFee(porcentajeIva)]);

            const drafts: BatchItemDrafts = {};
            const ids: Record<number, number> = {};
            const productos: SelectedProduct[] = editing.productos.map((linea) => {
                ids[linea.idProducto] = linea.idLoteProducto;
                drafts[linea.idProducto] = {
                    // El PVP se reconstruye con costo + margen guardado (precioVentaUnitario
                    // es sin IVA, no es lo que paga el cliente, por eso no va aqui).
                    customerFinalPrice: '',
                    grossMarginPercent: linea.margenVentaPorcentaje ? String(linea.margenVentaPorcentaje) : '0',
                    isSelected: true,
                    receivedDamagedQuantity: String(linea.cantidadDanados),
                    receivedExcellentQuantity: String(linea.cantidadBuenos),
                    unitCost: String(linea.precioCompraUnitario),
                };
                return {
                    id: linea.idProducto,
                    name: linea.nombreProducto,
                    basePrice: linea.precioCompraUnitario,
                    incomingStockSuggestion: 0,
                };
            });
            setSelectedProducts(productos);
            setItemDrafts(drafts);
            setLoteProductoIds(ids);
        } else {
            setBatchCode('');
            setDescripcion('');
            setBatchCost('');
            setArrivalDate('');
            setPublishDate('');
            setImporterCommissionPercent('5');
            const ivaPredeterminado = ivaOptions.find((iva) => iva.esPredeterminado);
            setIdIva(ivaPredeterminado?.id ?? null);
            // El IVA predeterminado entra como primer impuesto del lote (movible).
            setFees(ivaPredeterminado ? [buildIvaFee(ivaPredeterminado.porcentaje)] : []);
            setSelectedProducts([]);
            setItemDrafts({});
            setLoteProductoIds({});
        }
        setProductSearch('');
        setSearchResults([]);
        setError('');
    }, [open, editing, ivaOptions]);

    // Busca productos en el backend (debounce) excluyendo los ya seleccionados.
    useEffect(() => {
        const query = productSearch.trim();
        // La busqueda inicia a partir de 3 caracteres.
        if (query.length < 3) {
            setSearchResults([]);
            setSearching(false);
            return;
        }

        let active = true;
        setSearching(true);
        const handle = setTimeout(async () => {
            try {
                const productsApi = UseProducts();
                const data = await productsApi.Listar({
                    ...DataDefaultFilterProductsAdminDto,
                    name: query,
                    take: 20,
                });
                if (active) {
                    setSearchResults(data.listarRegistros);
                }
            } catch {
                if (active) {
                    setSearchResults([]);
                }
            } finally {
                if (active) {
                    setSearching(false);
                }
            }
        }, 350);

        return () => {
            active = false;
            clearTimeout(handle);
        };
    }, [productSearch]);

    const selectedIds = useMemo(() => new Set(selectedProducts.map((p) => p.id)), [selectedProducts]);

    const calculation = useMemo(
        () =>
            calculateBatch({
                batchCost: toNumber(batchCost),
                fees,
                importerCommissionPercent: toNumber(importerCommissionPercent),
                itemDrafts,
                products: selectedProducts,
                salesIvaPercent,
            }),
        [batchCost, fees, importerCommissionPercent, itemDrafts, selectedProducts, salesIvaPercent],
    );

    // Agrega un producto de los resultados del backend, autocompletando con datos
    // que vienen del back: precio base, margen de venta y el IVA del lote.
    const handleAddProducto = (product: IAdminInventoryProductDto) => {
        if (selectedIds.has(product.id)) {
            return;
        }
        // Margen: se reusa el del ultimo lote del producto si existe; si no, se
        // calcula (PVP - costo) / PVP. Igual queda editable.
        const margenCalculado =
            product.price > 0 ? ((product.price - product.backendUnitCost) / product.price) * 100 : 0;
        const margenBruto =
            product.margenVentaPorcentaje > 0 ? product.margenVentaPorcentaje : margenCalculado;

        setSelectedProducts((current) => [
            ...current,
            {
                id: product.id,
                name: product.name,
                basePrice: product.basePrice,
                incomingStockSuggestion: product.incomingStockSuggestion,
            },
        ]);
        setItemDrafts((current) => ({
            ...current,
            [product.id]: {
                ...buildDraftFromProduct(product),
                isSelected: true,
                receivedExcellentQuantity: '1',
                receivedDamagedQuantity: '0',
                grossMarginPercent: margenBruto > 0 ? margenBruto.toFixed(2) : '0',
            },
        }));
        setProductSearch('');
        setSearchResults([]);
    };

    const handleRemoveProducto = (productId: number) => {
        setSelectedProducts((current) => current.filter((p) => p.id !== productId));
        setItemDrafts((current) => {
            const next = { ...current };
            delete next[productId];
            return next;
        });
    };

    const handleFeeChange = (feeId: string, key: keyof FeeDraft, value: string) => {
        setFees((currentFees) => currentFees.map((fee) => (fee.id === feeId ? { ...fee, [key]: value } : fee)));
    };

    // Cambia el IVA del lote (usado para el PVP) y refleja el cambio en su renglon
    // del orden de impuestos, conservando su posicion. Si se habia eliminado, lo
    // vuelve a colocar al inicio.
    const handleSelectIva = (idIvaSeleccionado: number) => {
        const iva = ivaOptions.find((x) => x.id === idIvaSeleccionado);
        if (!iva) {
            return;
        }
        setIdIva(iva.id);
        setFees((currentFees) => {
            const ivaRow = buildIvaFee(iva.porcentaje);
            if (currentFees.some((fee) => fee.id === IVA_FEE_ID)) {
                return currentFees.map((fee) => (fee.id === IVA_FEE_ID ? ivaRow : fee));
            }
            return [ivaRow, ...currentFees];
        });
    };

    // Agrega un impuesto del catalogo como nuevo renglon al final del orden.
    // Luego se reposiciona con las flechas para fijar en que posicion va.
    const handleAddImpuesto = (impuesto: IImpuestoDto) => {
        setFees((currentFees) => [...currentFees, buildFeeFromImpuesto(impuesto)]);
    };

    // Crea el impuesto en el catalogo (via parent) y, si se crea, lo agrega al lote.
    const handleCreateImpuesto = async (data: IUpsertImpuestoDto) => {
        const creado = await onCreateImpuesto(data);
        if (creado) {
            handleAddImpuesto(creado);
        }
        setIsImpuestoFormOpen(false);
    };

    const handleDeleteFee = (feeId: string) => {
        setFees((currentFees) => currentFees.filter((fee) => fee.id !== feeId));
    };

    const handleMoveFee = (feeId: string, direction: 'up' | 'down') => {
        setFees((currentFees) => {
            const index = currentFees.findIndex((fee) => fee.id === feeId);
            const targetIndex = direction === 'up' ? index - 1 : index + 1;

            if (index < 0 || targetIndex < 0 || targetIndex >= currentFees.length) {
                return currentFees;
            }

            const nextFees = [...currentFees];
            const [movedFee] = nextFees.splice(index, 1);
            nextFees.splice(targetIndex, 0, movedFee);
            return nextFees;
        });
    };

    //prettier-ignore
    const handleDraftChange = (productId: number, key: keyof BatchItemDrafts[number], value: string | boolean) => {
        setItemDrafts((current) => ({
            ...current,
            [productId]: {
                ...(current[productId] ?? buildDraftFromProduct(selectedProducts.find((product) => product.id === productId))),
                [key]: value,
            },
        }));
    };

    const handleSubmit = async () => {
        if (!batchCode.trim()) {
            setError('Coloca el codigo del lote.');
            return;
        }

        if (!idIva) {
            setError('Selecciona el IVA del lote.');
            return;
        }

        // Para poner fecha de publicacion se deben llenar todos los datos del lote y
        // tener al menos un producto.
        if (publishDate.trim()) {
            if (toNumber(batchCost) <= 0) {
                setError('Para poner fecha de publicacion, coloca el valor del lote.');
                return;
            }
            if (!descripcion.trim()) {
                setError('Para poner fecha de publicacion, coloca la descripcion del lote.');
                return;
            }
            if (!arrivalDate.trim()) {
                setError('Para poner fecha de publicacion, coloca la fecha de llegada.');
                return;
            }
            if (selectedProducts.length === 0) {
                setError('Para poner fecha de publicacion, agrega al menos un producto.');
                return;
            }
        }

        // Las fechas son opcionales; si ambas estan, la publicacion no puede ser
        // anterior a la llegada.
        if (arrivalDate.trim() && publishDate.trim() && publishDate < arrivalDate) {
            setError('La fecha de publicacion no puede ser anterior a la fecha de llegada.');
            return;
        }

        // El producto es opcional, pero si se agrega debe estar completo.
        const productoIncompleto = selectedProducts.find((product) => {
            const item = calculation.items[product.id];
            return (
                !item || item.expectedQuantity <= 0 || item.baseUnitCost <= 0 || item.finalPriceWithIva <= 0
            );
        });
        if (productoIncompleto) {
            setError(`Completa la informacion del producto "${productoIncompleto.name}" (cantidad y precios).`);
            return;
        }

        const productos = selectedProducts.map((product) => {
            const item = calculation.items[product.id];
            return {
                idLoteProducto: loteProductoIds[product.id] ?? 0,
                idProducto: product.id,
                cantidadBuenos: item.receivedExcellentQuantity,
                cantidadDanados: item.receivedDamagedQuantity,
                precioCompraUnitario: item.baseUnitCost,
                // PVP unitario SIN IVA (el IVA se aplica en la tienda).
                precioVentaUnitario: item.suggestedPvp,
                // Margen de venta calculado en el detalle, se guarda con el producto.
                margenVentaPorcentaje: item.grossMarginPercent,
            };
        });

        // Cada impuesto/tarifa del lote con su valor, monto calculado y orden.
        const impuestos = fees.map((fee, index) => ({
            idImpuesto: fee.idImpuesto > 0 ? fee.idImpuesto : null,
            nombre: fee.label.trim() || (fee.id === IVA_FEE_ID ? 'IVA' : 'Tarifa'),
            esIva: fee.id === IVA_FEE_ID,
            esPorcentaje: fee.type === 'percent',
            valor: toNumber(fee.amount),
            montoCalculado: calculation.feeBreakdown[fee.id] ?? 0,
            orden: index + 1,
        }));

        const data: IUpsertLoteDto = {
            codigoLote: batchCode.trim(),
            descripcion: descripcion.trim(),
            valorLote: toNumber(batchCost),
            // El total de impuestos/tarifas se guarda tambien como costo de envio.
            costoEnvio: calculation.feesTotal,
            fechaLlegada: arrivalDate.trim() || null,
            fechaSalidaVenta: publishDate.trim() || null,
            idIvaEntitys: idIva,
            productos,
            impuestos,
        };

        await onSubmit(editing?.id ?? null, data);
    };

    return (
        <>
            <ModalPrincipal
                open={open}
                setOpen={() => onClose()}
                tittle={isEdit ? 'Editar lote' : 'Nuevo lote'}
                width={1200}
                height={700}
                children={
                    <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>

                        {/* Numeros del lote en vivo */}
                        <Card className={calculation.batchProfitAmount < 0 ? 'border-danger mb-3' : 'mb-3'}>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <Card.Title as="h5" className="mb-0">Numeros del lote</Card.Title>
                                <span className={`badge ${calculation.batchProfitAmount < 0 ? 'bg-danger' : 'bg-success'}`}>
                                    {calculation.batchProfitAmount < 0 ? 'En rojo' : 'Rentable'}
                                </span>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col xl={3}>
                                        <p className="mb-1 text-muted">Costo final</p>
                                        <h6>{currencyFormatter.format(calculation.totalBatchCost)}</h6>
                                    </Col>
                                    <Col xl={3}>
                                        <p className="mb-1 text-muted">Impuestos / tarifas</p>
                                        <h6>{currencyFormatter.format(calculation.feesTotal)}</h6>
                                    </Col>
                                    <Col xl={3}>
                                        <p className="mb-1 text-muted">Ingreso estimado (sin IVA)</p>
                                        <h6>{currencyFormatter.format(calculation.estimatedRevenueWithoutIva)}</h6>
                                    </Col>
                                    <Col xl={3}>
                                        <p className="mb-1 text-muted">Ganancia del lote</p>
                                        <h6 className={calculation.batchProfitAmount < 0 ? 'text-danger' : 'text-success'}>
                                            {currencyFormatter.format(calculation.batchProfitAmount)} ({calculation.batchProfitPercent.toFixed(2)}%)
                                        </h6>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        {/* Datos del lote */}
                        <Row>
                            <Col xl={4}>
                                <Input
                                    label="Codigo del lote"
                                    placeholder="Ej: LOTE-2026-01"
                                    value={batchCode}
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setBatchCode(value)}
                                />
                            </Col>
                            <Col xl={4}>
                                <Input
                                    label="Descripción"
                                    placeholder="Descripción del lote"
                                    value={descripcion}
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setDescripcion(value)}
                                />
                            </Col>
                            <Col xl={4}>
                                <Input
                                    label="Valor del lote"
                                    type="number"
                                    min={0}
                                    placeholder="0.00"
                                    value={batchCost}
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setBatchCost(value)}
                                />
                            </Col>
                            <Col xl={4}>
                                <Input
                                    label="Fecha de llegada"
                                    type="date"
                                    value={arrivalDate}
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setArrivalDate(value)}
                                />
                            </Col>
                            <Col xl={4}>
                                <Input
                                    label="Fecha de publicación"
                                    type="date"
                                    value={publishDate}
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setPublishDate(value)}
                                />
                            </Col>
                            <Col xl={4}>
                                <Input
                                    label="Comisión del importador (%)"
                                    type="number"
                                    min={0}
                                    max={95}
                                    value={importerCommissionPercent}
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setImporterCommissionPercent(value)}
                                />
                            </Col>
                            <Col xl={4}>
                                <SelectPrincipal
                                    label="IVA del lote"
                                    options={ivaOptions.map((iva) => ({
                                        value: iva.id,
                                        label: `${iva.porcentaje}%${iva.esPredeterminado ? ' (predeterminado)' : ''}`,
                                    }))}
                                    selectedRole={idIva ?? 0}
                                    onChange={(value) => handleSelectIva(value)}
                                />
                            </Col>
                        </Row>

                        {/* Impuestos y tarifas del lote */}
                        <Card className="mb-3">
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <Card.Title as="h5" className="mb-0">Impuestos y tarifas (en orden)</Card.Title>
                                <div className="d-flex align-items-end" style={{ gap: 10 }}>
                                    <div style={{ minWidth: 220 }}>
                                        <SelectPrincipal
                                            placeholder="Agregar del catalogo"
                                            options={impuestosOptions.map((imp) => ({ value: imp.id, label: imp.nombre }))}
                                            selectedRole={idImpuestoAgregar}
                                            onChange={(value) => {
                                                const impuesto = impuestosOptions.find((x) => x.id === value);
                                                if (impuesto) {
                                                    handleAddImpuesto(impuesto);
                                                }
                                                setIdImpuestoAgregar(0);
                                            }}
                                        />
                                    </div>
                                    <Button variant="outline-primary" className="mb-3" onClick={() => setIsImpuestoFormOpen(true)}>
                                        Nuevo impuesto
                                    </Button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <Table responsive className="table-bordered">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nombre</th>
                                            <th>Tipo</th>
                                            <th>Valor</th>
                                            <th>Monto calculado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fees.map((fee, index) => (
                                            <tr key={fee.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <Form.Control
                                                        value={fee.label}
                                                        disabled={fee.id === IVA_FEE_ID}
                                                        onChange={({ target: { value } }) => handleFeeChange(fee.id, 'label', value)}
                                                    />
                                                </td>
                                                <td>
                                                    <Form.Select
                                                        value={fee.type}
                                                        disabled={fee.id === IVA_FEE_ID}
                                                        onChange={({ target: { value } }) => handleFeeChange(fee.id, 'type', value)}
                                                    >
                                                        <option value="percent">Porcentaje</option>
                                                        <option value="fixed">Valor fijo</option>
                                                    </Form.Select>
                                                </td>
                                                <td>
                                                    <Form.Control
                                                        type="number"
                                                        value={fee.amount}
                                                        onChange={({ target: { value } }) => handleFeeChange(fee.id, 'amount', value)}
                                                    />
                                                </td>
                                                <td>{currencyFormatter.format(calculation.feeBreakdown[fee.id] ?? 0)}</td>
                                                <td>
                                                    <div className="d-flex" style={{ gap: 6 }}>
                                                        <Button size="sm" variant="outline-primary" disabled={index === 0} onClick={() => handleMoveFee(fee.id, 'up')}>↑</Button>
                                                        <Button size="sm" variant="outline-primary" disabled={index === fees.length - 1} onClick={() => handleMoveFee(fee.id, 'down')}>↓</Button>
                                                        <Button size="sm" variant="outline-danger" onClick={() => handleDeleteFee(fee.id)}>Quitar</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {fees.length === 0 && (
                                            <tr><td colSpan={6} className="text-center text-muted">Sin impuestos ni tarifas.</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                                <p className="mb-0 text-muted">
                                    Subtotal de compra: {currencyFormatter.format(calculation.purchaseSubtotal)} · Comisión importador: {currencyFormatter.format(calculation.importerCommissionAmount)}
                                </p>
                            </Card.Body>
                        </Card>

                        {/* Productos del lote */}
                        <Card className="mb-3">
                            <Card.Header>
                                <Card.Title as="h5" className="mb-0">Productos del lote</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Input
                                    label="Buscar producto"
                                    placeholder="Escribe al menos 3 letras"
                                    value={productSearch}
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setProductSearch(value)}
                                />

                                {searching && <p className="text-muted">Buscando...</p>}

                                {searchResults.length > 0 && (
                                    <div className="border rounded mb-3" style={{ maxHeight: 200, overflowY: 'auto' }}>
                                        {searchResults
                                            .filter((product) => !selectedIds.has(product.id))
                                            .map((product) => (
                                                <div key={product.id} className="d-flex justify-content-between align-items-center p-2 border-bottom">
                                                    <span>{product.name}</span>
                                                    <Button size="sm" variant="outline-primary" onClick={() => handleAddProducto(product)}>
                                                        Agregar
                                                    </Button>
                                                </div>
                                            ))}
                                    </div>
                                )}

                                <Table responsive className="table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Buenos</th>
                                            <th>Dañados</th>
                                            <th>Costo unitario</th>
                                            <th>Margen %</th>
                                            <th>PVP cliente (con IVA)</th>
                                            <th>PVP sin IVA</th>
                                            <th>Ganancia</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedProducts.map((product) => {
                                            const draft = itemDrafts[product.id] ?? buildDraftFromProduct(product);
                                            const item = calculation.items[product.id];
                                            return (
                                                <tr key={product.id}>
                                                    <td style={{ minWidth: 180 }}>{product.name}</td>
                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            min={0}
                                                            value={draft.receivedExcellentQuantity}
                                                            onChange={({ target: { value } }) => handleDraftChange(product.id, 'receivedExcellentQuantity', value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            min={0}
                                                            value={draft.receivedDamagedQuantity}
                                                            onChange={({ target: { value } }) => handleDraftChange(product.id, 'receivedDamagedQuantity', value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            min={0}
                                                            value={draft.unitCost}
                                                            onChange={({ target: { value } }) => handleDraftChange(product.id, 'unitCost', value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            value={draft.grossMarginPercent}
                                                            onChange={({ target: { value } }) => handleDraftChange(product.id, 'grossMarginPercent', value)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Automático"
                                                            value={draft.customerFinalPrice}
                                                            onChange={({ target: { value } }) => handleDraftChange(product.id, 'customerFinalPrice', value)}
                                                        />
                                                    </td>
                                                    <td>{currencyFormatter.format(item?.suggestedPvp ?? 0)}</td>
                                                    <td>{currencyFormatter.format(item?.totalProfit ?? 0)}</td>
                                                    <td>
                                                        <Button size="sm" variant="outline-danger" onClick={() => handleRemoveProducto(product.id)}>
                                                            Quitar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {selectedProducts.length === 0 && (
                                            <tr><td colSpan={9} className="text-center text-muted">Aun no agregas productos al lote.</td></tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>

                        {error !== '' && <p className="text-danger fw-bold">{error}</p>}

                        <Button className="me-2" variant="primary" type="submit">
                            {isEdit ? 'Guardar cambios' : 'Crear lote'}
                        </Button>
                        <Button variant="secondary" onClick={() => onClose()}>Cerrar</Button>
                    </Form>
                }
            />

            <ImpuestoFormModal
                open={isImpuestoFormOpen}
                tipoImpuestoOptions={tipoImpuestoOptions}
                onClose={() => setIsImpuestoFormOpen(false)}
                onSubmit={(dataImpuesto) => handleCreateImpuesto(dataImpuesto)}
            />
        </>
    );
};

export default LoteFormModal;
