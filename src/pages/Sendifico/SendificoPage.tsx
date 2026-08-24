import { Badge, Card, Col, Row } from "react-bootstrap";
import Pageheader from "../../Components/Layouts/Pageheader/Pageheader";
import { orderStatusLabels, ordersSeed } from "../../data/orders";

const ESTADOS_COURIER = ['Retiro solicitado', 'Courier retiró paquete', 'En ruta', 'Entregado'];

const SendificoPage = () => {
    const courierOrders = ordersSeed.filter(
        (order) =>
            order.deliveryMethod === 'courier' &&
            Boolean(order.address) &&
            order.status === 'despachado',
    );

    return (
        <div>
            <Pageheader titles="Sendifico" active="Sendifico" />

            <Row className="row-sm">
                <Col lg={12}>
                    <Card>
                        <Card.Header><Card.Title as="h3" className="mb-0">Despachos</Card.Title></Card.Header>
                        <Card.Body>
                            <p className="text-muted">
                                Maqueta de seguimiento para conectar luego con la API o webhooks del courier.
                            </p>

                            <h6 className="text-primary">Estados del courier</h6>
                            {ESTADOS_COURIER.map((status) => (
                                <div key={status} className="d-flex align-items-center mb-2" style={{ gap: 10 }}>
                                    <span
                                        className="bg-primary"
                                        style={{ borderRadius: 999, display: 'inline-block', height: 10, width: 10 }}
                                    />
                                    <span>{status}</span>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>

                {courierOrders.map((order) => (
                    <Col xl={4} key={order.id}>
                        <Card>
                            <Card.Header className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title as="h5" className="mb-0">{order.orderNumber}</Card.Title>
                                    <small className="text-muted">{order.address?.customerName}</small>
                                </div>
                                <Badge bg="primary">{orderStatusLabels[order.status]}</Badge>
                            </Card.Header>
                            <Card.Body>
                                <p className="mb-1">Tracking: <b>{order.sendificoTracking}</b></p>
                                <p className="mb-0 text-muted">
                                    {order.address?.city}, {order.address?.neighborhood}
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}

                {courierOrders.length === 0 && (
                    <Col lg={12}>
                        <Card><Card.Body>
                            <p className="text-muted mb-0 text-center">No hay envíos con courier por ahora.</p>
                        </Card.Body></Card>
                    </Col>
                )}
            </Row>
        </div>
    );
};

export default SendificoPage;
