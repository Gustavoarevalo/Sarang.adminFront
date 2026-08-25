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
import { UseCuentasBancarias } from "../../../api/Controller/Catalogos/CuentasBancarias/CuentasBancariasController";
//prettier-ignore
import { dataDefaultCuentaBancaria, EnumTipoCuentaBancaria, ICuentaBancariaDto, IdataDefaultCuentaBancaria, IUpsertCuentaBancariaDto, tipoCuentaLabels } from "../../../api/Controller/Catalogos/CuentasBancarias/InterfaceCuentasBancarias";

const opcionesTipoCuenta = [
    { value: EnumTipoCuentaBancaria.Ahorros, label: tipoCuentaLabels[EnumTipoCuentaBancaria.Ahorros] },
    { value: EnumTipoCuentaBancaria.Corriente, label: tipoCuentaLabels[EnumTipoCuentaBancaria.Corriente] },
];

const CuentasBancariasPage = () => {
    const _CuentasBancarias = UseCuentasBancarias();
    const data = useFillData<IdataDefaultCuentaBancaria>(dataDefaultCuentaBancaria);
    const Download = useDownloadExcelStore();

    const renderGetData = useCallback(async () => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _CuentasBancarias.Listar(data.data.filter);
            data.updateData(response.listarRegistros ?? [], 'data');
            data.updateData(response.countPage ?? 0, 'countPage');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudieron cargar las cuentas bancarias', 'info');
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
        const nuevo: IUpsertCuentaBancariaDto = {
            nombreBanco: '',
            tipoCuenta: EnumTipoCuentaBancaria.Ahorros,
            numeroCuenta: '',
            ruc: '',
            titularNombre: '',
            emailContacto: '',
            observacion: '',
            // Se agrega al final de la lista del checkout.
            orden: data.data.data.length,
        };
        data.updateData(nuevo, 'operacion');
        data.updateData(true, 'modal');
    };

    const handleEdit = (id: number) => {
        const cuenta: ICuentaBancariaDto | undefined = data.data.data.find((x) => x.id === id);
        data.updateData(false, 'validate');
        data.updateData('Editar', 'typeOperacion');
        data.updateData(cuenta?.id || 0, 'idSeleccionado');
        const DataEdit: IUpsertCuentaBancariaDto = {
            nombreBanco: cuenta?.nombreBanco || '',
            tipoCuenta: cuenta?.tipoCuenta ?? EnumTipoCuentaBancaria.Ahorros,
            numeroCuenta: cuenta?.numeroCuenta || '',
            ruc: cuenta?.ruc || '',
            titularNombre: cuenta?.titularNombre || '',
            emailContacto: cuenta?.emailContacto || '',
            observacion: cuenta?.observacion || '',
            orden: cuenta?.orden ?? 0,
        };
        data.updateData(DataEdit, 'operacion');
        data.updateData(true, 'modal');
    };

    //prettier-ignore
    const RenderChangeOperacion = (value: string | number, field: keyof IUpsertCuentaBancariaDto) => {
        const newdata: IUpsertCuentaBancariaDto = {
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

        const operacion = data.data.operacion;

        if (operacion.nombreBanco.trim() === '') {
            alertglobal('Info', 'Escribe el nombre del banco.', 'info');
            return;
        }
        if (!/^\d+$/.test(operacion.numeroCuenta.trim())) {
            alertglobal('Info', 'El número de cuenta solo puede tener dígitos.', 'info');
            return;
        }
        // Cédula (10) o RUC (13): es lo que el banco pide para acreditar la transferencia.
        if (!/^\d{10}$|^\d{13}$/.test(operacion.ruc.trim())) {
            alertglobal('Info', 'El RUC o cédula del titular debe tener 10 o 13 dígitos.', 'info');
            return;
        }
        if (operacion.titularNombre.trim() === '') {
            alertglobal('Info', 'Escribe el nombre del titular.', 'info');
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
            const response = await _CuentasBancarias.Crear(data.data.operacion);
            alertglobal('Exito', response.message || 'Cuenta bancaria creada', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
            data.updateData(false, 'modal');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo guardar la cuenta bancaria', 'info');
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
            const response = await _CuentasBancarias.Actualizar(data.data.idSeleccionado, data.data.operacion);
            alertglobal('Exito', response.message || 'Cuenta bancaria actualizada', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
            data.updateData(false, 'modal');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo guardar la cuenta bancaria', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    const HandleDelete = async (id: number) => {
        const cuenta = data.data.data.find((x) => x.id === id);

        //prettier-ignore
        const confirm = await AlertGlobalOptions(`La cuenta de ${cuenta?.nombreBanco ?? 'este banco'} dejará de aparecer en el checkout. ¿Continuar?`, 'Eliminar', 'Cancelar');
        if (!confirm) {
            return;
        }

        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _CuentasBancarias.Eliminar(id);
            alertglobal('Exito', response.message || 'Cuenta bancaria eliminada', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo eliminar la cuenta bancaria', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    const download = () => {
        Download.setFilename("CuentasBancarias.xlsx");
        Download.setColumns([
            { header: "Banco", key: "banco", width: 26 },
            { header: "Tipo de cuenta", key: "tipo", width: 16 },
            { header: "Numero de cuenta", key: "numero", width: 24 },
            { header: "RUC o cedula", key: "ruc", width: 18 },
            { header: "Titular", key: "titular", width: 30 },
            { header: "Correo de contacto", key: "email", width: 28 },
            { header: "Orden", key: "orden", width: 10 },
        ]);
        Download.setData(data.data.data.map((e) => ({
            banco: e.nombreBanco,
            tipo: e.tipoCuentaNombre,
            numero: e.numeroCuenta,
            ruc: e.ruc,
            titular: e.titularNombre,
            email: e.emailContacto ?? '',
            orden: e.orden,
        })));
        Download.downloadExcel();
    };

    return (
        <>
            <ModalChangeLoading open={data.data.loading} />
            <Suspense fallback={<GrowExample />}>
                <CrudTablet
                    active="Cuentas bancarias"
                    tittle="Cuentas para transferencias"
                    tittleButton="Agregar cuenta"
                    hiddenButton
                    disabled={data.data.disabled}
                    onclickButtonPrimary={() => HandleAdd()}
                    downloadExcel={() => download()}
                    data={data.data.data.map((e) => ({
                        'id': e.id || 0,
                        'Banco': e.nombreBanco,
                        'Tipo': e.tipoCuentaNombre,
                        'N° de cuenta': e.numeroCuenta,
                        'RUC / Cédula': e.ruc,
                        'Titular': e.titularNombre,
                        'Orden': e.orden,
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
                tittle={data.data.typeOperacion === 'Agregar' ? 'Agregar cuenta bancaria' : 'Editar cuenta bancaria'}
                height={620}
                children={
                    <Form className="form-horizontal" noValidate validated={data.data.validate} onSubmit={handleSubmit}>
                        <Input
                            className="mb-2"
                            label="Banco"
                            placeholder="Ej: Banco Pichincha"
                            required
                            disabled={data.data.disabled}
                            value={data.data.operacion.nombreBanco}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(value, 'nombreBanco')}
                        />

                        <SelectPrincipal
                            label="Tipo de cuenta"
                            placeholder="Escoge el tipo de cuenta"
                            menuPlacement="bottom"
                            required
                            disabled={data.data.disabled}
                            options={opcionesTipoCuenta}
                            selectedRole={data.data.operacion.tipoCuenta}
                            //prettier-ignore
                            onChange={(value: number) => RenderChangeOperacion(value, 'tipoCuenta')}
                        />

                        <Input
                            className="mb-2"
                            label="Número de cuenta"
                            placeholder="Ej: 2100123456"
                            required
                            disabled={data.data.disabled}
                            value={data.data.operacion.numeroCuenta}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(value.replace(/\D/g, ''), 'numeroCuenta')}
                        />

                        <Input
                            className="mb-2"
                            label="RUC o cédula del titular"
                            placeholder="10 o 13 dígitos"
                            required
                            disabled={data.data.disabled}
                            value={data.data.operacion.ruc}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(value.replace(/\D/g, '').slice(0, 13), 'ruc')}
                        />

                        <Input
                            className="mb-2"
                            label="Nombre del titular"
                            placeholder="Como aparece en el banco"
                            required
                            disabled={data.data.disabled}
                            value={data.data.operacion.titularNombre}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(value, 'titularNombre')}
                        />

                        <Input
                            className="mb-2"
                            label="Correo de contacto (opcional)"
                            placeholder="pagos@tutienda.com"
                            type="email"
                            disabled={data.data.disabled}
                            value={data.data.operacion.emailContacto}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(value, 'emailContacto')}
                        />

                        <Input
                            className="mb-2"
                            label="Nota para el cliente (opcional)"
                            placeholder="Ej: Enviar el comprobante con el número de pedido"
                            disabled={data.data.disabled}
                            value={data.data.operacion.observacion}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(value, 'observacion')}
                        />

                        <Input
                            className="mb-2"
                            label="Orden en el checkout"
                            placeholder="0"
                            type="number"
                            min={0}
                            disabled={data.data.disabled}
                            value={data.data.operacion.orden}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(Number(value), 'orden')}
                        />

                        <p className="text-muted mt-2 mb-3">
                            El cliente ve estas cuentas al pagar por transferencia. La del número
                            de orden más bajo se muestra desplegada y el resto aparecen plegadas.
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

export default CuentasBancariasPage;
