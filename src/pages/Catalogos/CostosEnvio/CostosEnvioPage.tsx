import { Button, Form } from "react-bootstrap";
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
//prettier-ignore
import { UseCostosEnvio } from "../../../api/Controller/Catalogos/CostosEnvio/CostosEnvioController";
//prettier-ignore
import { dataDefaultCostoEnvio, IdataDefaultCostoEnvio, ICostoEnvioProvinciaDto, IUpsertCostoEnvioProvinciaDto } from "../../../api/Controller/Catalogos/CostosEnvio/InterfaceCostosEnvio";

/** Costo que cobra el back cuando la provincia no esta en el catalogo. Solo informativo:
 *  el valor real vive en PedidosRepository.CostoEnvioPorDefecto. */
const ENVIO_POR_DEFECTO = 6;

const CostosEnvioPage = () => {
    const _CostosEnvio = UseCostosEnvio();
    const data = useFillData<IdataDefaultCostoEnvio>(dataDefaultCostoEnvio);
    const Download = useDownloadExcelStore();

    const renderGetData = useCallback(async () => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const [response, provincias] = await Promise.all([
                _CostosEnvio.Listar(data.data.filter),
                _CostosEnvio.ListarProvincias(),
            ]);
            data.updateData(response.listarRegistros ?? [], 'data');
            data.updateData(response.countPage ?? 0, 'countPage');
            data.updateData(provincias, 'provincias');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudieron cargar los costos de envio', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    }, [data.data.reinicarGetdata]);

    useEffect(() => {
        renderGetData();
    }, [renderGetData]);

    // Provincias que ya tienen costo: no se pueden repetir, el back tambien lo rechaza.
    const provinciasDisponibles = (excluir: string) => {
        const usadas = data.data.data
            .filter((costo) => costo.provincia !== excluir)
            .map((costo) => costo.provincia);
        return data.data.provincias.filter((provincia) => !usadas.includes(provincia));
    };

    const HandleAdd = () => {
        data.updateData(false, 'validate');
        data.updateData('Agregar', 'typeOperacion');
        data.updateData(0, 'idSeleccionado');
        data.updateData({ provincia: '', costo: 0 }, 'operacion');
        data.updateData(true, 'modal');
    };

    const handleEdit = (id: number) => {
        //prettier-ignore
        const costoEnvio: ICostoEnvioProvinciaDto | undefined = data.data.data.find((x) => x.id === id);
        data.updateData(false, 'validate');
        data.updateData('Editar', 'typeOperacion');
        data.updateData(costoEnvio?.id || 0, 'idSeleccionado');
        const DataEdit: IUpsertCostoEnvioProvinciaDto = {
            provincia: costoEnvio?.provincia || '',
            costo: costoEnvio?.costo ?? 0,
        };
        data.updateData(DataEdit, 'operacion');
        data.updateData(true, 'modal');
    };

    //prettier-ignore
    const RenderChangeOperacion = (value: string | number, field: keyof IUpsertCostoEnvioProvinciaDto) => {
        const newdata: IUpsertCostoEnvioProvinciaDto = {
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

        if (data.data.operacion.provincia.trim() === '') {
            alertglobal('Info', 'Escoge la provincia.', 'info');
            return;
        }

        if (data.data.operacion.costo < 0) {
            alertglobal('Info', 'El costo de envio no puede ser negativo.', 'info');
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
            const response = await _CostosEnvio.Crear(data.data.operacion);
            alertglobal('Exito', response.message || 'Costo de envio creado', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
            data.updateData(false, 'modal');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo guardar el costo de envio', 'info');
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
            const response = await _CostosEnvio.Actualizar(data.data.idSeleccionado, data.data.operacion);
            alertglobal('Exito', response.message || 'Costo de envio actualizado', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
            data.updateData(false, 'modal');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo guardar el costo de envio', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    const HandleDelete = async (id: number) => {
        const costoEnvio = data.data.data.find((x) => x.id === id);

        //prettier-ignore
        const confirm = await AlertGlobalOptions(`Al eliminar, ${costoEnvio?.provincia ?? 'esa provincia'} pasa a cobrar el envio por defecto de $${ENVIO_POR_DEFECTO}. Continuar?`, 'Eliminar', 'Cancelar');
        if (!confirm) {
            return;
        }

        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _CostosEnvio.Eliminar(id);
            alertglobal('Exito', response.message || 'Costo de envio eliminado', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo eliminar el costo de envio', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    const download = () => {
        Download.setFilename("CostosEnvio.xlsx");
        Download.setColumns([
            { header: "Provincia", key: "provincia", width: 34 },
            { header: "Costo de envio", key: "costo", width: 18 },
        ]);
        Download.setData(data.data.data.map((e) => ({
            provincia: e.provincia,
            costo: `$${(e.costo ?? 0).toFixed(2)}`,
        })));
        Download.downloadExcel();
    };

    const opcionesProvincia = provinciasDisponibles(data.data.operacion.provincia)
        .map((provincia, index) => ({ value: index + 1, label: provincia }));
    //prettier-ignore
    const provinciaSeleccionada = opcionesProvincia.find((opcion) => opcion.label === data.data.operacion.provincia)?.value ?? 0;

    return (
        <>
            <ModalChangeLoading open={data.data.loading} />
            <Suspense fallback={<GrowExample />}>
                <CrudTablet
                    active="Costos de envío"
                    tittle="Costo de envío por provincia"
                    tittleButton="Agregar provincia"
                    hiddenButton
                    disabled={data.data.disabled}
                    onclickButtonPrimary={() => HandleAdd()}
                    downloadExcel={() => download()}
                    data={data.data.data.map((e) => ({
                        'id': e.id || 0,
                        'Provincia': e.provincia,
                        'Costo de envío': `$${(e.costo ?? 0).toFixed(2)}`,
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
                //prettier-ignore
                tittle={data.data.typeOperacion === 'Agregar' ? 'Agregar costo de envío' : 'Editar costo de envío'}
                height={360}
                children={
                    <Form className="form-horizontal" noValidate validated={data.data.validate} onSubmit={handleSubmit}>
                        <SelectPrincipal
                            label="Provincia"
                            placeholder="Escoge la provincia"
                            menuPlacement="bottom"
                            required
                            disabled={data.data.disabled}
                            options={opcionesProvincia}
                            selectedRole={provinciaSeleccionada}
                            //prettier-ignore
                            onChange={(value: number) => RenderChangeOperacion(opcionesProvincia.find((opcion) => opcion.value === value)?.label ?? '', 'provincia')}
                        />

                        <Input
                            className="mb-2"
                            label="Costo de envío (USD)"
                            placeholder="Ej: 5.50"
                            type="number"
                            min={0}
                            step="0.01"
                            required
                            disabled={data.data.disabled}
                            value={data.data.operacion.costo}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(Number(value), 'costo')}
                        />

                        <p className="text-muted mt-2 mb-3">
                            Las provincias que no estén en esta lista cobran ${ENVIO_POR_DEFECTO} de envío.
                            Si el pedido alcanza el monto de envío gratis configurado, no se cobra envío.
                        </p>

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

export default CostosEnvioPage;
