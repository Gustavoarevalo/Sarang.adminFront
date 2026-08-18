import { Button, Form } from "react-bootstrap";
import { Suspense, useCallback, useEffect } from "react";
import { useFillData } from "../../../Hooks/useFilldata";
import Input from "../../../Components/components/input/Input";
import Switch from "../../../Components/components/switch/switch";
import useDownloadExcelStore from "../../../store/DownloadExcellGlobal";
import GrowExample from "../../../Components/components/switch/spinner";
import ModalChangeLoading from "../../../Components/components/ModalChange";
import { ModalPrincipal } from "../../../Components/components/Modal/Modals";
import CrudTablet from "../../../Components/components/crudTablet/CrudTablet";
//prettier-ignore
import { alertglobal, AlertGlobalOptions } from "../../../Components/components/sweertAlert/sweertAlert";
import { UseIva } from "../../../api/Controller/Catalogos/Iva/IvaController";
//prettier-ignore
import { dataDefaultIva, IdataDefaultIva, IIvaDto, IUpsertIvaDto } from "../../../api/Controller/Catalogos/Iva/InterfaceIva";

const IvaPage = () => {
    const _Iva = UseIva();
    const data = useFillData<IdataDefaultIva>(dataDefaultIva);
    const Download = useDownloadExcelStore();

    const renderGetData = useCallback(async () => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _Iva.Listar(data.data.filter);
            data.updateData(response.listarRegistros ?? [], 'data');
            data.updateData(response.countPage ?? 0, 'countPage');
        } catch (error: any) {
            alertglobal('Info', error.response?.data?.message || 'No se pudo cargar el IVA', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    }, [data.data.reinicarGetdata]);

    useEffect(() => {
        renderGetData();
    }, [renderGetData]);

    const HandleAdd = () => {
        data.updateData(false, 'validate');
        data.updateData('Agregar', 'typeOperacion');
        data.updateData(0, 'idSeleccionado');
        data.updateData({ porcentaje: 0, esPredeterminado: false }, 'operacion');
        data.updateData(true, 'modal');
    };

    const handleEdit = (id: number) => {
        const iva: IIvaDto | undefined = data.data.data.find((x) => x.id === id);
        data.updateData(false, 'validate');
        data.updateData('Editar', 'typeOperacion');
        data.updateData(iva?.id || 0, 'idSeleccionado');
        const DataEdit: IUpsertIvaDto = {
            porcentaje: iva?.porcentaje || 0,
            esPredeterminado: iva?.esPredeterminado || false,
        };
        data.updateData(DataEdit, 'operacion');
        data.updateData(true, 'modal');
    };

    //prettier-ignore
    const RenderChangeOperacion = (value: string | number | boolean, field: keyof IUpsertIvaDto) => {
        const newdata: IUpsertIvaDto = {
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

        if (data.data.operacion.porcentaje < 0 || data.data.operacion.porcentaje > 100) {
            alertglobal('Info', 'El porcentaje debe estar entre 0 y 100.', 'info');
            return;
        }

        data.updateData(false, 'validate');
        onclickOperacion();
    };

    const onclickOperacion = () => {
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
            const response = await _Iva.Crear(data.data.operacion);
            alertglobal('Exito', response.message || 'IVA creado', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
            data.updateData(false, 'modal');
        } catch (error: any) {
            alertglobal('Info', error.response?.data?.message || 'No se pudo guardar el IVA', 'info');
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
            const response = await _Iva.Actualizar(data.data.idSeleccionado, data.data.operacion);
            alertglobal('Exito', response.message || 'IVA actualizado', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
            data.updateData(false, 'modal');
        } catch (error: any) {
            alertglobal('Info', error.response?.data?.message || 'No se pudo guardar el IVA', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    const HandleDelete = async (id: number) => {
        const iva = data.data.data.find((x) => x.id === id);

        if (iva?.esPredeterminado) {
            alertglobal('Info', 'No se puede eliminar el IVA predeterminado.', 'info');
            return;
        }

        //prettier-ignore
        const confirm = await AlertGlobalOptions(`Seguro que deseas eliminar el IVA de ${iva?.porcentaje ?? 0}%?`, 'Eliminar', 'Cancelar');
        if (!confirm) {
            return;
        }

        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _Iva.Eliminar(id);
            alertglobal('Exito', response.message || 'IVA eliminado', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
        } catch (error: any) {
            alertglobal('Info', error.response?.data?.message || 'No se pudo eliminar el IVA', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    const download = () => {
        Download.setFilename("Iva.xlsx");
        Download.setColumns([
            { header: "Porcentaje", key: "porcentaje", width: 15 },
            { header: "Predeterminado", key: "esPredeterminado", width: 20 },
        ]);
        Download.setData(data.data.data.map((e) => ({
            porcentaje: `${e.porcentaje}%`,
            esPredeterminado: e.esPredeterminado ? 'Si' : 'No',
        })));
        Download.downloadExcel();
    };

    return (
        <>
            <ModalChangeLoading open={data.data.loading} />
            <Suspense fallback={<GrowExample />}>
                <CrudTablet
                    active="IVA"
                    tittle="Porcentajes de IVA"
                    tittleButton="Agregar IVA"
                    hiddenButton
                    disabled={data.data.disabled}
                    onclickButtonPrimary={() => HandleAdd()}
                    downloadExcel={() => download()}
                    data={data.data.data.map((e) => ({
                        'id': e.id || 0,
                        'Porcentaje': `${e.porcentaje ?? 0}%`,
                        'Predeterminado': e.esPredeterminado ? 'Si' : 'No',
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
                tittle={data.data.typeOperacion === 'Agregar' ? 'Agregar IVA' : 'Editar IVA'}
                height={330}
                children={
                    <Form className="form-horizontal" noValidate validated={data.data.validate} onSubmit={handleSubmit}>
                        <Input
                            className="mb-2"
                            label="Porcentaje (%)"
                            placeholder="Ej: 15"
                            type="number"
                            min={0}
                            max={100}
                            required
                            disabled={data.data.disabled}
                            value={data.data.operacion.porcentaje}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(Number(value), 'porcentaje')}
                        />

                        <Switch
                            label="Predeterminado"
                            disabled={data.data.disabled}
                            checked={data.data.operacion.esPredeterminado}
                            //prettier-ignore
                            onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(checked, 'esPredeterminado')}
                        />

                        <p className="text-muted mt-2 mb-3">Solo un IVA puede ser el predeterminado.</p>

                        <Button className="me-2" variant="primary" type="submit" disabled={data.data.disabled}>
                            {data.data.typeOperacion === "Agregar" ? "Guardar" : "Editar"}
                        </Button>
                        <Button variant="secondary" onClick={() => data.updateData(false, 'modal')} disabled={data.data.disabled}>
                            Cerrar
                        </Button>
                    </Form>
                }
            />
        </>
    );
};

export default IvaPage;
