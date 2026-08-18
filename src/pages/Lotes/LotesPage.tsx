import { Button, Col, Row } from "react-bootstrap";
import { Suspense, useCallback, useEffect } from "react";
import { useFillData } from "../../Hooks/useFilldata";
import Input from "../../Components/components/input/Input";
import useDownloadExcelStore from "../../store/DownloadExcellGlobal";
import GrowExample from "../../Components/components/switch/spinner";
import ModalChangeLoading from "../../Components/components/ModalChange";
import { ModalPrincipal } from "../../Components/components/Modal/Modals";
import CrudTablet from "../../Components/components/crudTablet/CrudTablet";
import { alertglobal } from "../../Components/components/sweertAlert/sweertAlert";
import { UseLotes } from "../../api/Controller/Lotes/LotesController";
import { UseIva } from "../../api/Controller/Catalogos/Iva/IvaController";
import { UseImpuestos } from "../../api/Controller/Catalogos/Impuestos/ImpuestosController";
import { UseDropDowns } from "../../api/Controller/DropDowns/DropDownController";
//prettier-ignore
import { DataDefaultFilterLotesAdminDto, IAdminLoteDto, IFilterLotesAdminDto, IUpsertLoteDto } from "../../api/Controller/Lotes/InterfaceLotes";
//prettier-ignore
import { DataDefaultFilterImpuestosAdminDto, IImpuestoDto, IUpsertImpuestoDto } from "../../api/Controller/Catalogos/Impuestos/InterfaceImpuestos";
//prettier-ignore
import { DataDefaultFilterIvaAdminDto, IIvaDto } from "../../api/Controller/Catalogos/Iva/InterfaceIva";
import { IDropBoxGlobal } from "../../helper/VariablesGLobal";
import { InterPerPages } from "../../Components/components/crudTablet/componentsCrudTablet/itemPerPage";
import { currencyFormatter } from "./loteCalculations";
import LoteFormModal from "./LoteFormModal";
import LoteDetailModal from "./LoteDetailModal";

interface IdataLotes {
    data: IAdminLoteDto[];
    countPage: number;
    filter: IFilterLotesAdminDto;
    reinicarGetdata: boolean;
    disabled: boolean;
    loading: boolean;
    modal: boolean;
    modalFilter: boolean;
    modalDetalle: boolean;
    editing: IAdminLoteDto | null;
    detalle: IAdminLoteDto | null;
    ivaOptions: IIvaDto[];
    impuestosOptions: IImpuestoDto[];
    tipoImpuestoOptions: IDropBoxGlobal[];
}

const dataDefaultLotes: IdataLotes = {
    data: [],
    countPage: 0,
    filter: { ...DataDefaultFilterLotesAdminDto, take: InterPerPages },
    reinicarGetdata: false,
    disabled: false,
    loading: false,
    modal: false,
    modalFilter: false,
    modalDetalle: false,
    editing: null,
    detalle: null,
    ivaOptions: [],
    impuestosOptions: [],
    tipoImpuestoOptions: [],
};

