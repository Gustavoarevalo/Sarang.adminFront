import { Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import Input from "../../Components/components/input/Input";
import { SelectPrincipal } from "../../Components/components/Select/Selects";
import { ModalPrincipal } from "../../Components/components/Modal/Modals";
import { IDropBoxGlobal } from "../../helper/VariablesGLobal";
import { IUpsertImpuestoDto } from "../../api/Controller/Catalogos/Impuestos/InterfaceImpuestos";

interface ImpuestoFormModalProps {
    open: boolean;
    tipoImpuestoOptions: IDropBoxGlobal[];
    onClose: () => void;
    onSubmit: (data: IUpsertImpuestoDto) => void | Promise<void>;
}

// Modal reducido para crear un impuesto sin salir de la pantalla de lotes.
//prettier-ignore
const ImpuestoFormModal: React.FC<ImpuestoFormModalProps> = ({ open, tipoImpuestoOptions, onClose, onSubmit }) => {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [enumTipoImpuesto, setEnumTipoImpuesto] = useState(0);
    const [valor, setValor] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open) {
            return;
        }
        setNombre('');
        setDescripcion('');
        setEnumTipoImpuesto(Number(tipoImpuestoOptions[0]?.value ?? 0));
        setValor('');
        setError('');
    }, [open, tipoImpuestoOptions]);

    const handleSubmit = async () => {
        if (!nombre.trim()) {
            setError('Coloca el nombre del impuesto.');
            return;
        }

        if (!enumTipoImpuesto) {
            setError('Selecciona el tipo de impuesto.');
            return;
        }

        await onSubmit({
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            enumTipoImpuesto,
            valor: Number(valor.replace(',', '.')) || 0,
        });
    };

    return (
        <ModalPrincipal
            open={open}
            setOpen={() => onClose()}
            tittle="Nuevo impuesto"
            height={480}
            children={
                <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <Input
                        label="Nombre"
                        placeholder="Ej: Arancel"
                        value={nombre}
                        onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setNombre(value)}
                    />
                    <Input
                        label="Descripción"
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setDescripcion(value)}
                    />
                    <SelectPrincipal
                        label="Tipo de impuesto"
                        options={tipoImpuestoOptions}
                        selectedRole={enumTipoImpuesto}
                        onChange={(value) => setEnumTipoImpuesto(value)}
                    />
                    <Input
                        label="Valor"
                        type="number"
                        min={0}
                        value={valor}
                        onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => setValor(value)}
                    />

                    {error !== '' && <p className="text-danger fw-bold">{error}</p>}

                    <Button className="me-2" variant="primary" type="submit">Guardar</Button>
                    <Button variant="secondary" onClick={() => onClose()}>Cerrar</Button>
                </Form>
            }
        />
    );
};

export default ImpuestoFormModal;
