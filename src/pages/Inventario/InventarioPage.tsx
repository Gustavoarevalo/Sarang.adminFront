import { Badge, Card, Col, Row, Table } from "react-bootstrap";
import { useEffect, useMemo } from "react";
import Pageheader from "../../Components/Layouts/Pageheader/Pageheader";
import { useInventoryStore } from "../../store/inventory-store";

const currencyFormatter = new Intl.NumberFormat('es-EC', {
    currency: 'USD',
    style: 'currency',
});

const InventarioPage = () => {
    const products = useInventoryStore((state) => state.products);
    const batches = useInventoryStore((state) => state.batches);
    const loadInventory = useInventoryStore((state) => state.loadInventory);

    useEffect(() => {
        loadInventory();
    }, [loadInventory]);

    const inventoryValue = useMemo(
        () => products.reduce((sum, product) => sum + product.stock * product.backendUnitCost, 0),
        [products],
    );

    const lowStockProducts = products.filter((product) => product.stock > 0 && product.stock <= 2);
    const outOfStockProducts = products.filter((product) => product.stock === 0);

    const movements = batches.flatMap((batch) =>
        batch.items.map((item) => ({
            id: `${batch.id}-${item.id}`,
            batchCode: batch.batchCode,
            date: batch.publishDate,
            productName: item.productName,
            quantity: item.quantity,
            damagedQuantity: item.receivedDamagedQuantity,
            value: item.quantity * item.baseUnitCost,
        })),
    );

    return (
        <div>
            <Pageheader titles="Inventario" active="Inventario" />

            <Row className="row-sm">
                <Col xl={3} md={6}>
                    <Card className="bg-primary-transparent"><Card.Body>
                        <p className="mb-1 text-muted">Productos activos</p>
                        <h3 className="mb-0">{products.length}</h3>
                    </Card.Body></Card>
                </Col>
                <Col xl={3} md={6}>
                    <Card className="bg-secondary-transparent"><Card.Body>
                        <p className="mb-1 text-muted">Valor stock costo</p>
                        <h3 className="mb-0">{currencyFormatter.format(inventoryValue)}</h3>
                    </Card.Body></Card>
                </Col>
                <Col xl={3} md={6}>
                    <Card><Card.Body>
                        <p className="mb-1 text-muted">Stock bajo</p>
                        <h3 className="mb-0">{lowStockProducts.length}</h3>
                    </Card.Body></Card>
                </Col>
                <Col xl={3} md={6}>
                    <Card><Card.Body>
                        <p className="mb-1 text-muted">Agotados</p>
                        <h3 className="mb-0">{outOfStockProducts.length}</h3>
                    </Card.Body></Card>
                </Col>

                <Col lg={12}>
                    <Card>
                        <Card.Header><Card.Title as="h4" className="mb-0">Alertas de inventario</Card.Title></Card.Header>
                        <Card.Body>
                            {[...outOfStockProducts, ...lowStockProducts].slice(0, 6).map((product) => (
                                <div key={product.id} className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <p className="mb-0 fw-bold">{product.name}</p>
                                        <small className="text-muted">
                                            {product.category} · Precio {currencyFormatter.format(product.price)}
                                        </small>
                                    </div>
                                    <Badge bg={product.stock === 0 ? 'danger' : 'warning'}>
                                        {product.stock === 0 ? 'Agotado' : `Stock ${product.stock}`}
                                    </Badge>
                                </div>
                            ))}
                            {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && (
                                <p className="text-muted mb-0">No hay alertas de stock por ahora.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={12}>
                    <Card>
                        <Card.Header><Card.Title as="h4" className="mb-0">Existencias por producto</Card.Title></Card.Header>
                        <Card.Body>
                            <Table responsive className="table-bordered">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Categoría</th>
                                        <th>Costo base</th>
                                        <th>PVP</th>
                                        <th>Unidades</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id}>
                                            <td>{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>{currencyFormatter.format(product.backendUnitCost)}</td>
                                            <td>{product.price > 0 ? currencyFormatter.format(product.price) : 'Sin PVP'}</td>
                                            <td>{product.stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={12}>
                    <Card>
                        <Card.Header><Card.Title as="h4" className="mb-0">Movimientos recientes</Card.Title></Card.Header>
                        <Card.Body>
                            <Table responsive className="table-bordered">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Lote</th>
                                        <th>Fecha</th>
                                        <th>Dañados</th>
                                        <th>Ingreso</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movements.slice(0, 8).map((movement) => (
                                        <tr key={movement.id}>
                                            <td>{movement.productName}</td>
                                            <td>{movement.batchCode}</td>
                                            <td>{movement.date}</td>
                                            <td>{movement.damagedQuantity}</td>
                                            <td>+{movement.quantity}</td>
                                            <td>{currencyFormatter.format(movement.value)}</td>
                                        </tr>
                                    ))}
                                    {movements.length === 0 && (
                                        <tr><td colSpan={6} className="text-center text-muted">Sin movimientos.</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default InventarioPage;
