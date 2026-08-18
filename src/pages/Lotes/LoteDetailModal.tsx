import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { ModalPrincipal } from "../../Components/components/Modal/Modals";
import { IAdminLoteDto } from "../../api/Controller/Lotes/InterfaceLotes";
import { currencyFormatter } from "./loteCalculations";

interface LoteDetailModalProps {
    open: boolean;
    lote: IAdminLoteDto | null;
    onClose: () => void;
}

const LoteDetailModal: React.FC<LoteDetailModalProps> = ({ open, lote, onClose }) => {
    return (
        <ModalPrincipal
            open={open}
            setOpen={() => onClose()}
            tittle={`Detalle del lote ${lote?.codigoLote || ''}`}
            width={1000}
            height={640}
            children={
                lote == null ? (
                    <p className="text-muted">Sin informacion del lote.</p>
                ) : (
                    <>
                        {lote.descripcion !== '' && <p className="text-muted">{lote.descripcion}</p>}

                        <Card className="mb-3">
                            <Card.Header><Card.Title as="h5" className="mb-0">Resumen</Card.Title></Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col xl={3}><p className="mb-1 text-muted">Fecha de llegada</p><h6>{lote.fechaLlegada ?? 'Sin fecha'}</h6></Col>
                                    <Col xl={3}><p className="mb-1 text-muted">Fecha de publicación</p><h6>{lote.fechaSalidaVenta ?? 'Sin fecha'}</h6></Col>
                                    <Col xl={3}><p className="mb-1 text-muted">IVA</p><h6>{lote.ivaPorcentaje}%</h6></Col>
                                    <Col xl={3}><p className="mb-1 text-muted">Valor del lote</p><h6>{currencyFormatter.format(lote.valorLote)}</h6></Col>
                                    <Col xl={3}><p className="mb-1 text-muted">Impuestos / envío</p><h6>{currencyFormatter.format(lote.costoEnvio)}</h6></Col>
                                    <Col xl={3}><p className="mb-1 text-muted">Costo total</p><h6 className="text-primary">{currencyFormatter.format(lote.costoTotal)}</h6></Col>
                                    <Col xl={3}><p className="mb-1 text-muted">Productos</p><h6>{lote.totalProductos}</h6></Col>
                                    <Col xl={3}><p className="mb-1 text-muted">Unidades</p><h6>{lote.totalUnidades}</h6></Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="mb-3">
                            <Card.Header><Card.Title as="h5" className="mb-0">Impuestos y tarifas (en orden)</Card.Title></Card.Header>
                            <Card.Body>
                                {lote.impuestos.length === 0 ? (
                                    <p className="text-muted mb-0">Sin impuestos registrados.</p>
                                ) : (
                                    <Table responsive className="table-bordered">
                                        <thead>
                                            <tr><th>#</th><th>Nombre</th><th>Valor</th><th>Monto calculado</th></tr>
                                        </thead>
                                        <tbody>
                                            {[...lote.impuestos].sort((a, b) => a.orden - b.orden).map((impuesto) => (
                                                <tr key={impuesto.idLoteImpuesto}>
                                                    <td>{impuesto.orden}</td>
                                                    <td>{impuesto.nombre}{impuesto.esIva ? ' (IVA)' : ''}</td>
                                                    <td>{impuesto.esPorcentaje ? `${impuesto.valor}%` : currencyFormatter.format(impuesto.valor)}</td>
                                                    <td>{currencyFormatter.format(impuesto.montoCalculado)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>

                        <Card className="mb-3">
                            <Card.Header><Card.Title as="h5" className="mb-0">Productos del lote</Card.Title></Card.Header>
                            <Card.Body>
                                {lote.productos.length === 0 ? (
                                    <p className="text-muted mb-0">Sin productos en el lote.</p>
                                ) : (
                                    <Table responsive className="table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Buenos</th>
                                                <th>Dañados</th>
                                                <th>Total</th>
                                                <th>Costo unitario</th>
                                                <th>PVP sin IVA</th>
                                                <th>Margen %</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {lote.productos.map((producto) => (
                                                <tr key={producto.idLoteProducto}>
                                                    <td>{producto.nombreProducto}</td>
                                                    <td>{producto.cantidadBuenos}</td>
                                                    <td>{producto.cantidadDanados}</td>
                                                    <td>{producto.cantidad}</td>
                                                    <td>{currencyFormatter.format(producto.precioCompraUnitario)}</td>
                                                    <td>{currencyFormatter.format(producto.precioVentaUnitario)}</td>
                                                    <td>{(producto.margenVentaPorcentaje ?? 0).toFixed(2)}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>

                        <Button variant="secondary" onClick={() => onClose()}>Cerrar</Button>
                    </>
                )
            }
        />
    );
};

export default LoteDetailModal;
