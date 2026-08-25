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
  /** Salto permitido en inputs numericos. Sin esto el navegador rechaza decimales. */
  step?: number | string | undefined;
  accept?: string
  file?: string | File | null;
}
