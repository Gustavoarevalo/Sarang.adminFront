import { Col, Form, } from "react-bootstrap";
import { InputProps } from "./Inputinterface";

//prettier-ignore
const Input: React.FC<InputProps> = ({ accept="", id = "", label = "", placeholder = "", max, min, step, Feedback = "", type = "text", required = false, typeFeedback = undefined, value = "", disabled = false, onChange, className = "" }) => {
    return (
        <div>
            <Col className="mb-3">
                <Form.Label className="text-primary">{label}</Form.Label>
                <Form.Control
                    id={id}
                    disabled={disabled}
                    required={required}
                    type={type}
                    className={`mb-3 ${className}`}
                    placeholder={placeholder}
                     {...(type !== "file" ? { value: value instanceof Date ? value.toISOString() : value } : {})}
                    accept={accept}
                    onChange={onChange}
                    max={max}
                    min={min}
                    step={step}
                />
                <Form.Control.Feedback
                    type={typeFeedback}
                >{Feedback}</Form.Control.Feedback>
            </Col>
        </div>
    );
}

export default Input;