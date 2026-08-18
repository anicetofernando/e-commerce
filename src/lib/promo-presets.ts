import { Droplets, Filter, Wrench, ShieldCheck, Truck, Package, Star, Zap, Gauge, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const PROMO_ICONS: Record<string, LucideIcon> = {
  Droplets,
  Filter,
  Wrench,
  ShieldCheck,
  Truck,
  Package,
  Star,
  Zap,
  Gauge,
  Settings,
};

export const PROMO_ICON_KEYS = Object.keys(PROMO_ICONS);

export const PROMO_GRADIENTS: Record<string, string> = {
  laranja: "from-brand-500 to-brand-800",
  escuro: "from-ink-800 to-ink-950",
  azul: "from-blue-600 to-blue-900",
  verde: "from-emerald-600 to-emerald-900",
};

export const PROMO_GRADIENT_LABELS: Record<string, string> = {
  laranja: "Laranja (marca)",
  escuro: "Escuro (grafite)",
  azul: "Azul",
  verde: "Verde",
};
