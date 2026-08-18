import { ValidateNotNumberNegativeProps } from "../interfaceCrudtablet";

//prettier-ignore 
const ValidateNotNumberNegative = ({ value, Onchange }: ValidateNotNumberNegativeProps) => {

    const RenderValidateNotNumberNegative = (value: number) => {
        if (value > 0 && value < 1000) {
            Onchange(value)
        }
    }

    return (
        <div>
            <input
                type="number"
                className="border-2 rounded w-12 none-style border-primary-500"
                value={value.toString()}
                onChange={({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => RenderValidateNotNumberNegative(Number(value))}
            />
        </div>

    )
}

export default ValidateNotNumberNegative;