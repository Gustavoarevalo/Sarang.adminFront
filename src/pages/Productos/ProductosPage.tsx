import { Button, Col, Row } from "react-bootstrap";
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
import { UseProducts } from "../../api/Controller/Productos/ProductosController";
import { UseDropDowns } from "../../api/Controller/DropDowns/DropDownController";
//prettier-ignore
import { DataDefaultFilterProductsAdminDto, IAdminInventoryProductDto, IFilterProductsAdminDto } from "../../api/Controller/Productos/InterfaceProducts";
import { IDropBoxGlobal } from "../../helper/VariablesGLobal";
import { InterPerPages } from "../../Components/components/crudTablet/componentsCrudTablet/itemPerPage";
import ProductoFormModal from "./ProductoFormModal";

const currencyFormatter = new Intl.NumberFormat('es-EC', {
    currency: 'USD',
    style: 'currency',
});

interface IdataProductos {
    data: IAdminInventoryProductDto[];
    countPage: number;
    filter: IFilterProductsAdminDto;
    reinicarGetdata: boolean;
    disabled: boolean;
    loading: boolean;
    modal: boolean;
    modalFilter: boolean;
    editing: IAdminInventoryProductDto | null;
    tipoProductoDropDown: IDropBoxGlobal[];
    categoriasDropDown: IDropBoxGlobal[];
}

const dataDefaultProductos: IdataProductos = {
    data: [],
    countPage: 0,
    filter: { ...DataDefaultFilterProductsAdminDto, take: InterPerPages },
    reinicarGetdata: false,
    disabled: false,
    loading: false,
    modal: false,
    modalFilter: false,
    editing: null,
    tipoProductoDropDown: [],
    categoriasDropDown: [],
};

