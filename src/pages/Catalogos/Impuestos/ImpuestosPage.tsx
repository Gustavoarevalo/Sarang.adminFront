import { Button, Col, Form, Row } from "react-bootstrap";
import { Suspense, useCallback, useEffect } from "react";
import { useFillData } from "../../../Hooks/useFilldata";
import Input from "../../../Components/components/input/Input";
import { SelectPrincipal } from "../../../Components/components/Select/Selects";
import useDownloadExcelStore from "../../../store/DownloadExcellGlobal";
import GrowExample from "../../../Components/components/switch/spinner";
import ModalChangeLoading from "../../../Components/components/ModalChange";
import { ModalPrincipal } from "../../../Components/components/Modal/Modals";
import CrudTablet from "../../../Components/components/crudTablet/CrudTablet";
//prettier-ignore
import { alertglobal, AlertGlobalOptions } from "../../../Components/components/sweertAlert/sweertAlert";
import { UseImpuestos } from "../../../api/Controller/Catalogos/Impuestos/ImpuestosController";
import { UseDropDowns } from "../../../api/Controller/DropDowns/DropDownController";
//prettier-ignore
import { dataDefaultImpuestos, DataDefaultFilterImpuestosAdminDto, IdataDefaultImpuestos, IImpuestoDto, IUpsertImpuestoDto } from "../../../api/Controller/Catalogos/Impuestos/InterfaceImpuestos";
import { InterPerPages } from "../../../Components/components/crudTablet/componentsCrudTablet/itemPerPage";

