import { Col } from "react-bootstrap";
import { IRadioProps } from "./RadioInterface";

const Checkbox: React.FC<IRadioProps> = ({ headerLabel = "", label = "", checked = false, disabled = false, onChange, required = false, className = "" }) => {
    const handleToggle = () => onChange?.(!checked);
    return (
        <>
        <Col className="d-flex flex-column align-items-center">
            <input
                type="checkbox"
                className={`form-check-input mb-1 ${className}`}
                checked={checked}
                disabled={disabled}
                onChange={handleToggle}
                required={required}
                style={{ width: "18px", height: "18px" }}
            />
            {label && (
                <span className="mt-1 text-center">
                    {label}
                </span>
            )}
        </Col>
        </>
    );
};

export default Checkbox;