const ProductosPage = () => {
    const _Productos = UseProducts();
    const _DropDowns = UseDropDowns();
    const data = useFillData<IdataProductos>(dataDefaultProductos);
    const Download = useDownloadExcelStore();

    const renderGetDropDown = useCallback(async () => {
        try {
            const [tipoProducto, categorias] = await Promise.all([
                _DropDowns.getTipoProducto(),
                _DropDowns.getCategoriaProducto(),
            ]);
            data.updateData(tipoProducto, 'tipoProductoDropDown');
            data.updateData(categorias, 'categoriasDropDown');
        } catch {
            data.updateData([], 'tipoProductoDropDown');
            data.updateData([], 'categoriasDropDown');
        }
    }, []);

    useEffect(() => {
        renderGetDropDown();
    }, [renderGetDropDown]);

    const renderGetData = useCallback(async () => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _Productos.Listar(data.data.filter);
            data.updateData(response.listarRegistros ?? [], 'data');
            data.updateData(response.countPage ?? 0, 'countPage');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudieron cargar los productos', 'info');
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

    const handleSubmitProducto = async (id: number | null, formData: FormData) => {
        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            //prettier-ignore
            const response = id ? await _Productos.Actualizar(formData) : await _Productos.Crear(formData);
            alertglobal('Exito', response.message || 'Producto guardado', 'success');
            data.updateData(false, 'modal');
            data.updateData(null, 'editing');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo guardar el producto', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    const HandleDelete = async (id: number) => {
        const producto = data.data.data.find((x) => x.id === id);
        //prettier-ignore
        const confirm = await AlertGlobalOptions(`Seguro que deseas eliminar "${producto?.name ?? ''}"?`, 'Eliminar', 'Cancelar');
        if (!confirm) {
            return;
        }

        data.updateData(true, 'disabled');
        data.updateData(true, 'loading');
        try {
            const response = await _Productos.Eliminar(id);
            alertglobal('Exito', response.message || 'Producto eliminado', 'success');
            data.updateData(!data.data.reinicarGetdata, 'reinicarGetdata');
        } catch (error: any) {
            //prettier-ignore
            alertglobal('Info', error.response?.data?.message || 'No se pudo eliminar el producto', 'info');
        } finally {
            data.updateData(false, 'disabled');
            data.updateData(false, 'loading');
        }
    };

    //prettier-ignore
    const RenderChangeFilter = (value: string | number | null, field: keyof IFilterProductsAdminDto) => {
        data.updateData({ ...data.data.filter, [field]: value }, 'filter');
    };

    const HandleAplicarFiltro = () => {
        data.updateData({ ...data.data.filter, skip: 0 }, 'filter');
        data.updateData(false, 'modalFilter');
    };

    const HandleLimpiarFiltro = () => {
        data.updateData({ ...DataDefaultFilterProductsAdminDto, take: InterPerPages }, 'filter');
        data.updateData(false, 'modalFilter');
    };

    const download = () => {
        Download.setFilename("Productos.xlsx");
        Download.setColumns([
            { header: "Nombre", key: "name", width: 30 },
            { header: "Categoria", key: "category", width: 20 },
            { header: "Stock", key: "stock", width: 10 },
            { header: "Precio base", key: "basePrice", width: 15 },
            { header: "Precio venta", key: "price", width: 15 },
            { header: "Costo unitario", key: "backendUnitCost", width: 18 },
            { header: "Margen %", key: "margenVentaPorcentaje", width: 12 },
        ]);
        Download.setData(data.data.data.map((e) => ({
            name: e.name || '',
            category: e.category || '',
            stock: e.stock ?? 0,
            basePrice: e.basePrice ?? 0,
            price: e.price ?? 0,
            backendUnitCost: e.backendUnitCost ?? 0,
            margenVentaPorcentaje: e.margenVentaPorcentaje ?? 0,
        })));
        Download.downloadExcel();
    };

    return (
        <>
            <ModalChangeLoading open={data.data.loading} />
            <Suspense fallback={<GrowExample />}>
                <CrudTablet
                    active="Productos"
                    tittle="Productos"
                    tittleButton="Agregar Producto"
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
                        'Portada': e.media?.find((m) => m.isCover)?.uri || e.media?.[0]?.uri || '',
                        'Nombre': e.name || '',
                        'Categoría': e.category || '',
                        'Stock': e.stock ?? 0,
                        'Precio base': currencyFormatter.format(e.basePrice ?? 0),
                        'Precio venta': currencyFormatter.format(e.price ?? 0),
                        'Margen %': `${(e.margenVentaPorcentaje ?? 0).toFixed(2)}%`,
                        'Sugerencia reposición': e.incomingStockSuggestion ?? 0,
                    }))}
                    NotViewData={["id"]}
                    RenderColumn={(value, column) => {
                        if (column === 'Portada') {
                            return value
                                ? <img src={value} alt="portada" style={{ height: 42, width: 42, objectFit: 'cover', borderRadius: 8 }} />
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

            <ProductoFormModal
                open={data.data.modal}
                loading={data.data.loading}
                editing={data.data.editing}
                categoriasOptions={data.data.categoriasDropDown}
                onClose={() => {
                    data.updateData(false, 'modal');
                    data.updateData(null, 'editing');
                }}
                onSubmit={(id, formData) => handleSubmitProducto(id, formData)}
            />

            <ModalPrincipal
                open={data.data.modalFilter}
                setOpen={() => data.updateData(false, 'modalFilter')}
                tittle="Filtros"
                width={700}
                height={520}
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
                                    label="Categoria"
                                    options={data.data.categoriasDropDown}
                                    selectedRole={data.data.filter.idCategoria ?? 0}
                                    //prettier-ignore
                                    onChange={(value) => RenderChangeFilter(value === 0 ? null : value, 'idCategoria')}
                                />
                            </Col>
                            <Col xl={6}>
                                <SelectPrincipal
                                    label="Tipo de producto"
                                    options={data.data.tipoProductoDropDown}
                                    //prettier-ignore
                                    selectedRole={data.data.tipoProductoDropDown.find(x => x.label === data.data.filter.tipoProducto)?.value || 0}
                                    //prettier-ignore
                                    onChange={(value) => RenderChangeFilter(data.data.tipoProductoDropDown.find(x => x.value === value)?.label ?? null, 'tipoProducto')}
                                />
                            </Col>
                            <Col xl={6} />
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
                        </Row>

                        <Button className="me-2" variant="primary" onClick={() => HandleAplicarFiltro()}>Aplicar</Button>
                        <Button variant="secondary" onClick={() => HandleLimpiarFiltro()}>Limpiar</Button>
                    </>
                }
            />
        </>
    );
};

export default ProductosPage;
