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
import { UseCategorias } from "../../../api/Controller/Catalogos/Categorias/CategoriasController";
import { UseDropDowns } from "../../../api/Controller/DropDowns/DropDownController";
import { UseSubirArchivos } from "../../../api/Controller/Services/SubirArchivosController";
//prettier-ignore
import { dataDefaultCategorias, DataDefaultFilterCategoriasAdminDto, ICategoriaProductoDto, IdataDefaultCategorias, IUpsertCategoriaDto } from "../../../api/Controller/Catalogos/Categorias/InterfaceCategorias";
import { InterPerPages } from "../../../Components/components/crudTablet/componentsCrudTablet/itemPerPage";

// Carpeta de storage donde se guardan los iconos de categorias.
const CARPETA_ICONOS = 'Categorias_Iconos';

const CategoriasPage = () => {
    const _Categorias = UseCategorias();
    const _DropDowns = UseDropDowns();
    const _Archivos = UseSubirArchivos();
    //prettier-ignore
    const data = useFillData<IdataDefaultCategorias>({ ...dataDefaultCategorias, filter: { ...DataDefaultFilterCategoriasAdminDto, take: InterPerPages } });
    const Download = useDownloadExcelStore();

    const renderGetDropDown = useCallback(async () => {
        try {
            data.updateData(await _DropDowns.getTipoProducto(), 'tipoProductoDropDown');
        } catch {
            data.updateData([], 'tipoProductoDropDown');
        }
    }, []);

    useEffect(() => {
        renderGetDropDown();
    }, [renderGetDropDown]);

    const renderGetData = useCallback(async () => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _Categorias.Listar(data.data.filter);
            data.updateData(response.listarRegistros ?? [], 'data');
            data.updateData(response.countPage ?? 0, 'countPage');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudieron cargar las categorias', 'info');
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
        data.updateData('', 'iconoUrl');
        const DataAdd: IUpsertCategoriaDto = {
            nombre: '',
            descripcion: '',
            idArchivoStorageEntitys: null,
            enumTipoProducto: Number(data.data.tipoProductoDropDown[0]?.value ?? 0),
        };
        data.updateData(DataAdd, 'operacion');
        data.updateData(true, 'modal');
    };

    const handleEdit = (id: number) => {
        const categoria: ICategoriaProductoDto | undefined = data.data.data.find((x) => x.id === id);
        data.updateData(false, 'validate');
        data.updateData('Editar', 'typeOperacion');
        data.updateData(categoria?.id || 0, 'idSeleccionado');
        data.updateData(categoria?.iconoUrl || '', 'iconoUrl');
        const DataEdit: IUpsertCategoriaDto = {
            nombre: categoria?.nombre || '',
            descripcion: categoria?.descripcion || '',
            idArchivoStorageEntitys: categoria?.idArchivoStorageEntitys ?? null,
            enumTipoProducto: categoria?.enumTipoProducto || 0,
        };
        data.updateData(DataEdit, 'operacion');
        data.updateData(true, 'modal');
    };

    //prettier-ignore
    const RenderChangeOperacion = (value: string | number | null, field: keyof IUpsertCategoriaDto) => {
        const newdata: IUpsertCategoriaDto = {
            ...data.data.operacion,
            [field]: value
        };
        data.updateData(newdata, 'operacion');
    };

    const handleSubirIcono = async (file: File | undefined) => {
        if (!file) {
            return;
        }

        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _Archivos.Subir(file, CARPETA_ICONOS);
            if (response.success && response.detail) {
                RenderChangeOperacion(response.detail.idArchivoStorageEntitys, 'idArchivoStorageEntitys');
                data.updateData(response.detail.urlArchivo, 'iconoUrl');
            } else {
                alertglobal('Info', response.message || 'No se pudo subir el icono.', 'info');
            }
        } catch (error: any) {
            alertglobal('Info', error.response?.data?.message || 'No se pudo subir el icono.', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        e.preventDefault();
        if (form.checkValidity() === false) {
            e.stopPropagation();
            data.updateData(true, 'validate');
            return;
        }

        if (!data.data.operacion.enumTipoProducto) {
            alertglobal('Info', 'Selecciona el tipo de producto.', 'info');
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
            const response = await _Categorias.Crear(data.data.operacion);
            alertglobal('Exito', response.message || 'Categoria creada', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
            data.updateData(false, 'modal');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo guardar la categoria', 'info');
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
            const response = await _Categorias.Actualizar(data.data.idSeleccionado, data.data.operacion);
            alertglobal('Exito', response.message || 'Categoria actualizada', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
            data.updateData(false, 'modal');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo guardar la categoria', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    const HandleDelete = async (id: number) => {
        const categoria = data.data.data.find((x) => x.id === id);
        //prettier-ignore
        const confirm = await AlertGlobalOptions(`Seguro que deseas eliminar "${categoria?.nombre ?? ''}"?`, 'Eliminar', 'Cancelar');
        if (!confirm) {
            return;
        }

        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _Categorias.Eliminar(id);
            alertglobal('Exito', response.message || 'Categoria eliminada', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo eliminar la categoria', 'info');
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
        data.updateData({ ...DataDefaultFilterCategoriasAdminDto, take: InterPerPages }, 'filter');
        data.updateData(false, 'modalFilter');
    };

    const download = () => {
        Download.setFilename("Categorias.xlsx");
        Download.setColumns([
            { header: "Nombre", key: "nombre", width: 25 },
            { header: "Descripcion", key: "descripcion", width: 35 },
            { header: "Tipo de producto", key: "tipoProducto", width: 20 },
            { header: "Productos asociados", key: "productosAsociados", width: 20 },
        ]);
        Download.setData(data.data.data.map((e) => ({
            nombre: e.nombre || '',
            descripcion: e.descripcion || '',
            tipoProducto: e.tipoProducto || '',
            productosAsociados: e.productosAsociados ?? 0,
        })));
        Download.downloadExcel();
    };

    return (
        <>
            <ModalChangeLoading open={data.data.loading} />
            <Suspense fallback={<GrowExample />}>
                <CrudTablet
                    active="Categorias"
                    tittle="Categorias"
                    tittleButton="Agregar Categoria"
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
                        'Icono': e.iconoUrl || '',
                        'Nombre': e.nombre || '',
                        'Descripción': e.descripcion || '',
                        'Tipo': e.tipoProducto || '',
                        'Productos': e.productosAsociados ?? 0,
                    }))}
                    NotViewData={["id"]}
                    RenderColumn={(value, column) => {
                        if (column === 'Icono') {
                            return value
                                ? <img src={value} alt="icono" style={{ height: 32, width: 32, objectFit: 'cover', borderRadius: 8 }} />
                                : <span className="text-muted">-</span>;
                        }
                        return value;
                    }}
                    hiddenEdit
                    onClickEdit={(e) => handleEdit(e["id"])}
                    hiddenDelete
                    onClickDelete={(e) => HandleDelete(e["id"])}
                />
            </Suspense>

            <ModalPrincipal
                open={data.data.modal}
                setOpen={() => data.updateData(false, 'modal')}
                tittle={data.data.typeOperacion === 'Agregar' ? 'Agregar Categoria' : 'Editar Categoria'}
                height={560}
                children={
                    <Form className="form-horizontal" noValidate validated={data.data.validate} onSubmit={handleSubmit}>
                        <Input
                            label="Nombre"
                            placeholder="Ej: Cuidado facial"
                            required
                            disabled={data.data.disabled}
                            value={data.data.operacion.nombre}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(value, 'nombre')}
                        />

                        <Input
                            label="Descripción"
                            placeholder="Descripción de la categoria"
                            disabled={data.data.disabled}
                            value={data.data.operacion.descripcion}
                            //prettier-ignore
                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderChangeOperacion(value, 'descripcion')}
                        />

                        <SelectPrincipal
                            label="Tipo de producto"
                            options={data.data.tipoProductoDropDown}
                            selectedRole={data.data.operacion.enumTipoProducto}
                            disabled={data.data.disabled}
                            required
                            onChange={(value) => RenderChangeOperacion(value, 'enumTipoProducto')}
                        />

                        <Input
                            label="Icono"
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            disabled={data.data.disabled}
                            //prettier-ignore
                            onChange={({ target: { files } }: React.ChangeEvent<HTMLInputElement>) => handleSubirIcono(files?.[0])}
                        />

                        {data.data.iconoUrl !== '' && (
                            <div className="mb-3">
                                <img src={data.data.iconoUrl} alt="icono" style={{ height: 64, width: 64, objectFit: 'cover', borderRadius: 12 }} />
                            </div>
                        )}

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
                                    label="Tipo de producto"
                                    options={data.data.tipoProductoDropDown}
                                    //prettier-ignore
                                    selectedRole={data.data.tipoProductoDropDown.find(x => x.label === data.data.filter.tipoProducto)?.value || 0}
                                    //prettier-ignore
                                    onChange={(value) => data.updateData({ ...data.data.filter, tipoProducto: data.data.tipoProductoDropDown.find(x => x.value === value)?.label ?? null }, 'filter')}
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

export default CategoriasPage;
