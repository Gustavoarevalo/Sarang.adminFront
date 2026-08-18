import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import Input from "../../Components/components/input/Input";
import Switch from "../../Components/components/switch/switch";
import PageDefault from "../../Components/components/pageDefault";
import { alertglobal } from "../../Components/components/sweertAlert/sweertAlert";
//prettier-ignore
import { IConfiguracionDto, IConfiguracionImagenDto, UseConfiguracion } from "../../api/Controller/Configuracion/ConfiguracionController";

const currencyFormatter = new Intl.NumberFormat('es-EC', {
    currency: 'USD',
    style: 'currency',
});

// Imagen de portada en edicion: si trae file aun no se ha subido (se sube al guardar).
interface ConfigMedia extends IConfiguracionImagenDto {
    file?: File;
}

const ConfiguracionPage = () => {
    const _Configuracion = UseConfiguracion();

    const [hasFreeShipping, setHasFreeShipping] = useState(true);
    const [freeShippingFrom, setFreeShippingFrom] = useState('50');
    const [minimumStockAlert, setMinimumStockAlert] = useState('2');
    const [ivaPercent, setIvaPercent] = useState(15);
    const [media, setMedia] = useState<ConfigMedia[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const minimumAmount = Number(freeShippingFrom.replace(',', '.')) || 0;
    const stockAlertAmount = Number(minimumStockAlert.replace(',', '.')) || 0;

    const aplicarConfiguracion = (config: IConfiguracionDto) => {
        setHasFreeShipping(config.envioGratisActivo);
        setFreeShippingFrom(String(config.envioGratisDesde ?? 0));
        setMinimumStockAlert(String(config.stockMinimoAlerta ?? 0));
        setIvaPercent(config.ivaVentaPorcentaje || 15);
        setMedia(config.imagenes ?? []);
    };

    const renderGetData = useCallback(async () => {
        setLoading(true);
        try {
            aplicarConfiguracion(await _Configuracion.Obtener());
        } catch (err: any) {
            //prettier-ignore
            alertglobal('Info', err.response?.data?.message || 'No se pudo cargar la configuracion', 'info');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        renderGetData();
    }, [renderGetData]);

    // Agrega archivos seleccionados (sin subirlos aun; se suben al guardar).
    const handleAgregarArchivos = (files: FileList | null) => {
        if (!files || files.length === 0) {
            return;
        }

        const nuevos: ConfigMedia[] = Array.from(files).map((file, index) => ({
            id: 0,
            idArchivoStorageEntitys: 0,
            type: 'image',
            uri: URL.createObjectURL(file),
            altText: '',
            title: '',
            description: '',
            isCover: media.length === 0 && index === 0,
            file,
        }));

        setMedia((current) => [...current, ...nuevos]);
        setError('');
    };

    const handleSetCover = (index: number) => {
        setMedia((current) => current.map((item, position) => ({ ...item, isCover: position === index })));
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

    const updateAltText = (index: number, value: string) => {
        //prettier-ignore
        setMedia((current) => current.map((item, position) => (position === index ? { ...item, altText: value } : item)));
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('EnvioGratisActivo', String(hasFreeShipping));
        formData.append('EnvioGratisDesde', String(minimumAmount));
        formData.append('StockMinimoAlerta', String(stockAlertAmount));
        formData.append('IvaVentaPorcentaje', String(ivaPercent));
        formData.append('Moneda', 'USD');

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

        setLoading(true);
        try {
            const response = await _Configuracion.Guardar(formData);
            if (response.success && response.detail) {
                aplicarConfiguracion(response.detail);
            }
            alertglobal('Exito', response.message || 'Configuración guardada.', 'success');
        } catch (err: any) {
            //prettier-ignore
            alertglobal('Info', err.response?.data?.message || 'No se pudo guardar la configuracion', 'info');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageDefault
            tittle="Configuración"
            active="Configuración"
            ChangeLoading={loading}
            hiddenRegresar
            childrenCardBody={
                <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                    <Card className="mb-3">
                        <Card.Header><Card.Title as="h5" className="mb-0">Envío</Card.Title></Card.Header>
                        <Card.Body>
                            <Switch
                                label="Envío gratis activo"
                                disabled={loading}
                                checked={hasFreeShipping}
                                //prettier-ignore
                                onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => setHasFreeShipping(checked)}
                            />
                            <Row>
                                <Col xl={6}>
                                    <Input
                                        label="Envío gratis desde"
                                        type="number"
                                        min={0}
                                        disabled={loading || !hasFreeShipping}
                                        value={freeShippingFrom}
                                        //prettier-ignore
                                        onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setFreeShippingFrom(value)}
                                    />
                                    <p className="text-muted">
                                        Los pedidos desde {currencyFormatter.format(minimumAmount)} no pagan envío.
                                    </p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Header><Card.Title as="h5" className="mb-0">Inventario y ventas</Card.Title></Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xl={6}>
                                    <Input
                                        label="Alerta de stock mínimo"
                                        type="number"
                                        min={0}
                                        disabled={loading}
                                        value={minimumStockAlert}
                                        //prettier-ignore
                                        onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setMinimumStockAlert(value)}
                                    />
                                    <p className="text-muted">
                                        Se avisa cuando un producto baja de {stockAlertAmount} unidades.
                                    </p>
                                </Col>
                                <Col xl={6}>
                                    <Input
                                        label="IVA de venta (%)"
                                        type="number"
                                        min={0}
                                        max={100}
                                        disabled={loading}
                                        value={ivaPercent}
                                        //prettier-ignore
                                        onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setIvaPercent(Number(value))}
                                    />
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Header><Card.Title as="h5" className="mb-0">Imágenes de portada de la tienda</Card.Title></Card.Header>
                        <Card.Body>
                            <Input
                                label="Agregar imagenes"
                                type="file"
                                accept="image/*"
                                disabled={loading}
                                onChange={({ target }: React.ChangeEvent<HTMLInputElement>) => {
                                    handleAgregarArchivos(target.files);
                                    target.value = '';
                                }}
                            />

                            <Row>
                                {media.map((item, index) => (
                                    <Col xl={3} key={`${item.id}-${index}`} className="mb-3">
                                        <div className="border rounded p-2 h-100">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-bold text-primary">{item.isCover ? 'Portada' : 'Imagen'}</span>
                                                <div className="d-flex" style={{ gap: 6 }}>
                                                    {!item.isCover && (
                                                        <Button size="sm" variant="outline-primary" disabled={loading} onClick={() => handleSetCover(index)}>
                                                            Portada
                                                        </Button>
                                                    )}
                                                    <Button size="sm" variant="outline-danger" disabled={loading} onClick={() => handleRemoveMedia(index)}>
                                                        Quitar
                                                    </Button>
                                                </div>
                                            </div>
                                            <img src={item.uri} alt={item.altText} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }} />
                                            <Input
                                                label="Texto alternativo"
                                                disabled={loading}
                                                value={item.altText}
                                                //prettier-ignore
                                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => updateAltText(index, value)}
                                            />
                                        </div>
                                    </Col>
                                ))}
                                {media.length === 0 && (
                                    <Col xl={12}><p className="text-muted mb-0">Aún no hay imágenes de portada.</p></Col>
                                )}
                            </Row>
                        </Card.Body>
                    </Card>

                    {error !== '' && <p className="text-danger fw-bold">{error}</p>}

                    <Button variant="primary" type="submit" disabled={loading}>Guardar configuración</Button>
                </Form>
            }
        />
    );
};

export default ConfiguracionPage;
