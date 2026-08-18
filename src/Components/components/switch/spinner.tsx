import { Spinner } from "react-bootstrap";

function GrowExample() {
  return (
    <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner animation="grow" variant="primary" />
    </div>
  );
}

export default GrowExample;
