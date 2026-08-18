import { Button, Card, Col, Row } from "react-bootstrap";
import { Suspense, useCallback, useEffect } from "react";
import { useFillData } from "../../Hooks/useFilldata";
import Input from "../../Components/components/input/Input";
import { SelectPrincipal } from "../../Components/components/Select/Selects";
import useDownloadExcelStore from "../../store/DownloadExcellGlobal";
import GrowExample from "../../Components/components/switch/spinner";
import ModalChangeLoading from "../../Components/components/ModalChange";
import { ModalPrincipal } from "../../Components/components/Modal/Modals";
import CrudTablet from "../../Components/components/crudTablet/CrudTablet";
//prettier-ignore
import { alertglobal, AlertGlobalOptions } from "../../Components/components/sweertAlert/sweertAlert";
import { UseDiscounts } from "../../api/Controller/Descuentos/DescuentosController";
import { UseProducts } from "../../api/Controller/Productos/ProductosController";
import { UsePromotions } from "../../api/Controller/Promociones/PromocionesController";
//prettier-ignore
import { DataDefaultFilterDescuentosAdminDto, DISCOUNT_TARGET, DISCOUNT_TYPE, IAdminDiscountDto, IAdminDiscountFormDto, IFilterDescuentosAdminDto } from "../../api/Controller/Descuentos/InterfaceDescuentos";
import { DataDefaultFilterProductsAdminDto } from "../../api/Controller/Productos/InterfaceProducts";
import { DataDefaultFilterPromotionsAdminDto } from "../../api/Controller/Promociones/InterfacePromociones";
import { InterPerPages } from "../../Components/components/crudTablet/componentsCrudTablet/itemPerPage";
import { currencyFormatter } from "../Promociones/promotionCalculations";
import DescuentoFormModal, { DiscountTargetOption } from "./DescuentoFormModal";

interface IdataDescuentos {
    data: IAdminDiscountDto[];
    countPage: number;
    filter: IFilterDescuentosAdminDto;
    productOptions: DiscountTargetOption[];
    promotionOptions: DiscountTargetOption[];
    reinicarGetdata: boolean;
    disabled: boolean;
    loading: boolean;
    modal: boolean;
    modalFilter: boolean;
    editing: IAdminDiscountDto | null;
}

const dataDefaultDescuentos: IdataDescuentos = {
    data: [],
    countPage: 0,
    filter: { ...DataDefaultFilterDescuentosAdminDto, take: InterPerPages },
    productOptions: [],
    promotionOptions: [],
    reinicarGetdata: false,
    disabled: false,
    loading: false,
    modal: false,
    modalFilter: false,
    editing: null,
};

