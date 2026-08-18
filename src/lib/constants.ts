import { EquipmentType, OrderStatus, PaymentMethod, PaymentStatus, ProductCondition, Province } from "@/generated/prisma/client";

export const SITE_NAME = "Albimaq Peças";

export const PROVINCE_LABELS: Record<Province, string> = {
  MAPUTO_CIDADE: "Maputo Cidade",
  MAPUTO_PROVINCIA: "Maputo Província",
  GAZA: "Gaza",
  INHAMBANE: "Inhambane",
  SOFALA: "Sofala",
  MANICA: "Manica",
  TETE: "Tete",
  ZAMBEZIA: "Zambézia",
  NAMPULA: "Nampula",
  CABO_DELGADO: "Cabo Delgado",
  NIASSA: "Niassa",
};

export const PROVINCE_OPTIONS = Object.entries(PROVINCE_LABELS).map(
  ([value, label]) => ({ value: value as Province, label }),
);

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
  ESCAVADORA: "Escavadora",
  RETROESCAVADORA: "Retroescavadora",
  PA_CARREGADORA: "Pá Carregadora",
  TRATOR: "Trator",
  MOTONIVELADORA: "Motoniveladora",
  BULLDOZER: "Bulldozer",
  EMPILHADORA: "Empilhadora",
  DUMPER: "Dumper",
  GRUA: "Grua",
  COMPACTADOR: "Compactador",
  GERADOR: "Gerador",
};

export const PRODUCT_CONDITION_LABELS: Record<ProductCondition, string> = {
  NOVO: "Novo",
  RECONDICIONADO: "Recondicionado",
  USADO: "Usado",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  TRANSFERENCIA_BANCARIA: "Transferência Bancária",
  MPESA: "M-Pesa",
  EMOLA: "e-Mola",
  NUMERARIO_NA_ENTREGA: "Numerário na Entrega",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDENTE: "Pendente",
  CONFIRMADA: "Confirmada",
  EM_PROCESSAMENTO: "Em Processamento",
  ENVIADA: "Enviada",
  ENTREGUE: "Entregue",
  CANCELADA: "Cancelada",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDENTE: "Pendente",
  PAGO: "Pago",
  FALHOU: "Falhou",
  REEMBOLSADO: "Reembolsado",
};

export const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  PENDENTE: "bg-amber-50 text-amber-700 ring-amber-600/20",
  PAGO: "bg-green-50 text-green-700 ring-green-600/20",
  FALHOU: "bg-red-50 text-red-700 ring-red-600/20",
  REEMBOLSADO: "bg-purple-50 text-purple-700 ring-purple-600/20",
};

export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  PENDENTE: "bg-amber-50 text-amber-700 ring-amber-600/20",
  CONFIRMADA: "bg-blue-50 text-blue-700 ring-blue-600/20",
  EM_PROCESSAMENTO: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  ENVIADA: "bg-purple-50 text-purple-700 ring-purple-600/20",
  ENTREGUE: "bg-green-50 text-green-700 ring-green-600/20",
  CANCELADA: "bg-red-50 text-red-700 ring-red-600/20",
};

export const CONTACT_INFO = {
  companyName: "Albimaq, Lda",
  phonePrimary: "+258 84 222 7299",
  phoneSecondary: "+258 87 797 0579",
  email: "vendas@albimaq.co.mz",
  whatsapp: "+258 84 222 7299",
  address: "E.N.6 (Auto Estrada) - Manga, Caixa Postal N° 51, 2100 Beira-Sofala, Moçambique",
  hours: "Segunda a Sexta: 08h00 - 17h30 · Sábado: 08h00 - 13h00",
};

export const FREE_SHIPPING_THRESHOLD = 15000;
export const DEFAULT_SHIPPING_COST = 850;
