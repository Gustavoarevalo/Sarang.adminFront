import { Badge, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { ModalPrincipal } from "../../Components/components/Modal/Modals";
import { IAdminPromotionDto } from "../../api/Controller/Promociones/InterfacePromociones";

interface PromocionMediaModalProps {
    open: boolean;
    promotion: IAdminPromotionDto | null;
    onClose: () => void;
}

// Galeria de imagenes/videos de una promocion: se abre desde el boton de la
// columna "Galería" de la tabla.
//prettier-ignore
const PromocionMediaModal: React.FC<PromocionMediaModalProps> = ({ open, promotion, onClose }) => {
    const [indice, setIndice] = useState(0);

    // La portada arranca seleccionada cada vez que se abre la galeria.
    useEffect(() => {
        if (!open) {
            return;
        }

        const portada = promotion?.media?.findIndex((item) => item.isCover) ?? -1;
        setIndice(portada >= 0 ? portada : 0);
    }, [open, promotion]);

    const media = promotion?.media ?? [];
    const actual = media[indice];

    const anterior = () => setIndice((current) => (current === 0 ? media.length - 1 : current - 1));
    const siguiente = () => setIndice((current) => (current === media.length - 1 ? 0 : current + 1));

    return (
        <ModalPrincipal
            open={open}
            setOpen={() => onClose()}
            tittle={promotion?.name || 'Galería'}
            width={760}
            height={620}
            children={
                media.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fe fe-image text-muted" style={{ fontSize: 48 }}></i>
                        <p className="text-muted mt-3 mb-0">Esta promoción no tiene imágenes cargadas.</p>
                        <Button className="mt-4" variant="secondary" onClick={() => onClose()}>Cerrar</Button>
                    </div>
                ) : (
                    <>
                        {/* Visor principal */}
                        <div
                            className="position-relative d-flex align-items-center justify-content-center rounded mb-3"
                            style={{ background: '#f6f4f5', height: 340, overflow: 'hidden' }}
                        >
                            {actual?.type === 'video' ? (
                                <video
                                    key={actual.uri}
                                    src={actual.uri}
                                    controls
                                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                                />
                            ) : (
                                <img
                                    src={actual?.uri}
                                    alt={actual?.altText || actual?.title || 'Imagen de la promoción'}
                                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                />
                            )}

                            {actual?.isCover && (
                                <Badge bg="primary" className="position-absolute top-0 start-0 m-2">Portada</Badge>
                            )}

                            {media.length > 1 && (
                                <>
                                    <Button
                                        variant="light"
                                        className="position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle shadow-sm"
                                        onClick={() => anterior()}
                                    >
                                        <i className="fe fe-chevron-left"></i>
                                    </Button>
                                    <Button
                                        variant="light"
                                        className="position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle shadow-sm"
                                        onClick={() => siguiente()}
                                    >
                                        <i className="fe fe-chevron-right"></i>
                                    </Button>
                                </>
                            )}
                        </div>

                        {/* Datos del archivo actual */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <p className="mb-0 fw-bold">{actual?.title || 'Sin título'}</p>
                                {actual?.description !== '' && (
                                    <small className="text-muted">{actual?.description}</small>
                                )}
                            </div>
                            <span className="text-muted">{indice + 1} / {media.length}</span>
                        </div>

                        {/* Miniaturas */}
                        {media.length > 1 && (
                            <div className="d-flex flex-wrap mb-3" style={{ gap: 8 }}>
                                {media.map((item, position) => (
                                    <button
                                        key={`${item.id}-${position}`}
                                        type="button"
                                        className="btn p-0 border rounded"
                                        style={{
                                            borderColor: position === indice ? 'var(--primary-bg-color)' : undefined,
                                            borderWidth: position === indice ? 2 : 1,
                                            height: 58,
                                            overflow: 'hidden',
                                            width: 58,
                                        }}
                                        onClick={() => setIndice(position)}
                                    >
                                        {item.type === 'video' ? (
                                            <span className="d-flex align-items-center justify-content-center h-100 w-100 bg-light">
                                                <i className="fe fe-video text-primary"></i>
                                            </span>
                                        ) : (
                                            <img
                                                src={item.uri}
                                                alt={item.altText || item.title}
                                                style={{ height: '100%', objectFit: 'cover', width: '100%' }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}

                        <Button variant="secondary" onClick={() => onClose()}>Cerrar</Button>
                    </>
                )
            }
        />
    );
};

export default PromocionMediaModal;
