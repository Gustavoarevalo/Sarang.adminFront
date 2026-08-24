import { Button, Col, Form, Row, Table } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import Input from "../../Components/components/input/Input";
import Switch from "../../Components/components/switch/switch";
import { ModalPrincipal } from "../../Components/components/Modal/Modals";
import { useInventoryStore } from "../../store/inventory-store";
import type { ProductSummary, ShippingAddress, StoreOrder } from "../../types/orders";

interface PedidoFormModalProps {
    open: boolean;
    nextOrderNumber: string;
    onClose: () => void;
    onCreate: (order: StoreOrder) => void;
}

const currencyFormatter = new Intl.NumberFormat('es-EC', {
    currency: 'USD',
    style: 'currency',
});

const pad = (value: number) => String(value).padStart(2, '0');

const formatOrderDate = (date: Date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;

//prettier-ignore
const PedidoFormModal: React.FC<PedidoFormModalProps> = ({ open, nextOrderNumber, onClose, onCreate }) => {
    const products = useInventoryStore((state) => state.products);

    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [street, setStreet] = useState('');
    const [detail, setDetail] = useState('');
    const [usesCourier, setUsesCourier] = useState(true);
    const [productSearch, setProductSearch] = useState('');
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open) {
            return;
        }

        setCustomerName('');
        setPhone('');
        setCity('');
        setNeighborhood('');
        setStreet('');
        setDetail('');
        setUsesCourier(true);
        setProductSearch('');
        setQuantities({});
        setError('');
    }, [open]);

    const visibleProducts = useMemo(() => {
        const query = productSearch.trim().toLowerCase();
        return query
            ? products.filter((product) => `${product.name} ${product.category}`.toLowerCase().includes(query))
            : products;
    }, [productSearch, products]);

    const selectedProducts = useMemo<ProductSummary[]>(
        () =>
            products
                .filter((product) => (quantities[product.id] ?? 0) > 0)
                .map((product) => ({
                    id: product.id,
                    name: product.name,
                    quantity: quantities[product.id],
                    unitPrice: product.price,
                })),
        [products, quantities],
    );

    const total = selectedProducts.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const handleSubmit = () => {
        if (!customerName.trim()) {
            setError('Coloca el nombre del cliente.');
            return;
        }

        if (selectedProducts.length === 0) {
            setError('Agrega al menos un producto al pedido.');
            return;
        }

        if (usesCourier && (!city.trim() || !street.trim())) {
            setError('Para enviar por courier coloca al menos la ciudad y la calle.');
            return;
        }

        if (usesCourier && !detail.trim()) {
            setError('Para enviar por courier agrega un detalle o referencia.');
            return;
        }

        const address: ShippingAddress | undefined = usesCourier
            ? {
                customerName: customerName.trim(),
                phone: phone.trim(),
                city: city.trim(),
                neighborhood: neighborhood.trim(),
                street: street.trim(),
                reference: detail.trim(),
            }
            : undefined;

        onCreate({
            id: `ord-${Date.now()}`,
            orderNumber: nextOrderNumber,
            orderDate: formatOrderDate(new Date()),
            deliveryMethod: usesCourier ? 'courier' : 'pickup',
            paymentMethod: 'Pedido manual',
            status: 'iniciado',
            courier: usesCourier ? 'Courier por asignar' : undefined,
            address,
            products: selectedProducts,
        });

        onClose();
    };

    return (
        <ModalPrincipal
            open={open}
            setOpen={() => onClose()}
            tittle={`Nuevo pedido ${nextOrderNumber}`}
            width={950}
            height={660}
            children={
                <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <Row>
                        <Col xl={6}>
                            <Input
                                label="Nombre del cliente"
                                placeholder="Ej: Camila Torres"
                                value={customerName}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setCustomerName(value)}
                            />
                        </Col>
                        <Col xl={6}>
                            <Input
                                label="Teléfono"
                                placeholder="Ej: 099 234 7781"
                                value={phone}
                                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setPhone(value)}
                            />
                        </Col>
                        <Col xl={12}>
                            <Switch
                                label="Enviar por courier"
                                checked={usesCourier}
                                onChange={({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) => setUsesCourier(checked)}
                            />
                        </Col>
                    </Row>

                    {usesCourier && (
                        <Row>
                            <Col xl={4}>
                                <Input
                                    label="Ciudad"
                                    placeholder="Ej: Guayaquil"
                                    value={city}
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setCity(value)}
                                />
                            </Col>
                            <Col xl={4}>
                                <Input
                                    label="Sector / barrio"
                                    placeholder="Ej: Kennedy Norte"
                                    value={neighborhood}
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setNeighborhood(value)}
                                />
                            </Col>
                            <Col xl={4}>
                                <Input
                                    label="Calle"
                                    placeholder="Calle principal y secundaria"
                                    value={street}
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setStreet(value)}
                                />
                            </Col>
                            <Col xl={12}>
                                <Input
                                    label="Detalle / referencia"
                                    placeholder="Ej: Edificio esquinero, recepción planta baja"
                                    value={detail}
                                    onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setDetail(value)}
                                />
                            </Col>
                        </Row>
                    )}

                    <Input
                        label="Buscar producto"
                        placeholder="Nombre o categoría"
                        value={productSearch}
                        onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setProductSearch(value)}
                    />

                    <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                        <Table responsive className="table-bordered">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Stock</th>
                                    <th>Precio</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.category}</td>
                                        <td>{product.stock}</td>
                                        <td>{currencyFormatter.format(product.price)}</td>
                                        <td style={{ maxWidth: 120 }}>
                                            <Form.Control
                                                type="number"
                                                min={0}
                                                value={quantities[product.id] ?? 0}
                                                //prettier-ignore
                                                onChange={({ target: { value } }) => setQuantities((current) => ({ ...current, [product.id]: Math.max(0, Number(value) || 0) }))}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                {visibleProducts.length === 0 && (
                                    <tr><td colSpan={5} className="text-center text-muted">No hay productos.</td></tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    <p className="fw-bold">Subtotal del pedido: {currencyFormatter.format(total)}</p>

                    {error !== '' && <p className="text-danger fw-bold">{error}</p>}

                    <Button className="me-2" variant="primary" type="submit">Crear pedido</Button>
                    <Button variant="secondary" onClick={() => onClose()}>Cerrar</Button>
                </Form>
            }
        />
    );
};

export default PedidoFormModal;
