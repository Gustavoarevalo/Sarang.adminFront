import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import Input from "../../Components/components/input/Input";
import { SelectPrincipal } from "../../Components/components/Select/Selects";
import { ModalPrincipal } from "../../Components/components/Modal/Modals";
//prettier-ignore
import { DISCOUNT_TARGET, DISCOUNT_TYPE, IAdminDiscountDto, IAdminDiscountFormDto } from "../../api/Controller/Descuentos/InterfaceDescuentos";
import { currencyFormatter, SALES_IVA_PERCENT, toNumber } from "../Promociones/promotionCalculations";

export type DiscountTargetOption = {
    id: number;
    name: string;
    baseCost: number;
    finalPriceWithIva: number;
};

interface DescuentoFormModalProps {
    open: boolean;
    loading: boolean;
    editing: IAdminDiscountDto | null;
    productOptions: DiscountTargetOption[];
    promotionOptions: DiscountTargetOption[];
    onClose: () => void;
    onSubmit: (id: number | null, form: IAdminDiscountFormDto) => void | Promise<void>;
}

const pad = (value: number) => String(value).padStart(2, '0');

const todayIso = () => {
    const now = new Date();
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const addDaysIso = (date: string, amount: number) => {
    const [year, month, day] = date.split('-').map(Number);
    const next = new Date(year, month - 1, day + amount);
    return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`;
};

const calculateDiscount = (input: {
    baseCost: number;
    discountType: number;
    discountValue: number;
    finalPriceWithIva: number;
}) => {
    const discountAmount =
        input.discountType === DISCOUNT_TYPE.Porcentaje
            ? input.finalPriceWithIva * (Math.min(100, Math.max(0, input.discountValue)) / 100)
            : Math.max(0, input.discountValue);
    const discountedFinalWithIva = Math.max(0, input.finalPriceWithIva - discountAmount);
    const originalPvpWithoutIva =
        input.finalPriceWithIva > 0 ? input.finalPriceWithIva / (1 + SALES_IVA_PERCENT / 100) : 0;
    const discountedPvpWithoutIva =
        discountedFinalWithIva > 0 ? discountedFinalWithIva / (1 + SALES_IVA_PERCENT / 100) : 0;

    return {
        baseCost: input.baseCost,
        discountedFinalWithIva,
        discountedPvpWithoutIva,
        originalFinalWithIva: input.finalPriceWithIva,
        originalPvpWithoutIva,
    };
};

//prettier-ignore
const DescuentoFormModal: React.FC<DescuentoFormModalProps> = ({ open, loading, editing, productOptions, promotionOptions, onClose, onSubmit }) => {
    const [targetType, setTargetType] = useState<number>(DISCOUNT_TARGET.Producto);
    const [targetId, setTargetId] = useState<number>(0);
    const [discountType, setDiscountType] = useState<number>(DISCOUNT_TYPE.Porcentaje);
    const [discountValue, setDiscountValue] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open) {
            return;
        }

        const fallbackStart = todayIso();
        const fallbackEnd = addDaysIso(fallbackStart, 30);

        if (editing) {
            setTargetType(editing.targetType);
            setTargetId(editing.targetId);
            setDiscountType(editing.tipoDescuento);
            setDiscountValue(editing.valorDescuento > 0 ? String(editing.valorDescuento) : '');
            setStartDate(editing.startDate || fallbackStart);
            setEndDate(editing.endDate || fallbackEnd);
        } else {
            setTargetType(DISCOUNT_TARGET.Producto);
            setTargetId(productOptions[0]?.id ?? 0);
            setDiscountType(DISCOUNT_TYPE.Porcentaje);
            setDiscountValue('');
            setStartDate(fallbackStart);
            setEndDate(fallbackEnd);
        }

        setError('');
    }, [open, editing, productOptions]);

    const targets = targetType === DISCOUNT_TARGET.Producto ? productOptions : promotionOptions;

    const selectedTarget = useMemo(
        () => targets.find((target) => target.id === targetId) ?? targets[0],
        [targets, targetId],
    );

    const calculation = calculateDiscount({
        baseCost: selectedTarget?.baseCost ?? 0,
        discountType,
        discountValue: toNumber(discountValue),
        finalPriceWithIva: selectedTarget?.finalPriceWithIva ?? 0,
    });

    const handleTargetTypeChange = (nextType: number) => {
        setTargetType(nextType);
        const list = nextType === DISCOUNT_TARGET.Producto ? productOptions : promotionOptions;
        setTargetId(list[0]?.id ?? 0);
    };

    const handleSubmit = async () => {
        if (!selectedTarget) {
            setError('Selecciona un producto o promoción.');
            return;
        }

        if (toNumber(discountValue) <= 0) {
            setError('Coloca un descuento mayor a cero.');
            return;
        }

        if (!startDate.trim() || !endDate.trim()) {
            setError('La fecha de inicio y fin son obligatorias.');
            return;
        }

        const form: IAdminDiscountFormDto = {
            idDescuento: editing?.id ?? 0,
            name: null,
            targetType,
            targetId: selectedTarget.id,
            tipoDescuento: discountType,
            valorDescuento: toNumber(discountValue),
            startDate,
            endDate,
        };

        await onSubmit(editing?.id ?? null, form);
    };

    return (
        <ModalPrincipal
            open={open}
            setOpen={() => onClose()}
            tittle={editing ? 'Editar descuento' : 'Nuevo descuento'}
            width={800}
            height={620}
            children={
                <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <Row>
                        <Col xl={6}>
                            <SelectPrincipal
                                label="Aplicar a"
                                options={[
                                    { value: DISCOUNT_TARGET.Producto, label: 'Producto' },
                                    { value: DISCOUNT_TARGET.Promocion, label: 'Promoción' },
                                ]}
                                selectedRole={targetType}
                                disabled={loading}
                                onChange={(value) => handleTargetTypeChange(value)}
                            />
                        </Col>
                        <Col xl={6}>
                            <SelectPrincipal
                                label={targetType === DISCOUNT_TARGET.Producto ? 'Producto' : 'Promoción'}
                                options={targets.map((target) => ({ value: target.id, label: target.name }))}
                                selectedRole={selectedTarget?.id ?? 0}
                                disabled={loading}
                                onChange={(value) => setTargetId(value)}
                            />
                        </Col>
                        <Col xl={6}>
                            <SelectPrincipal
                                label="Tipo de descuento"
                                options={[
                                    { value: DISCOUNT_TYPE.Porcentaje, label: 'Porcentaje (%)' },
                                    { value: DISCOUNT_TYPE.Fijo, label: 'Valor fijo ($)' },
                                ]}
                                selectedRole={discountType}
                                disabled={loading}
                                onChange={(value) => setDiscountType(value)}
                            />
                        </Col>
                        <Col xl={6}>
                            <Input
                                label="Valor del descuento"
                                type="number"
                                min={0}
                                placeholder={discountType === DISCOUNT_TYPE.Porcentaje ? 'Ej: 15' : 'Ej: 5.00'}
                                disabled={loading}
                                value={discountValue}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setDiscountValue(value)}
                            />
                        </Col>
                        <Col xl={6}>
                            <Input
                                label="Fecha de inicio"
                                type="date"
                                disabled={loading}
                                value={startDate}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setStartDate(value)}
                            />
                        </Col>
                        <Col xl={6}>
                            <Input
                                label="Fecha fin"
                                type="date"
                                disabled={loading}
                                value={endDate}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setEndDate(value)}
                            />
                        </Col>
                    </Row>

                    <Card className="mb-3">
                        <Card.Header><Card.Title as="h5" className="mb-0">Resultado del descuento</Card.Title></Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xl={4}><p className="mb-1 text-muted">Costo base</p><h6>{currencyFormatter.format(calculation.baseCost)}</h6></Col>
                                <Col xl={4}><p className="mb-1 text-muted">Precio original</p><h6>{currencyFormatter.format(calculation.originalFinalWithIva)}</h6></Col>
                                <Col xl={4}><p className="mb-1 text-muted">Precio con descuento</p><h6 className="text-primary">{currencyFormatter.format(calculation.discountedFinalWithIva)}</h6></Col>
                                <Col xl={6}><p className="mb-1 text-muted">PVP sin IVA original</p><h6>{currencyFormatter.format(calculation.originalPvpWithoutIva)}</h6></Col>
                                <Col xl={6}><p className="mb-1 text-muted">PVP sin IVA con descuento</p><h6>{currencyFormatter.format(calculation.discountedPvpWithoutIva)}</h6></Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {error !== '' && <p className="text-danger fw-bold">{error}</p>}

                    <Button className="me-2" variant="primary" type="submit" disabled={loading}>
                        {editing ? 'Guardar cambios' : 'Crear descuento'}
                    </Button>
                    <Button variant="secondary" onClick={() => onClose()} disabled={loading}>Cerrar</Button>
                </Form>
            }
        />
    );
};

export default DescuentoFormModal;
