import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Suspense, useCallback, useEffect } from "react";
import { useFillData } from "../../Hooks/useFilldata";
import Input from "../../Components/components/input/Input";
import { SelectPrincipal } from "../../Components/components/Select/Selects";
import useDownloadExcelStore from "../../store/DownloadExcellGlobal";
import GrowExample from "../../Components/components/switch/spinner";
import ModalChangeLoading from "../../Components/components/ModalChange";
import { ModalPrincipal } from "../../Components/components/Modal/Modals";
import CrudTablet from "../../Components/components/crudTablet/CrudTablet";
import { alertglobal } from "../../Components/components/sweertAlert/sweertAlert";
import { UsePromotions } from "../../api/Controller/Promociones/PromocionesController";
import { UseProducts } from "../../api/Controller/Productos/ProductosController";
//prettier-ignore
import { DataDefaultFilterPromotionsAdminDto, IAdminPromotionDto, IFilterPromotionsAdminDto } from "../../api/Controller/Promociones/InterfacePromociones";
//prettier-ignore
import { DataDefaultFilterProductsAdminDto, IAdminInventoryProductDto } from "../../api/Controller/Productos/InterfaceProducts";
import { InterPerPages } from "../../Components/components/crudTablet/componentsCrudTablet/itemPerPage";
import { currencyFormatter, getPromotionStatusLabel, toNumber } from "./promotionCalculations";
import PromocionFormModal from "./PromocionFormModal";
import PromocionMediaModal from "./PromocionMediaModal";

const PROMOTION_STATUS_OPTIONS = [
    { value: 1, label: 'Pendiente', key: 'pending' as const },
    { value: 2, label: 'Activa', key: 'active' as const },
    { value: 3, label: 'Finalizada', key: 'finished' as const },
];

interface IdataPromociones {
    data: IAdminPromotionDto[];
    countPage: number;
    filter: IFilterPromotionsAdminDto;
    products: IAdminInventoryProductDto[];
    reinicarGetdata: boolean;
    disabled: boolean;
    loading: boolean;
    modal: boolean;
    modalFilter: boolean;
    modalRestock: boolean;
    modalMedia: boolean;
    editing: IAdminPromotionDto | null;
    restockPromotion: IAdminPromotionDto | null;
    mediaPromotion: IAdminPromotionDto | null;
    restockQuantity: string;
}

const dataDefaultPromociones: IdataPromociones = {
    data: [],
    countPage: 0,
    filter: { ...DataDefaultFilterPromotionsAdminDto, take: InterPerPages },
    products: [],
    reinicarGetdata: false,
    disabled: false,
    loading: false,
    modal: false,
    modalFilter: false,
    modalRestock: false,
    modalMedia: false,
    editing: null,
    restockPromotion: null,
    mediaPromotion: null,
    restockQuantity: '',
};

