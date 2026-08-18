import { Col } from "react-bootstrap";
import { ISwitchProps } from "./switchInterface";

//prettier-ignore
const Switch: React.FC<ISwitchProps> = ({ label = "", disabled = false, checked = false, onChange, required = false }) => {
    return (
        <div>
            <Col xl={2} className="ps-1 pe-1 mb-2">
                <label className="form-switch form-switch mb-0  p-0"  >
                    <input type="checkbox" name="form-switch-radio" className="form-switch-input"
                        disabled={disabled}
                        checked={checked}
                        onChange={onChange}
                        required={required}
                    />
                    <span className="form-switch-indicator"></span>
                    <span className="form-switch-description">{label}</span>
                </label>
            </Col>
        </div>
    );
};

export default Switch;
