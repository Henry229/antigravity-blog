import { LucideIcon } from 'lucide-react';

export interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  tag?: string;
}

export interface NavItem {
  label: string;
  href: string;
}