const PromocionesPage = () => {
    const _Promociones = UsePromotions();
    const _Productos = UseProducts();
    const data = useFillData<IdataPromociones>(dataDefaultPromociones);
    const Download = useDownloadExcelStore();

    const renderGetData = useCallback(async () => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const [productsData, promotionsData] = await Promise.all([
                _Productos.Listar({ ...DataDefaultFilterProductsAdminDto, take: 0 }),
                _Promociones.Listar(data.data.filter),
            ]);
            data.updateData(productsData.listarRegistros ?? [], 'products');
            data.updateData(promotionsData.listarRegistros ?? [], 'data');
            data.updateData(promotionsData.countPage ?? 0, 'countPage');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudieron cargar las promociones', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    }, [data.data.reinicarGetdata, data.data.filter]);

    useEffect(() => {
        renderGetData();
    }, [renderGetData]);

    const activeStock = data.data.data.reduce((sum, promotion) => sum + promotion.stock, 0);

    const HandleAdd = () => {
        data.updateData(null, 'editing');
        data.updateData(true, 'modal');
    };

    const handleEdit = (id: number) => {
        const promotion = data.data.data.find((x) => x.id === id);
        if (!promotion) {
            return;
        }

        if (promotion.status !== 'pending') {
            alertglobal('Info', 'Solo puedes editar promociones pendientes.', 'info');
            return;
        }

        data.updateData(promotion, 'editing');
        data.updateData(true, 'modal');
    };

    const handleVerMedia = (id: number) => {
        data.updateData(data.data.data.find((x) => x.id === id) ?? null, 'mediaPromotion');
        data.updateData(true, 'modalMedia');
    };

    const handleOpenRestock = (id: number) => {
        const promotion = data.data.data.find((x) => x.id === id);
        if (!promotion) {
            return;
        }

        if (promotion.status !== 'pending') {
            alertglobal('Info', 'Solo puedes aumentar stock en promociones pendientes.', 'info');
            return;
        }

        data.updateData(promotion, 'restockPromotion');
        data.updateData('', 'restockQuantity');
        data.updateData(true, 'modalRestock');
    };

    const handleRestock = async () => {
        const promotion = data.data.restockPromotion;
        const quantity = toNumber(data.data.restockQuantity);

        if (!promotion) {
            return;
        }

        if (quantity <= 0) {
            alertglobal('Info', 'Coloca una cantidad mayor a cero para aumentar stock.', 'info');
            return;
        }

        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            //prettier-ignore
            const response = await _Promociones.Reponer(promotion.id, { quantity: Math.floor(quantity) });
            alertglobal('Exito', response.message || 'Promoción repuesta', 'success');
            data.updateData(false, 'modalRestock');
            data.updateData(null, 'restockPromotion');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo reponer la promocion', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    //prettier-ignore
    const handleSubmitPromocion = async (editing: IAdminPromotionDto | null, formData: FormData) => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = editing
                ? await _Promociones.Actualizar(formData)
                : await _Promociones.Crear(formData);
            alertglobal('Exito', response.message || 'Promoción guardada', 'success');
            data.updateData(false, 'modal');
            data.updateData(null, 'editing');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
        } catch (error: any) {
            alertglobal('Info', error.response?.data?.message || 'No se pudo guardar la promocion', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    //prettier-ignore
    const RenderChangeFilter = (value: string | number | null, field: keyof IFilterPromotionsAdminDto) => {
        data.updateData({ ...data.data.filter, [field]: value }, 'filter');
    };

    const HandleAplicarFiltro = () => {
        data.updateData({ ...data.data.filter, skip: 0 }, 'filter');
        data.updateData(false, 'modalFilter');
    };

    const HandleLimpiarFiltro = () => {
        data.updateData({ ...DataDefaultFilterPromotionsAdminDto, take: InterPerPages }, 'filter');
        data.updateData(false, 'modalFilter');
    };

    const download = () => {
        Download.setFilename("Promociones.xlsx");
        Download.setColumns([
            { header: "Nombre", key: "name", width: 35 },
            { header: "Estado", key: "status", width: 15 },
            { header: "Inicio", key: "startDate", width: 15 },
            { header: "Fin", key: "endDate", width: 15 },
            { header: "Stock", key: "stock", width: 10 },
            { header: "Costo base", key: "baseCost", width: 15 },
            { header: "PVP sin IVA", key: "pvpWithoutIva", width: 15 },
            { header: "Precio final", key: "finalPriceWithIva", width: 15 },
            { header: "Ganancia", key: "profitAmount", width: 15 },
            { header: "Margen %", key: "grossMarginPercent", width: 12 },
        ]);
        Download.setData(data.data.data.map((e) => ({
            name: e.name || '',
            status: getPromotionStatusLabel(e.status),
            startDate: e.startDate || '',
            endDate: e.endDate || '',
            stock: e.stock ?? 0,
            baseCost: e.baseCost ?? 0,
            pvpWithoutIva: e.pvpWithoutIva ?? 0,
            finalPriceWithIva: e.finalPriceWithIva ?? 0,
            profitAmount: e.profitAmount ?? 0,
            grossMarginPercent: e.grossMarginPercent ?? 0,
        })));
        Download.downloadExcel();
    };

    return (
        <>
            <ModalChangeLoading open={data.data.loading} />
            <Suspense fallback={<GrowExample />}>
                <CrudTablet
                    active="Promociones"
                    tittle="Promociones"
                    tittleButton="Nueva Promoción"
                    hiddenButton
                    tittleButtonSecondary="Filtros"
                    hiddenButtonSecondary
                    onclickButtonSecondary={() => data.updateData(true, 'modalFilter')}
                    disabled={data.data.disabled}
                    onclickButtonPrimary={() => HandleAdd()}
                    downloadExcel={() => download()}
                    countPage={data.data.countPage}
                    _InterPerPages={InterPerPages}
                    //prettier-ignore
                    RenderChunk={(e) => data.updateData({ ...data.data.filter, skip: e.firstContentIndex, take: InterPerPages }, 'filter')}
                    ChildrenHeader={
                        <Row className="row-sm mb-3">
                            <Col xl={4}>
                                <Card><Card.Body>
                                    <p className="mb-1 text-muted">Promociones listadas</p>
                                    <h4 className="mb-0">{data.data.countPage || data.data.data.length}</h4>
                                </Card.Body></Card>
                            </Col>
                            <Col xl={4}>
                                <Card><Card.Body>
                                    <p className="mb-1 text-muted">Stock en promociones</p>
                                    <h4 className="mb-0">{activeStock}</h4>
                                </Card.Body></Card>
                            </Col>
                            <Col xl={4}>
                                <Card><Card.Body>
                                    <p className="mb-1 text-muted">Productos disponibles</p>
                                    <h4 className="mb-0">{data.data.products.length}</h4>
                                </Card.Body></Card>
                            </Col>
                        </Row>
                    }
                    data={data.data.data.map((e) => ({
                        'id': e.id || 0,
                        // La celda recibe el boton ya renderizado: la tabla pinta el valor tal cual.
                        'Galería': (e.media?.length ?? 0) === 0 ? (
                            <span className="text-muted">Sin imágenes</span>
                        ) : (
                            <Button
                                variant="outline-primary"
                                size="sm"
                                className="d-inline-flex align-items-center"
                                style={{ gap: 6 }}
                                onClick={() => handleVerMedia(e.id)}
                            >
                                <img
                                    src={e.media.find((m) => m.isCover)?.uri || e.media[0]?.uri}
                                    alt={e.name}
                                    style={{ borderRadius: 4, height: 26, objectFit: 'cover', width: 26 }}
                                />
                                Ver ({e.media.length})
                            </Button>
                        ),
                        'Nombre': e.name || '',
                        'Estado': getPromotionStatusLabel(e.status),
                        'Inicio': e.startDate || '',
                        'Fin': e.endDate || 'Sin fin',
                        'Stock': e.stock ?? 0,
                        'Costo base': currencyFormatter.format(e.baseCost ?? 0),
                        'Precio final': currencyFormatter.format(e.finalPriceWithIva ?? 0),
                        'Ganancia': currencyFormatter.format(e.profitAmount ?? 0),
                        'Margen %': `${(e.grossMarginPercent ?? 0).toFixed(2)}%`,
                    }))}
                    NotViewData={["id"]}
                    hiddenEdit
                    onClickEdit={(e) => handleEdit(e["id"])}
                    newAccion1={<i className="fe fe-plus-circle text-primary" title="Aumentar stock"></i>}
                    onclickAccion1={(e) => handleOpenRestock(e["id"])}
                />
            </Suspense>

            <PromocionFormModal
                open={data.data.modal}
                loading={data.data.loading}
                editing={data.data.editing}
                products={data.data.products}
                onClose={() => {
                    data.updateData(false, 'modal');
                    data.updateData(null, 'editing');
                }}
                onSubmit={(editing, formData) => handleSubmitPromocion(editing, formData)}
            />

            <PromocionMediaModal
                open={data.data.modalMedia}
                promotion={data.data.mediaPromotion}
                onClose={() => {
                    data.updateData(false, 'modalMedia');
                    data.updateData(null, 'mediaPromotion');
                }}
            />

            <ModalPrincipal
                open={data.data.modalRestock}
                setOpen={() => data.updateData(false, 'modalRestock')}
                tittle="Aumentar stock de la promoción"
                height={300}
                children={
                    <Form onSubmit={(e) => { e.preventDefault(); handleRestock(); }}>
                        <p className="fw-bold">{data.data.restockPromotion?.name}</p>
                        <Input
                            label="Cantidad a reponer"
                            type="number"
                            min={1}
                            disabled={data.data.disabled}
                            value={data.data.restockQuantity}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => data.updateData(value, 'restockQuantity')}
                        />
                        <Button className="me-2" variant="primary" type="submit" disabled={data.data.disabled}>Reponer</Button>
                        <Button variant="secondary" onClick={() => data.updateData(false, 'modalRestock')} disabled={data.data.disabled}>Cerrar</Button>
                    </Form>
                }
            />

            <ModalPrincipal
                open={data.data.modalFilter}
                setOpen={() => data.updateData(false, 'modalFilter')}
                tittle="Filtros"
                width={800}
                height={560}
                children={
                    <>
                        <Row>
                            <Col xl={6}>
                                <Input
                                    label="Nombre"
                                    placeholder="Buscar por nombre"
                                    value={data.data.filter.name || ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeFilter(value === '' ? null : value, 'name')}
                                />
                            </Col>
                            <Col xl={6}>
                                <SelectPrincipal
                                    label="Estado"
                                    options={PROMOTION_STATUS_OPTIONS.map(({ value, label }) => ({ value, label }))}
                                    //prettier-ignore
                                    selectedRole={PROMOTION_STATUS_OPTIONS.find(x => x.key === data.data.filter.status)?.value || 0}
                                    //prettier-ignore
                                    onChange={(value) => data.updateData({ ...data.data.filter, status: PROMOTION_STATUS_OPTIONS.find(x => x.value === value)?.key ?? null }, 'filter')}
                                />
                            </Col>
                            <Col xl={6}>
                                <Input
                                    label="Stock mínimo"
                                    type="number"
                                    min={0}
                                    value={data.data.filter.stockMin ?? ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeFilter(value === '' ? null : Number(value), 'stockMin')}
                                />
                            </Col>
                            <Col xl={6}>
                                <Input
                                    label="Stock máximo"
                                    type="number"
                                    min={0}
                                    value={data.data.filter.stockMax ?? ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeFilter(value === '' ? null : Number(value), 'stockMax')}
                                />
                            </Col>
                            <Col xl={6}>
                                <Input
                                    label="Precio mínimo"
                                    type="number"
                                    min={0}
                                    value={data.data.filter.priceMin ?? ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeFilter(value === '' ? null : Number(value), 'priceMin')}
                                />
                            </Col>
                            <Col xl={6}>
                                <Input
                                    label="Precio máximo"
                                    type="number"
                                    min={0}
                                    value={data.data.filter.priceMax ?? ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeFilter(value === '' ? null : Number(value), 'priceMax')}
                                />
                            </Col>
                            <Col xl={6}>
                                <Input
                                    label="Inicio desde"
                                    type="date"
                                    value={data.data.filter.startDateFrom || ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeFilter(value === '' ? null : value, 'startDateFrom')}
                                />
                            </Col>
                            <Col xl={6}>
                                <Input
                                    label="Inicio hasta"
                                    type="date"
                                    value={data.data.filter.startDateTo || ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeFilter(value === '' ? null : value, 'startDateTo')}
                                />
                            </Col>
                            <Col xl={6}>
                                <Input
                                    label="Fin desde"
                                    type="date"
                                    value={data.data.filter.endDateFrom || ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeFilter(value === '' ? null : value, 'endDateFrom')}
                                />
                            </Col>
                            <Col xl={6}>
                                <Input
                                    label="Fin hasta"
                                    type="date"
                                    value={data.data.filter.endDateTo || ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeFilter(value === '' ? null : value, 'endDateTo')}
                                />
                            </Col>
                        </Row>

                        <Button className="me-2" variant="primary" onClick={() => HandleAplicarFiltro()}>Aplicar</Button>
                        <Button variant="secondary" onClick={() => HandleLimpiarFiltro()}>Limpiar</Button>
                    </>
                }
            />
        </>
    );
};

export default PromocionesPage;
