// ============================================
// MODAL - Types & Interfaces
// ============================================

export type ModalSize = "sm" | "md" | "lg";
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface ModalProps {
  id: string;
  title: string;
  size?: ModalSize;
  titleLevel?: HeadingLevel;
}