const DescuentosPage = () => {
    const _Descuentos = UseDiscounts();
    const _Productos = UseProducts();
    const _Promociones = UsePromotions();
    const data = useFillData<IdataDescuentos>(dataDefaultDescuentos);
    const Download = useDownloadExcelStore();

    const renderGetData = useCallback(async () => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const [discountsData, productsData, promotionsData] = await Promise.all([
                _Descuentos.Listar(data.data.filter),
                _Productos.Listar(DataDefaultFilterProductsAdminDto),
                _Promociones.Listar(DataDefaultFilterPromotionsAdminDto),
            ]);

            data.updateData(discountsData.listarRegistros ?? [], 'data');
            data.updateData(discountsData.countPage ?? 0, 'countPage');
            //prettier-ignore
            data.updateData((productsData.listarRegistros ?? []).map((product) => ({
                id: product.id,
                name: product.name,
                baseCost: product.backendUnitCost,
                finalPriceWithIva: product.price,
            })), 'productOptions');
            //prettier-ignore
            data.updateData((promotionsData.listarRegistros ?? []).map((promotion) => ({
                id: promotion.id,
                name: promotion.name,
                baseCost: promotion.baseCost,
                finalPriceWithIva: promotion.finalPriceWithIva,
            })), 'promotionOptions');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudieron cargar los descuentos', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    }, [data.data.reinicarGetdata, data.data.filter]);

    useEffect(() => {
        renderGetData();
    }, [renderGetData]);

    const HandleAdd = () => {
        data.updateData(null, 'editing');
        data.updateData(true, 'modal');
    };

    const handleEdit = (id: number) => {
        data.updateData(data.data.data.find((x) => x.id === id) ?? null, 'editing');
        data.updateData(true, 'modal');
    };

    //prettier-ignore
    const handleSubmitDescuento = async (id: number | null, form: IAdminDiscountFormDto) => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = id ? await _Descuentos.Actualizar(form) : await _Descuentos.Crear(form);
            alertglobal('Exito', response.message || 'Descuento guardado', 'success');
            data.updateData(false, 'modal');
            data.updateData(null, 'editing');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
        } catch (error: any) {
            alertglobal('Info', error.response?.data?.message || 'No se pudo guardar el descuento', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    const HandleDelete = async (id: number) => {
        const descuento = data.data.data.find((x) => x.id === id);
        //prettier-ignore
        const confirm = await AlertGlobalOptions(`Seguro que deseas eliminar el descuento de "${descuento?.targetName ?? ''}"?`, 'Eliminar', 'Cancelar');
        if (!confirm) {
            return;
        }

        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _Descuentos.Eliminar(id);
            alertglobal('Exito', response.message || 'Descuento eliminado', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo eliminar el descuento', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    //prettier-ignore
    const RenderChangeFilter = (value: string | number | boolean | null, field: keyof IFilterDescuentosAdminDto) => {
        data.updateData({ ...data.data.filter, [field]: value }, 'filter');
    };

    const HandleAplicarFiltro = () => {
        data.updateData({ ...data.data.filter, skip: 0 }, 'filter');
        data.updateData(false, 'modalFilter');
    };

    const HandleLimpiarFiltro = () => {
        data.updateData({ ...DataDefaultFilterDescuentosAdminDto, take: InterPerPages }, 'filter');
        data.updateData(false, 'modalFilter');
    };

    //prettier-ignore
    const formatDiscount = (tipo: number, valor: number) =>
        tipo === DISCOUNT_TYPE.Porcentaje ? `${valor}%` : currencyFormatter.format(valor);

    const download = () => {
        Download.setFilename("Descuentos.xlsx");
        Download.setColumns([
            { header: "Aplica a", key: "targetTypeNombre", width: 15 },
            { header: "Objetivo", key: "targetName", width: 30 },
            { header: "Tipo", key: "tipoDescuentoNombre", width: 15 },
            { header: "Valor", key: "valorDescuento", width: 12 },
            { header: "Inicio", key: "startDate", width: 15 },
            { header: "Fin", key: "endDate", width: 15 },
            { header: "Precio original", key: "originalFinalWithIva", width: 18 },
            { header: "Precio con descuento", key: "discountedFinalWithIva", width: 20 },
        ]);
        Download.setData(data.data.data.map((e) => ({
            targetTypeNombre: e.targetTypeNombre || '',
            targetName: e.targetName || '',
            tipoDescuentoNombre: e.tipoDescuentoNombre || '',
            valorDescuento: e.valorDescuento ?? 0,
            startDate: e.startDate || '',
            endDate: e.endDate || '',
            originalFinalWithIva: e.originalFinalWithIva ?? 0,
            discountedFinalWithIva: e.discountedFinalWithIva ?? 0,
        })));
        Download.downloadExcel();
    };

    return (
        <>
            <ModalChangeLoading open={data.data.loading} />
            <Suspense fallback={<GrowExample />}>
                <CrudTablet
                    active="Descuentos"
                    tittle="Descuentos"
                    tittleButton="Nuevo Descuento"
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
                                    <p className="mb-1 text-muted">Descuentos</p>
                                    <h4 className="mb-0">{data.data.data.length}</h4>
                                </Card.Body></Card>
                            </Col>
                            <Col xl={4}>
                                <Card><Card.Body>
                                    <p className="mb-1 text-muted">Productos</p>
                                    <h4 className="mb-0">{data.data.productOptions.length}</h4>
                                </Card.Body></Card>
                            </Col>
                            <Col xl={4}>
                                <Card><Card.Body>
                                    <p className="mb-1 text-muted">Promociones</p>
                                    <h4 className="mb-0">{data.data.promotionOptions.length}</h4>
                                </Card.Body></Card>
                            </Col>
                        </Row>
                    }
                    data={data.data.data.map((e) => ({
                        'id': e.id || 0,
                        'Aplica a': e.targetTypeNombre || '',
                        'Objetivo': e.targetName || '',
                        'Descuento': formatDiscount(e.tipoDescuento, e.valorDescuento ?? 0),
                        'Inicio': e.startDate || '',
                        'Fin': e.endDate || '',
                        'Precio original': currencyFormatter.format(e.originalFinalWithIva ?? 0),
                        'Precio con descuento': currencyFormatter.format(e.discountedFinalWithIva ?? 0),
                    }))}
                    NotViewData={["id"]}
                    hiddenEdit
                    onClickEdit={(e) => handleEdit(e["id"])}
                    hiddenDelete
                    onClickDelete={(e) => HandleDelete(e["id"])}
                />
            </Suspense>

            <DescuentoFormModal
                open={data.data.modal}
                loading={data.data.loading}
                editing={data.data.editing}
                productOptions={data.data.productOptions}
                promotionOptions={data.data.promotionOptions}
                onClose={() => {
                    data.updateData(false, 'modal');
                    data.updateData(null, 'editing');
                }}
                onSubmit={(id, form) => handleSubmitDescuento(id, form)}
            />

            <ModalPrincipal
                open={data.data.modalFilter}
                setOpen={() => data.updateData(false, 'modalFilter')}
                tittle="Filtros"
                width={700}
                height={460}
                children={
                    <>
                        <Row>
                            <Col xl={12}>
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
                                    label="Aplica a"
                                    options={[
                                        { value: DISCOUNT_TARGET.Producto, label: 'Producto' },
                                        { value: DISCOUNT_TARGET.Promocion, label: 'Promoción' },
                                    ]}
                                    selectedRole={data.data.filter.targetType ?? 0}
                                    onChange={(value) => RenderChangeFilter(value === 0 ? null : value, 'targetType')}
                                />
                            </Col>
                            <Col xl={6}>
                                <SelectPrincipal
                                    label="Tipo de descuento"
                                    options={[
                                        { value: DISCOUNT_TYPE.Porcentaje, label: 'Porcentaje (%)' },
                                        { value: DISCOUNT_TYPE.Fijo, label: 'Valor fijo ($)' },
                                    ]}
                                    selectedRole={data.data.filter.tipoDescuento ?? 0}
                                    onChange={(value) => RenderChangeFilter(value === 0 ? null : value, 'tipoDescuento')}
                                />
                            </Col>
                            <Col xl={6}>
                                <SelectPrincipal
                                    label="Vigencia"
                                    options={[
                                        { value: 1, label: 'Solo vigentes' },
                                        { value: 2, label: 'Todos' },
                                    ]}
                                    //prettier-ignore
                                    selectedRole={data.data.filter.soloVigentes === null ? 0 : data.data.filter.soloVigentes ? 1 : 2}
                                    //prettier-ignore
                                    onChange={(value) => RenderChangeFilter(value === 0 ? null : value === 1, 'soloVigentes')}
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

export default DescuentosPage;
