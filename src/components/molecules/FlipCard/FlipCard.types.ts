// ============================================
// FLIPCARD - Types & Interfaces
// ============================================

export interface FlipCardProps {
  image: ImageMetadata;
  subtitle: string;
  description: string;
  imageAlt?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1" | "3/2";
  flipDirection?: "horizontal" | "vertical";
  animationDuration?: number; // en ms (default: 600)
  overlayGradient?: string;
}

export type FlipDirection = "horizontal" | "vertical";
