import { Button, Col, Form, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import Input from "../../Components/components/input/Input";
import { SelectPrincipal } from "../../Components/components/Select/Selects";
import { ModalPrincipal } from "../../Components/components/Modal/Modals";
import { IDropBoxGlobal } from "../../helper/VariablesGLobal";
//prettier-ignore
import { IAdminInventoryProductDto, IAdminProductMediaDto } from "../../api/Controller/Productos/InterfaceProducts";

// Media que vive en el formulario: puede venir del backend (sin file) o ser un
// archivo nuevo seleccionado por el usuario (con file).
export interface IFormMedia extends IAdminProductMediaDto {
    file?: File;
}

interface ProductoFormModalProps {
    open: boolean;
    loading: boolean;
    editing: IAdminInventoryProductDto | null;
    categoriasOptions: IDropBoxGlobal[];
    onClose: () => void;
    onSubmit: (id: number | null, formData: FormData) => void;
}

const parseNumber = (value: string): number => {
    const parsed = Number(value.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : 0;
};

//prettier-ignore
const ProductoFormModal: React.FC<ProductoFormModalProps> = ({ open, loading, editing, categoriasOptions, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [idCategoria, setIdCategoria] = useState<number>(0);
    const [ingredientes, setIngredientes] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [modoDeUso, setModoDeUso] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [ancho, setAncho] = useState('');
    const [alto, setAlto] = useState('');
    const [profundidad, setProfundidad] = useState('');
    const [media, setMedia] = useState<IFormMedia[]>([]);
    const [error, setError] = useState('');

    const toDimension = (value: number) => (value > 0 ? String(value) : '');

    useEffect(() => {
        if (!open) {
            return;
        }

        if (editing) {
            setName(editing.name);
            setIdCategoria(editing.categorias[0]?.idCategoria ?? 0);
            setIngredientes(editing.ingredientes ?? '');
            setDescripcion(editing.descripcion ?? '');
            setModoDeUso(editing.modoDeUso ?? '');
            setBasePrice(editing.basePrice > 0 ? editing.basePrice.toString() : '');
            setAncho(toDimension(editing.ancho));
            setAlto(toDimension(editing.alto));
            setProfundidad(toDimension(editing.profundidad));
            setMedia(editing.media ?? []);
        } else {
            setName('');
            setIdCategoria(0);
            setIngredientes('');
            setDescripcion('');
            setModoDeUso('');
            setBasePrice('');
            setAncho('');
            setAlto('');
            setProfundidad('');
            setMedia([]);
        }
        setError('');
    }, [open, editing]);

    const handleAgregarArchivos = (files: FileList | null) => {
        if (!files || files.length === 0) {
            return;
        }

        const nuevos: IFormMedia[] = Array.from(files).map((file, index) => ({
            id: 0,
            idArchivoStorageEntitys: 0,
            type: file.type.startsWith('video') ? 'video' : 'image',
            uri: URL.createObjectURL(file),
            altText: '',
            title: file.name,
            description: '',
            isCover: media.length === 0 && index === 0,
            file,
        }));

        setMedia((current) => [...current, ...nuevos]);
        setError('');
    };

    const updateMediaField = (index: number, field: 'title' | 'altText' | 'description', value: string) => {
        setMedia((current) => current.map((item, position) => (position === index ? { ...item, [field]: value } : item)));
    };

    const handleRemoveMedia = (index: number) => {
        setMedia((current) => {
            const next = current.filter((_, position) => position !== index);
            if (next.length > 0 && !next.some((item) => item.isCover)) {
                next[0] = { ...next[0], isCover: true };
            }
            return next;
        });
    };

    const handleSetCover = (index: number) => {
        setMedia((current) => current.map((item, position) => ({ ...item, isCover: position === index })));
    };

    const handleSubmit = () => {
        if (loading) {
            return;
        }

        if (!name.trim()) {
            setError('Coloca el nombre del producto.');
            return;
        }

        if (parseNumber(basePrice) <= 0) {
            setError('Coloca el precio base del producto.');
            return;
        }

        if (!idCategoria) {
            setError('Selecciona la categoria del producto.');
            return;
        }

        if (media.length === 0) {
            setError('Agrega al menos una imagen.');
            return;
        }

        const categoriaSeleccionada = categoriasOptions.find((option) => option.value === idCategoria);

        const formData = new FormData();
        formData.append('IdProducto', String(editing?.id ?? 0));
        formData.append('Name', name.trim());
        formData.append('Ingredientes', ingredientes.trim());
        formData.append('Descripcion', descripcion.trim());
        formData.append('ModoDeUso', modoDeUso.trim());
        formData.append('Stock', String(editing?.stock ?? 0));
        formData.append('BasePrice', String(parseNumber(basePrice)));
        formData.append('Price', String(editing?.price ?? 0));
        formData.append('BackendUnitCost', String(editing?.backendUnitCost ?? 0));
        formData.append('Ancho', String(parseNumber(ancho)));
        formData.append('Alto', String(parseNumber(alto)));
        formData.append('Profundidad', String(parseNumber(profundidad)));
        formData.append(
            'CategoriasJson',
            JSON.stringify(
                categoriaSeleccionada
                    ? [{ idCategoria: categoriaSeleccionada.value, nombre: categoriaSeleccionada.label }]
                    : [],
            ),
        );

        let fileIndex = 0;
        const mediaMeta = media.map((item) => {
            let thisFileIndex = -1;
            if (item.file) {
                thisFileIndex = fileIndex;
                fileIndex += 1;
                formData.append('Files', item.file);
            }
            return {
                id: item.id,
                idArchivoStorageEntitys: item.idArchivoStorageEntitys,
                type: item.type,
                altText: item.altText,
                title: item.title,
                description: item.description,
                isCover: item.isCover,
                fileIndex: thisFileIndex,
            };
        });

        formData.append('MediaJson', JSON.stringify(mediaMeta));

        onSubmit(editing?.id ?? null, formData);
    };

    return (
        <ModalPrincipal
            open={open}
            setOpen={() => onClose()}
            tittle={editing ? 'Editar producto' : 'Agregar producto'}
            width={900}
            height={640}
            children={
                <Form className="form-horizontal" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <Row>
                        <Col xl={6}>
                            <Input
                                label="Nombre"
                                placeholder="Ej: Serum de vitamina C"
                                disabled={loading}
                                value={name}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setName(value)}
                            />
                        </Col>
                        <Col xl={6}>
                            <SelectPrincipal
                                label="Categoria"
                                options={categoriasOptions}
                                selectedRole={idCategoria}
                                disabled={loading}
                                onChange={(value) => setIdCategoria(value)}
                            />
                        </Col>
                        <Col xl={6}>
                            <Input
                                label="Precio base (sin IVA)"
                                placeholder="Ej: 12.50"
                                type="number"
                                min={0}
                                disabled={loading}
                                value={basePrice}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setBasePrice(value)}
                            />
                        </Col>
                        <Col xl={6}>
                            <Input
                                label="Ingredientes"
                                placeholder="Ingredientes"
                                disabled={loading}
                                value={ingredientes}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setIngredientes(value)}
                            />
                        </Col>
                        <Col xl={6}>
                            <Input
                                label="Descripción"
                                placeholder="Descripción"
                                disabled={loading}
                                value={descripcion}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setDescripcion(value)}
                            />
                        </Col>
                        <Col xl={6}>
                            <Input
                                label="Modo de uso"
                                placeholder="Modo de uso"
                                disabled={loading}
                                value={modoDeUso}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setModoDeUso(value)}
                            />
                        </Col>
                        <Col xl={4}>
                            <Input
                                label="Ancho (cm)"
                                type="number"
                                min={0}
                                disabled={loading}
                                value={ancho}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setAncho(value)}
                            />
                        </Col>
                        <Col xl={4}>
                            <Input
                                label="Alto (cm)"
                                type="number"
                                min={0}
                                disabled={loading}
                                value={alto}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setAlto(value)}
                            />
                        </Col>
                        <Col xl={4}>
                            <Input
                                label="Profundidad (cm)"
                                type="number"
                                min={0}
                                disabled={loading}
                                value={profundidad}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setProfundidad(value)}
                            />
                        </Col>
                        <Col xl={12}>
                            <Input
                                label="Imagenes y videos"
                                type="file"
                                accept="image/*,video/*"
                                disabled={loading}
                                onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                                    handleAgregarArchivos(target.files);
                                    target.value = '';
                                }}
                            />
                        </Col>
                    </Row>

                    {media.length > 0 && (
                        <Row className="mb-3">
                            {media.map((item, index) => (
                                <Col xl={4} key={`${item.id}-${index}`} className="mb-3">
                                    <div className="border rounded p-2 h-100">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <span className="fw-bold text-primary">
                                                {item.isCover ? 'Portada' : item.type === 'video' ? 'Video' : 'Imagen'}
                                            </span>
                                            <div className="d-flex" style={{ gap: 6 }}>
                                                {!item.isCover && (
                                                    <Button size="sm" variant="outline-primary" onClick={() => handleSetCover(index)} disabled={loading}>
                                                        Portada
                                                    </Button>
                                                )}
                                                <Button size="sm" variant="outline-danger" onClick={() => handleRemoveMedia(index)} disabled={loading}>
                                                    Quitar
                                                </Button>
                                            </div>
                                        </div>

                                        {item.type === 'video' ? (
                                            <video src={item.uri} controls style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
                                        ) : (
                                            <img src={item.uri} alt={item.altText} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
                                        )}

                                        <Input
                                            label="Titulo"
                                            disabled={loading}
                                            value={item.title}
                                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => updateMediaField(index, 'title', value)}
                                        />
                                        <Input
                                            label="Texto alternativo"
                                            disabled={loading}
                                            value={item.altText}
                                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => updateMediaField(index, 'altText', value)}
                                        />
                                        <Input
                                            label="Descripción"
                                            disabled={loading}
                                            value={item.description}
                                            onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => updateMediaField(index, 'description', value)}
                                        />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    )}

                    {error !== '' && <p className="text-danger fw-bold">{error}</p>}

                    <Button className="me-2" variant="primary" type="submit" disabled={loading}>
                        {editing ? 'Guardar cambios' : 'Crear producto'}
                    </Button>
                    <Button variant="secondary" onClick={() => onClose()} disabled={loading}>
                        Cerrar
                    </Button>
                </Form>
            }
        />
    );
};

export default ProductoFormModal;
