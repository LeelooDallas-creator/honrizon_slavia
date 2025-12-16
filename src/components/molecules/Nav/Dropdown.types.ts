// ============================================
// DROPDOWN - Types & Interfaces
// ============================================

export interface DropdownProps {
  title: string;
  items: DropdownItem[];
}

export interface DropdownItem {
  subtitle: string;
  href: string;
  image: ImageMetadata;
  description: string;
}