import { Card, Col, Row } from "react-bootstrap";
import { useMemo, useState } from "react";
import Pageheader from "../../Components/Layouts/Pageheader/Pageheader";
import PeriodFilter from "../../Components/components/PeriodFilter";
import { ordersSeed } from "../../data/orders";
import type { OrderDateRange, OrderPeriodFilter } from "../../types/period";
import { filterOrdersByPeriod, orderPeriodMetricLabels } from "../../utils/order-period";
import { calculateOrderTotals } from "../../utils/order-totals";

const currencyFormatter = new Intl.NumberFormat('es-EC', {
    currency: 'USD',
    style: 'currency',
});

const FLUJO_OPERATIVO = [
    'Revisar los pedidos nuevos que entran al sistema.',
    'Empaquetar productos y preparar direccion del cliente.',
    'Solicitar retiro con Sendifico y registrar tracking.',
    'Seguir estados del courier hasta entrega final.',
];

const DashboardPage = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<OrderPeriodFilter>('today');
    const [dateRange, setDateRange] = useState<OrderDateRange>({
        from: '2026-05-01',
        to: '2026-05-30',
    });

    const filteredOrders = useMemo(
        () => filterOrdersByPeriod(ordersSeed, selectedPeriod, dateRange),
        [dateRange, selectedPeriod],
    );

    const totalOrders = filteredOrders.length;
    const startedOrders = filteredOrders.filter((order) => order.status === 'iniciado').length;
    const dispatchedOrders = filteredOrders.filter((order) => order.status === 'despachado').length;
    const revenue = filteredOrders.reduce(
        (sum, order) => sum + calculateOrderTotals(order.products).total,
        0,
    );

    return (
        <div>
            <Pageheader titles="Dashboard" active="Dashboard" />

            <Row className="row-sm">
                <Col lg={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h3" className="mb-0">Panel de tienda</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <p className="text-muted">
                                Filtra por periodo, prepara los paquetes pendientes y da seguimiento a los envíos en curso.
                            </p>

                            <PeriodFilter
                                dateRange={dateRange}
                                selectedPeriod={selectedPeriod}
                                onChange={setSelectedPeriod}
                                onRangeChange={setDateRange}
                            />

                            <Row className="row-sm">
                                <Col xl={3} md={6}>
                                    <Card className="bg-primary-transparent">
                                        <Card.Body>
                                            <p className="mb-1 text-muted">{orderPeriodMetricLabels[selectedPeriod]}</p>
                                            <h3 className="mb-0">{totalOrders}</h3>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={3} md={6}>
                                    <Card>
                                        <Card.Body>
                                            <p className="mb-1 text-muted">Por despachar</p>
                                            <h3 className="mb-0">{startedOrders}</h3>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={3} md={6}>
                                    <Card>
                                        <Card.Body>
                                            <p className="mb-1 text-muted">Despachados</p>
                                            <h3 className="mb-0">{dispatchedOrders}</h3>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col xl={3} md={6}>
                                    <Card className="bg-secondary-transparent">
                                        <Card.Body>
                                            <p className="mb-1 text-muted">Ingresos</p>
                                            <h3 className="mb-0">{currencyFormatter.format(revenue)}</h3>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={12}>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h4" className="mb-0">Flujo operativo</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            {FLUJO_OPERATIVO.map((item, index) => (
                                <div key={item} className="d-flex align-items-center mb-3" style={{ gap: 12 }}>
                                    <span
                                        className="badge bg-primary-transparent text-primary fw-bold"
                                        style={{ borderRadius: 999, height: 30, lineHeight: '22px', width: 30 }}
                                    >
                                        {index + 1}
                                    </span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default DashboardPage;