const ImpuestosPage = () => {
    const _Impuestos = UseImpuestos();
    const _DropDowns = UseDropDowns();
    //prettier-ignore
    const data = useFillData<IdataDefaultImpuestos>({ ...dataDefaultImpuestos, filter: { ...DataDefaultFilterImpuestosAdminDto, take: InterPerPages } });
    const Download = useDownloadExcelStore();

    const renderGetDropDown = useCallback(async () => {
        try {
            data.updateData(await _DropDowns.getTipoImpuesto(), 'tipoImpuestoDropDown');
        } catch {
            data.updateData([], 'tipoImpuestoDropDown');
        }
    }, []);

    useEffect(() => {
        renderGetDropDown();
    }, [renderGetDropDown]);

    const renderGetData = useCallback(async () => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _Impuestos.Listar(data.data.filter);
            data.updateData(response.listarRegistros ?? [], 'data');
            data.updateData(response.countPage ?? 0, 'countPage');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudieron cargar los impuestos', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    }, [data.data.reinicarGetdata, data.data.filter]);

    useEffect(() => {
        renderGetData();
    }, [renderGetData]);

    const HandleAdd = () => {
        data.updateData(false, 'validate');
        data.updateData('Agregar', 'typeOperacion');
        data.updateData(0, 'idSeleccionado');
        //prettier-ignore
        data.updateData({ nombre: '', descripcion: '', enumTipoImpuesto: 0, valor: 0 }, 'operacion');
        data.updateData(true, 'modal');
    };

    const handleEdit = (id: number) => {
        const impuesto: IImpuestoDto | undefined = data.data.data.find((x) => x.id === id);
        data.updateData(false, 'validate');
        data.updateData('Editar', 'typeOperacion');
        data.updateData(impuesto?.id || 0, 'idSeleccionado');
        const DataEdit: IUpsertImpuestoDto = {
            nombre: impuesto?.nombre || '',
            descripcion: impuesto?.descripcion || '',
            enumTipoImpuesto: impuesto?.enumTipoImpuesto || 0,
            valor: impuesto?.valor || 0,
        };
        data.updateData(DataEdit, 'operacion');
        data.updateData(true, 'modal');
    };

    //prettier-ignore
    const RenderChangeOperacion = (value: string | number, field: keyof IUpsertImpuestoDto) => {
        const newdata: IUpsertImpuestoDto = {
            ...data.data.operacion,
            [field]: value
        };
        data.updateData(newdata, 'operacion');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        e.preventDefault();
        if (form.checkValidity() === false) {
            e.stopPropagation();
            data.updateData(true, 'validate');
            return;
        }

        if (data.data.operacion.enumTipoImpuesto === 0) {
            alertglobal('Info', 'Debe seleccionar el tipo de impuesto.', 'info');
            return;
        }

        data.updateData(false, 'validate');
        if (data.data.typeOperacion === 'Agregar') {
            renderAdd();
        } else {
            renderEdit();
        }
    };

    const renderAdd = async () => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _Impuestos.Crear(data.data.operacion);
            alertglobal('Exito', response.message || 'Impuesto creado', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
            data.updateData(false, 'modal');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo guardar el impuesto', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    const renderEdit = async () => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            //prettier-ignore
            const response = await _Impuestos.Actualizar(data.data.idSeleccionado, data.data.operacion);
            alertglobal('Exito', response.message || 'Impuesto actualizado', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
            data.updateData(false, 'modal');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo guardar el impuesto', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    const HandleDelete = async (id: number) => {
        const impuesto = data.data.data.find((x) => x.id === id);
        //prettier-ignore
        const confirm = await AlertGlobalOptions(`Seguro que deseas eliminar el impuesto "${impuesto?.nombre ?? ''}"?`, 'Eliminar', 'Cancelar');
        if (!confirm) {
            return;
        }

        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _Impuestos.Eliminar(id);
            alertglobal('Exito', response.message || 'Impuesto eliminado', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo eliminar el impuesto', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    const HandleAplicarFiltro = () => {
        data.updateData({ ...data.data.filter, skip: 0 }, 'filter');
        data.updateData(false, 'modalFilter');
    };

    const HandleLimpiarFiltro = () => {
        data.updateData({ ...DataDefaultFilterImpuestosAdminDto, take: InterPerPages }, 'filter');
        data.updateData(false, 'modalFilter');
    };

    const download = () => {
        Download.setFilename("Impuestos.xlsx");
        Download.setColumns([
            { header: "Nombre", key: "nombre", width: 25 },
            { header: "Descripcion", key: "descripcion", width: 35 },
            { header: "Tipo", key: "tipoImpuesto", width: 20 },
            { header: "Valor", key: "valor", width: 15 },
        ]);
        Download.setData(data.data.data.map((e) => ({
            nombre: e.nombre || '',
            descripcion: e.descripcion || '',
            tipoImpuesto: e.tipoImpuesto || '',
            valor: e.valor ?? 0,
        })));
        Download.downloadExcel();
    };

    return (
        <>
            <ModalChangeLoading open={data.data.loading} />
            <Suspense fallback={<GrowExample />}>
                <CrudTablet
                    active="Impuestos"
                    tittle="Impuestos"
                    tittleButton="Agregar Impuesto"
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
                        'Nombre': e.nombre || '',
                        'Descripción': e.descripcion || '',
                        'Tipo': e.tipoImpuesto || '',
                        'Valor': e.valor ?? 0,
                    }))}
                    NotViewData={["id"]}
                    hiddenEdit
                    onClickEdit={(e) => handleEdit(e["id"])}
                    hiddenDelete
                    onClickDelete={(e) => HandleDelete(e["id"])}
                />
            </Suspense>

            <ModalPrincipal
                open={data.data.modal}
                setOpen={() => data.updateData(false, 'modal')}
                tittle={data.data.typeOperacion === 'Agregar' ? 'Agregar Impuesto' : 'Editar Impuesto'}
                height={520}
                children={
                    <Form className="form-horizontal" noValidate validated={data.data.validate} onSubmit={handleSubmit}>
                        <Input
                            label="Nombre"
                            placeholder="Ej: Arancel"
                            required
                            disabled={data.data.disabled}
                            value={data.data.operacion.nombre}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(value, 'nombre')}
                        />

                        <Input
                            label="Descripción"
                            placeholder="Descripción del impuesto"
                            disabled={data.data.disabled}
                            value={data.data.operacion.descripcion}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(value, 'descripcion')}
                        />

                        <SelectPrincipal
                            label="Tipo de impuesto"
                            options={data.data.tipoImpuestoDropDown}
                            selectedRole={data.data.operacion.enumTipoImpuesto}
                            disabled={data.data.disabled}
                            required
                            //prettier-ignore
                            onChange={(value) => RenderChangeOperacion(value, 'enumTipoImpuesto')}
                        />

                        <Input
                            label="Valor"
                            placeholder="Ej: 12"
                            type="number"
                            min={0}
                            required
                            disabled={data.data.disabled}
                            value={data.data.operacion.valor}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(Number(value), 'valor')}
                        />

                        <Button className="me-2" variant="primary" type="submit" disabled={data.data.disabled}>
                            {data.data.typeOperacion === "Agregar" ? "Guardar" : "Editar"}
                        </Button>
                        <Button variant="secondary" onClick={() => data.updateData(false, 'modal')} disabled={data.data.disabled}>
                            Cerrar
                        </Button>
                    </Form>
                }
            />

            <ModalPrincipal
                open={data.data.modalFilter}
                setOpen={() => data.updateData(false, 'modalFilter')}
                tittle="Filtros"
                height={360}
                children={
                    <>
                        <Row>
                            <Col xl={12}>
                                <Input
                                    label="Nombre"
                                    placeholder="Buscar por nombre"
                                    value={data.data.filter.nombre || ''}
                                    //prettier-ignore
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => data.updateData({ ...data.data.filter, nombre: value === '' ? null : value }, 'filter')}
                                />
                            </Col>
                            <Col xl={12}>
                                <SelectPrincipal
                                    label="Tipo de impuesto"
                                    options={data.data.tipoImpuestoDropDown}
                                    //prettier-ignore
                                    selectedRole={data.data.tipoImpuestoDropDown.find(x => x.label === data.data.filter.tipoImpuesto)?.value || 0}
                                    //prettier-ignore
                                    onChange={(value) => data.updateData({ ...data.data.filter, tipoImpuesto: data.data.tipoImpuestoDropDown.find(x => x.value === value)?.label ?? null }, 'filter')}
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

export default ImpuestosPage;
