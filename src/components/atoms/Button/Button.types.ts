// ============================================
// BUTTON - Types & Interfaces
// ============================================

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  text: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
  dataAttributes?: Record<string, string>;
}
