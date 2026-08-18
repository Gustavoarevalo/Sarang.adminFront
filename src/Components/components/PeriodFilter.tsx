import { Button, Col, Form, Row } from "react-bootstrap";
import type { OrderDateRange, OrderPeriodFilter } from "../../types/period";
import { orderPeriodLabels, orderPeriodOptions } from "../../utils/order-period";

interface PeriodFilterProps {
    dateRange: OrderDateRange;
    selectedPeriod: OrderPeriodFilter;
    onChange: (period: OrderPeriodFilter) => void;
    onRangeChange: (range: OrderDateRange) => void;
}

// Filtro de periodo (hoy / semana / mes / rango) usado en Dashboard y Pedidos.
//prettier-ignore
const PeriodFilter: React.FC<PeriodFilterProps> = ({ dateRange, selectedPeriod, onChange, onRangeChange }) => {
    return (
        <Row className="align-items-end mb-3">
            <Col xl={6}>
                <div className="d-flex flex-wrap" style={{ gap: 8 }}>
                    {orderPeriodOptions.map((period) => (
                        <Button
                            key={period}
                            variant={selectedPeriod === period ? 'primary' : 'outline-primary'}
                            onClick={() => onChange(period)}
                        >
                            {orderPeriodLabels[period]}
                        </Button>
                    ))}
                </div>
            </Col>

            {selectedPeriod === 'range' && (
                <>
                    <Col xl={3}>
                        <Form.Label className="text-primary">Desde</Form.Label>
                        <Form.Control
                            type="date"
                            value={dateRange.from}
                            onChange={({ target: { value } }) => onRangeChange({ ...dateRange, from: value })}
                        />
                    </Col>
                    <Col xl={3}>
                        <Form.Label className="text-primary">Hasta</Form.Label>
                        <Form.Control
                            type="date"
                            value={dateRange.to}
                            onChange={({ target: { value } }) => onRangeChange({ ...dateRange, to: value })}
                        />
                    </Col>
                </>
            )}
        </Row>
    );
};

export default PeriodFilter;
