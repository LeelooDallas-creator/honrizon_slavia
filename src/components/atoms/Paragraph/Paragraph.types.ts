// Paragraph.astro - Paragraphe stylisé
export interface ParagraphProps {
  size?: 'sm' | 'base' | 'lg';
  variant?: 'blue' | 'red' | 'gold' | 'white' | 'black';
  align?: 'left' | 'center' | 'right';
  spacing?: 'none' | 'xs' | 'sm' | 'base' | 'lg';
}