import React, { useEffect, useMemo, useState } from "react";
import { Form, InputGroup, Spinner, ListGroup } from "react-bootstrap";
import { CustomSearchProps, CustomSearchPropsApi } from "./InterfaceCustomSeacrh";

const CustomSearch: React.FC<CustomSearchProps> = ({
  required,
  input,
  placeholder,
  selectId,
  selectLabel,
  setinput,
  disabled,
  result,
  color
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);


  const filteredOptions = useMemo(() => result ?? [], [result]);

  useEffect(() => {
    const hasInput = input.trim() !== "";
    setShowOptions(hasInput && filteredOptions.length > 0 && !isSelected);
    setLoading(hasInput && filteredOptions.length === 0 && !isSelected);
  }, [input, filteredOptions]);

  const handleChange = (value: CustomSearchPropsApi) => {
    selectLabel?.(value.label);
    selectId?.(value.value);
    setinput(value.label);
    setIsSelected(true);
    setShowOptions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setinput(e.target.value);
    setIsSelected(false);
  };

  return (
    <div style={{ position: "relative", maxWidth: 300 }}>
      <InputGroup>
        <Form.Control
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={handleInputChange}
          disabled={disabled}
          required={required}
          style={{ borderColor: color }}
        />
        <InputGroup.Text>
          {loading ? <Spinner animation="border" size="sm" /> : <i className="bi bi-search"></i>}
        </InputGroup.Text>
      </InputGroup>

      {showOptions && (
        <ListGroup style={{
          position: "absolute",
          zIndex: 1000,
          width: "100%",
          maxHeight: "200px",
          overflowY: "auto"
        }}>
          {filteredOptions.map((option, idx) => (
            <ListGroup.Item key={idx} action onClick={() => handleChange(option)}>
              {option.label}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default CustomSearch;
