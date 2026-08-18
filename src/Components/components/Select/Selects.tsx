import React from 'react';
import { Col, Form } from 'react-bootstrap';

interface SelectPrincipalProps {
    options: Array<{ value: number; label: string }>;
    selectedRole: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    required?: boolean;
    label?: string;
    placeholder?: string
    errorMessage?: string;
    className?: string
    menuPlacement?: 'top' | 'bottom' | 'auto';
}

//prettier-ignore
export const SelectPrincipal: React.FC<SelectPrincipalProps> = ({ menuPlacement = "top", placeholder = '', options, className, selectedRole, onChange, disabled = false, required = false, label = '', errorMessage = 'Es necesario Escoger una opcion' }) => {


    return (
        <>
            <Col xl={12} className="mb-3">
                <Form.Label className="text-primary">{label}</Form.Label>

                {/* <Col className="d-flex align-items-center">
                    <h6 className="text-primary mt-2 me-2">{label}</h6>
                </Col> */}
                <Form.Select
                    className={className ? `form-select "${" "}${className}` : "form-select "}
                    value={selectedRole ?? ''}
                    onChange={({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => onChange(value === '' ? 0 : Number(value))}
                    disabled={disabled}
                    required={required}
                >
                    <option value="">
                        {placeholder != '' ? placeholder : 'Seleccione'}
                    </option>
                    {options.map((e) => (
                        <option key={e.value} value={e.value}>
                            {e.label}
                        </option>
                    ))}
                </Form.Select>
            </Col>

            {/* 
            <Col xl={12} className="mb-4">
                <Form.Label className="text-primary">{label}</Form.Label>
                <Select
                    isDisabled={disabled}
                    classNamePrefix="Select-sm"
                    options={options}
                    placeholder={label}
                    className={className}
                    value={options.find(option => option.value === selectedRole) || { value: 0, label: 'Ninguno' }}
                    onChange={(e) => onChange(Number(e?.value) || 0)}
                    required={required}
                    menuPlacement={menuPlacement}
                //menuPlacement="top"
                />
                <p className="text-danger mt-1" style={{ visibility: required && !selectedRole ? "visible" : "hidden" }}
                >{errorMessage}</p>
            </Col> */}
        </>
    );

}

