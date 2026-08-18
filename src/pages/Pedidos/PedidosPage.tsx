import { Badge, Button, Card, Col, Form, Row } from "react-bootstrap";
import { useMemo, useState } from "react";
import Pageheader from "../../Components/Layouts/Pageheader/Pageheader";
import PeriodFilter from "../../Components/components/PeriodFilter";
import { orderStatusFlow, orderStatusLabels, ordersSeed } from "../../data/orders";
import type { OrderStatus, StoreOrder } from "../../types/orders";
import type { OrderDateRange, OrderPeriodFilter } from "../../types/period";
import { filterOrdersByPeriod } from "../../utils/order-period";
import { calculateOrderTotals, IVA_RATE } from "../../utils/order-totals";
import PedidoFormModal from "./PedidoFormModal";

const currencyFormatter = new Intl.NumberFormat('es-EC', {
    currency: 'USD',
    style: 'currency',
});

const generateTrackingNumber = () => String(Math.floor(80000 + Math.random() * 19999));

const PedidosPage = () => {
    const [orders, setOrders] = useState<StoreOrder[]>(ordersSeed);
    const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<OrderPeriodFilter>('today');
    const [dateRange, setDateRange] = useState<OrderDateRange>({
        from: '2026-05-01',
        to: '2026-05-30',
    });

    const filteredOrders = useMemo(
        () => filterOrdersByPeriod(orders, selectedPeriod, dateRange),
        [dateRange, orders, selectedPeriod],
    );

    const counters = useMemo(
        () =>
            filteredOrders.reduce<Record<OrderStatus, number>>(
                (result, order) => ({ ...result, [order.status]: result[order.status] + 1 }),
                {
                    paid: 0,
                    received: 0,
                    packed: 0,
                    'courier-pickup': 0,
                    'in-transit': 0,
                    delivered: 0,
                },
            ),
        [filteredOrders],
    );

    const nextOrderNumber = useMemo(() => `BR-${orders.length + 1001}`, [orders.length]);

    const handleStatusChange = (orderId: string, status: OrderStatus) => {
        //prettier-ignore
        setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, status } : order)));
    };

    const handleRequestTracking = (orderId: string) => {
        setOrders((current) =>
            current.map((order) =>
                order.id === orderId ? { ...order, sendificoTracking: generateTrackingNumber() } : order,
            ),
        );
    };

    const handleCreateOrder = (order: StoreOrder) => {
        setOrders((current) => [order, ...current]);
        setSelectedPeriod('today');
    };

    return (
        <div>
            <Pageheader titles="Pedidos" active="Pedidos" />

            <Row className="row-sm">
                <Col lg={12}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <Card.Title as="h3" className="mb-0">Gestión de pedidos</Card.Title>
                            <Button variant="primary" onClick={() => setIsCreateOrderOpen(true)}>
                                Crear pedido
                            </Button>
                        </Card.Header>
                        <Card.Body>
                            <p className="text-muted">
                                Filtra los pedidos por fecha, crea pedidos externos y cambia su estado hasta la entrega.
                            </p>

                            <PeriodFilter
                                dateRange={dateRange}
                                selectedPeriod={selectedPeriod}
                                onChange={setSelectedPeriod}
                                onRangeChange={setDateRange}
                            />

                            <div className="d-flex flex-wrap mb-3" style={{ gap: 10 }}>
                                {orderStatusFlow.map((status) => (
                                    <Badge key={status} bg="primary-transparent" className="text-primary p-2">
                                        {orderStatusLabels[status]}: {counters[status]}
                                    </Badge>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {filteredOrders.map((order) => {
                    const totals = calculateOrderTotals(order.products);
                    const canRequestTracking = order.deliveryMethod === 'courier' && !order.sendificoTracking;

                    return (
                        <Col xl={6} key={order.id}>
                            <Card>
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Card.Title as="h5" className="mb-0">{order.orderNumber}</Card.Title>
                                        <small className="text-muted">{order.orderDate} · {order.paymentMethod}</small>
                                    </div>
                                    <Badge bg="primary">{orderStatusLabels[order.status]}</Badge>
                                </Card.Header>
                                <Card.Body>
                                    <h6 className="text-primary">Productos</h6>
                                    {order.products.map((product) => (
                                        <div key={product.id} className="d-flex justify-content-between">
                                            <span>{product.quantity}x {product.name}</span>
                                            <span>{currencyFormatter.format(product.unitPrice)}</span>
                                        </div>
                                    ))}
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Subtotal</span>
                                        <span>{currencyFormatter.format(totals.subtotal)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">IVA {IVA_RATE * 100}%</span>
                                        <span>{currencyFormatter.format(totals.iva)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>Total</span>
                                        <span>{currencyFormatter.format(totals.total)}</span>
                                    </div>

                                    {order.deliveryMethod === 'courier' && order.address && (
                                        <>
                                            <hr />
                                            <h6 className="text-primary">Dirección</h6>
                                            <p className="mb-0">{order.address.customerName} · {order.address.phone}</p>
                                            <p className="mb-0">{order.address.city}, {order.address.neighborhood}</p>
                                            <p className="mb-0">{order.address.street}</p>
                                            <p className="text-muted">{order.address.reference}</p>
                                        </>
                                    )}

                                    <hr />
                                    <Row className="align-items-end">
                                        <Col xl={7}>
                                            <Form.Label className="text-primary">Estado del pedido</Form.Label>
                                            <Form.Select
                                                value={order.status}
                                                //prettier-ignore
                                                onChange={({ target: { value } }) => handleStatusChange(order.id, value as OrderStatus)}
                                            >
                                                {orderStatusFlow.map((status) => (
                                                    <option key={status} value={status}>{orderStatusLabels[status]}</option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                        <Col xl={5}>
                                            {order.sendificoTracking ? (
                                                <p className="mb-0 mt-3">Tracking: <b>{order.sendificoTracking}</b></p>
                                            ) : (
                                                <Button
                                                    variant="outline-primary"
                                                    className="w-100"
                                                    disabled={!canRequestTracking}
                                                    onClick={() => handleRequestTracking(order.id)}
                                                >
                                                    Solicitar tracking
                                                </Button>
                                            )}
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}

                {filteredOrders.length === 0 && (
                    <Col lg={12}>
                        <Card><Card.Body>
                            <p className="text-muted mb-0 text-center">No hay pedidos en el periodo seleccionado.</p>
                        </Card.Body></Card>
                    </Col>
                )}
            </Row>

            <PedidoFormModal
                open={isCreateOrderOpen}
                nextOrderNumber={nextOrderNumber}
                onClose={() => setIsCreateOrderOpen(false)}
                onCreate={(order) => handleCreateOrder(order)}
            />
        </div>
    );
};

export default PedidosPage;
