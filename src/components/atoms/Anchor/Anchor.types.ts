// ============================================
// ANCHOR - Types & Interfaces
// ============================================

export type AnchorVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type AnchorSize = 'sm' | 'md' | 'lg';

export interface AnchorProps {
  text: string;
  href: string;
  variant?: AnchorVariant;
  size?: AnchorSize;
  disabled?: boolean;
  fullWidth?: boolean;
  ariaLabel?: string;
}