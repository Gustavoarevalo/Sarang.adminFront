import { HTMLInputTypeAttribute } from "react";

export interface InputProps {
  id?: string;
  styles?: React.CSSProperties
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  Feedback?: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  typeFeedback?: "valid" | "invalid";
  disabled?: boolean | undefined;
  value?: string | string[] | number | Date;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  className?: string;
  max?: number | string | undefined;
  min?: number | string | undefined;
  accept?: string
  file?: string | File | null;
}