const LotesPage = () => {
    const _Lotes = UseLotes();
    const _Iva = UseIva();
    const _Impuestos = UseImpuestos();
    const _DropDowns = UseDropDowns();
    const data = useFillData<IdataLotes>(dataDefaultLotes);
    const Download = useDownloadExcelStore();

    const renderGetCatalogos = useCallback(async () => {
        try {
            const [ivaData, impuestosData, tipoImpuestoData] = await Promise.all([
                _Iva.Listar(DataDefaultFilterIvaAdminDto),
                _Impuestos.Listar({ ...DataDefaultFilterImpuestosAdminDto, take: 0 }),
                _DropDowns.getTipoImpuesto(),
            ]);
            data.updateData(ivaData.listarRegistros ?? [], 'ivaOptions');
            data.updateData(impuestosData.listarRegistros ?? [], 'impuestosOptions');
            data.updateData(tipoImpuestoData, 'tipoImpuestoOptions');
        } catch {
            data.updateData([], 'ivaOptions');
            data.updateData([], 'impuestosOptions');
            data.updateData([], 'tipoImpuestoOptions');
        }
    }, []);

    useEffect(() => {
        renderGetCatalogos();
    }, [renderGetCatalogos]);

    const renderGetData = useCallback(async () => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _Lotes.Listar(data.data.filter);
            data.updateData(response.listarRegistros ?? [], 'data');
            data.updateData(response.countPage ?? 0, 'countPage');
        } catch (error: any) {
            alertglobal('Info', error.response?.data?.message || 'No se pudieron cargar los lotes', 'info');
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
        const lote = data.data.data.find((x) => x.id === id);
        if (!lote) {
            return;
        }

        // Un lote ya publicado (fecha de salida hoy o pasada) no se puede editar.
        const fechaSalida = lote.fechaSalidaVenta ? new Date(`${lote.fechaSalidaVenta}T00:00:00`) : null;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (fechaSalida && fechaSalida <= hoy) {
            //prettier-ignore
            alertglobal('No editable', 'La fecha de publicacion del lote es hoy o futura; no se puede editar.', 'info');
            return;
        }

        data.updateData(lote, 'editing');
        data.updateData(true, 'modal');
    };

    const handleVerDetalle = (id: number) => {
        data.updateData(data.data.data.find((x) => x.id === id) ?? null, 'detalle');
        data.updateData(true, 'modalDetalle');
    };

    const handleSubmitLote = async (id: number | null, dataLote: IUpsertLoteDto) => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            //prettier-ignore
            const response = id ? await _Lotes.Actualizar(id, dataLote) : await _Lotes.Crear(dataLote);
            alertglobal('Exito', response.message || 'Lote guardado', 'success');
            data.updateData(false, 'modal');
            data.updateData(null, 'editing');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
        } catch (error: any) {
            alertglobal('Info', error.response?.data?.message || 'No se pudo guardar el lote', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    // Crea el impuesto en el catalogo desde el modal del lote y lo devuelve.
    const handleCreateImpuesto = async (dataImpuesto: IUpsertImpuestoDto): Promise<IImpuestoDto | null> => {
        try {
            const response = await _Impuestos.Crear(dataImpuesto);
            if (response.success && response.detail) {
                data.updateData([...data.data.impuestosOptions, response.detail], 'impuestosOptions');
                return response.detail;
            }
            alertglobal('Info', response.message || 'No se pudo crear el impuesto', 'info');
            return null;
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo crear el impuesto', 'info');
            return null;
        }
    };

    //prettier-ignore
    const RenderChangeFilter = (value: string | number | null, field: keyof IFilterLotesAdminDto) => {
        data.updateData({ ...data.data.filter, [field]: value }, 'filter');
    };

    const HandleAplicarFiltro = () => {
        data.updateData({ ...data.data.filter, skip: 0 }, 'filter');
        data.updateData(false, 'modalFilter');
    };

    const HandleLimpiarFiltro = () => {
        data.updateData({ ...DataDefaultFilterLotesAdminDto, take: InterPerPages }, 'filter');
        data.updateData(false, 'modalFilter');
    };

    const download = () => {
        Download.setFilename("Lotes.xlsx");
        Download.setColumns([
            { header: "Codigo", key: "codigoLote", width: 20 },
            { header: "Descripcion", key: "descripcion", width: 30 },
            { header: "Valor lote", key: "valorLote", width: 15 },
            { header: "Impuestos/envio", key: "costoEnvio", width: 18 },
            { header: "Costo total", key: "costoTotal", width: 15 },
            { header: "Llegada", key: "fechaLlegada", width: 15 },
            { header: "Publicacion", key: "fechaSalidaVenta", width: 15 },
            { header: "Productos", key: "totalProductos", width: 12 },
            { header: "Unidades", key: "totalUnidades", width: 12 },
        ]);
        Download.setData(data.data.data.map((e) => ({
            codigoLote: e.codigoLote || '',
            descripcion: e.descripcion || '',
            valorLote: e.valorLote ?? 0,
            costoEnvio: e.costoEnvio ?? 0,
            costoTotal: e.costoTotal ?? 0,
            fechaLlegada: e.fechaLlegada ?? '',
            fechaSalidaVenta: e.fechaSalidaVenta ?? '',
            totalProductos: e.totalProductos ?? 0,
            totalUnidades: e.totalUnidades ?? 0,
        })));
        Download.downloadExcel();
    };

    return (
        <>
            <ModalChangeLoading open={data.data.loading} />
            <Suspense fallback={<GrowExample />}>
                <CrudTablet
                    active="Lotes"
                    tittle="Lotes"
                    tittleButton="Nuevo Lote"
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
                    data={data.data.data.map((e) => ({
                        'id': e.id || 0,
                        'Código': e.codigoLote || '',
                        'Descripción': e.descripcion || '',
                        'Valor lote': currencyFormatter.format(e.valorLote ?? 0),
                        'Impuestos': currencyFormatter.format(e.costoEnvio ?? 0),
                        'Costo total': currencyFormatter.format(e.costoTotal ?? 0),
                        'Llegada': e.fechaLlegada ?? 'Sin fecha',
                        'Publicación': e.fechaSalidaVenta ?? 'Sin fecha',
                        'Productos': e.totalProductos ?? 0,
                        'Unidades': e.totalUnidades ?? 0,
                    }))}
                    NotViewData={["id"]}
                    hiddenEye
                    onClickEye={(e) => handleVerDetalle(e["id"])}
                    hiddenEdit
                    onClickEdit={(e) => handleEdit(e["id"])}
                />
            </Suspense>

            <LoteFormModal
                open={data.data.modal}
                editing={data.data.editing}
                ivaOptions={data.data.ivaOptions}
                impuestosOptions={data.data.impuestosOptions}
                tipoImpuestoOptions={data.data.tipoImpuestoOptions}
                onClose={() => {
                    data.updateData(false, 'modal');
                    data.updateData(null, 'editing');
                }}
                onSubmit={(id, dataLote) => handleSubmitLote(id, dataLote)}
                onCreateImpuesto={(dataImpuesto) => handleCreateImpuesto(dataImpuesto)}
            />

            <LoteDetailModal
                open={data.data.modalDetalle}
                lote={data.data.detalle}
                onClose={() => {
                    data.updateData(false, 'modalDetalle');
                    data.updateData(null, 'detalle');
                }}
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
                                    label="Código"
                                    placeholder="Buscar por código"
                                    value={data.data.filter.codigo || ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeFilter(value === '' ? null : value, 'codigo')}
                                />
                            </Col>
                            <Col xl={6}>
                                <Input
                                    label="Fecha desde"
                                    type="date"
                                    value={data.data.filter.fechaDesde || ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeFilter(value === '' ? null : value, 'fechaDesde')}
                                />
                            </Col>
                            <Col xl={6}>
                                <Input
                                    label="Fecha hasta"
                                    type="date"
                                    value={data.data.filter.fechaHasta || ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeFilter(value === '' ? null : value, 'fechaHasta')}
                                />
                            </Col>
                            <Col xl={6}>
                                <Input
                                    label="Valor mínimo"
                                    type="number"
                                    min={0}
                                    value={data.data.filter.valorMin ?? ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeFilter(value === '' ? null : Number(value), 'valorMin')}
                                />
                            </Col>
                            <Col xl={6}>
                                <Input
                                    label="Valor máximo"
                                    type="number"
                                    min={0}
                                    value={data.data.filter.valorMax ?? ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeFilter(value === '' ? null : Number(value), 'valorMax')}
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

export default LotesPage;
