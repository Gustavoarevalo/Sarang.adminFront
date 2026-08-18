export interface ISwitchProps {
  label?: string;
  disabled?: boolean;
  checked?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  required?: boolean;
}
