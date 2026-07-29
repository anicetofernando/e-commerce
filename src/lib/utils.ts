import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string, currency = "MZN") {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("pt-MZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("pt-MZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function generateOrderNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `ALB-${year}-${random}`;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
