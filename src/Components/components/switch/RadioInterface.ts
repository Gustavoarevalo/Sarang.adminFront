export interface IRadioProps {
    headerLabel?: string;
    label?: string;
    checked?: boolean;
    disabled?: boolean;
    required?: boolean;
    onChange?: (e: boolean) => void;
    className?: string;
}
