import { z } from "zod";
import { EquipmentType, OrderStatus, PaymentMethod, PaymentStatus, Province, ProductCondition } from "@/generated/prisma/client";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "O nome deve ter pelo menos 2 caracteres."),
  email: z.email("Introduza um email válido.").trim().toLowerCase(),
  phone: z
    .string()
    .trim()
    .min(9, "Introduza um número de telefone válido.")
    .optional()
    .or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "A palavra-passe deve ter pelo menos 8 caracteres.")
    .regex(/[a-zA-Z]/, "A palavra-passe deve conter pelo menos uma letra.")
    .regex(/[0-9]/, "A palavra-passe deve conter pelo menos um número."),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email("Introduza um email válido.").trim().toLowerCase(),
  password: z.string().min(1, "Introduza a sua palavra-passe."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const addressSchema = z.object({
  label: z.string().trim().min(1, "Dê um nome a este endereço."),
  recipientName: z.string().trim().min(2, "Introduza o nome do destinatário."),
  phone: z.string().trim().min(9, "Introduza um número de telefone válido."),
  province: z.enum(Province),
  city: z.string().trim().min(2, "Introduza a cidade/distrito."),
  neighborhood: z.string().trim().min(2, "Introduza o bairro."),
  street: z.string().trim().min(2, "Introduza a rua/avenida e número."),
  reference: z.string().trim().optional().or(z.literal("")),
  isDefault: z.boolean().optional(),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Introduza o seu nome completo."),
  customerEmail: z.email("Introduza um email válido.").trim().toLowerCase(),
  customerPhone: z.string().trim().min(9, "Introduza um número de telefone válido."),
  province: z.enum(Province),
  city: z.string().trim().min(2, "Introduza a cidade/distrito."),
  neighborhood: z.string().trim().min(2, "Introduza o bairro."),
  street: z.string().trim().min(2, "Introduza a rua/avenida e número."),
  reference: z.string().trim().optional().or(z.literal("")),
  notes: z.string().trim().optional().or(z.literal("")),
  paymentMethod: z.enum(PaymentMethod),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Introduza o seu nome."),
  email: z.email("Introduza um email válido.").trim().toLowerCase(),
  phone: z.string().trim().optional().or(z.literal("")),
  subject: z.string().trim().min(3, "Introduza um assunto."),
  message: z.string().trim().min(10, "A mensagem deve ter pelo menos 10 caracteres."),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().min(2, "Introduza um título."),
  comment: z.string().trim().min(5, "Escreva um comentário mais detalhado."),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export const newsletterSchema = z.object({
  email: z.email("Introduza um email válido.").trim().toLowerCase(),
});

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export const adminProductSchema = z.object({
  sku: z.string().trim().min(2, "Introduza a referência (SKU)."),
  name: z.string().trim().min(2, "Introduza o nome do produto."),
  slug: z.string().trim().min(2, "Introduza o slug."),
  shortDescription: z.string().trim().min(5, "Introduza uma descrição curta."),
  description: z.string().trim().min(5, "Introduza a descrição completa."),
  categoryId: z.string().trim().min(1, "Escolha uma categoria."),
  price: z.coerce.number().positive("O preço deve ser maior que zero."),
  compareAtPrice: z.coerce.number().positive().optional().or(z.literal("")),
  condition: z.enum(ProductCondition),
  oemNumber: z.string().trim().optional().or(z.literal("")),
  crossReferenceNumbers: z.string().trim().optional().or(z.literal("")),
  stockQuantity: z.coerce.number().int().min(0, "O stock não pode ser negativo."),
  weightKg: z.coerce.number().positive().optional().or(z.literal("")),
  warrantyMonths: z.coerce.number().int().min(0).optional().or(z.literal("")),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;

export const adminCategorySchema = z.object({
  name: z.string().trim().min(2, "Introduza o nome da categoria."),
  slug: z.string().trim().min(2, "Introduza o slug."),
  description: z.string().trim().optional().or(z.literal("")),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  position: z.coerce.number().int().min(0).optional().or(z.literal("")),
});

export type AdminCategoryInput = z.infer<typeof adminCategorySchema>;

export const adminBrandSchema = z.object({
  name: z.string().trim().min(1, "Introduza o nome da marca."),
  slug: z.string().trim().min(1, "Introduza o slug."),
  origin: z.string().trim().optional().or(z.literal("")),
});

export type AdminBrandInput = z.infer<typeof adminBrandSchema>;

export const adminMachineModelSchema = z.object({
  brandId: z.string().trim().min(1, "Escolha uma marca."),
  name: z.string().trim().min(1, "Introduza o nome do modelo."),
  type: z.enum(EquipmentType),
  yearFrom: z.coerce.number().int().optional().or(z.literal("")),
  yearTo: z.coerce.number().int().optional().or(z.literal("")),
});

export type AdminMachineModelInput = z.infer<typeof adminMachineModelSchema>;

export const adminOrderUpdateSchema = z.object({
  status: z.enum(OrderStatus),
  paymentStatus: z.enum(PaymentStatus),
});

export type AdminOrderUpdateInput = z.infer<typeof adminOrderUpdateSchema>;

export const adminBlogPostSchema = z.object({
  title: z.string().trim().min(2, "Introduza o título."),
  slug: z.string().trim().min(2, "Introduza o slug."),
  excerpt: z.string().trim().min(5, "Introduza um resumo."),
  content: z.string().trim().min(20, "Introduza o conteúdo do artigo."),
  coverImageUrl: z.string().trim().min(1, "Introduza a imagem de capa."),
  author: z.string().trim().min(2, "Introduza o autor."),
});

export type AdminBlogPostInput = z.infer<typeof adminBlogPostSchema>;

export const adminHeroSlideSchema = z.object({
  headlineMain: z.string().trim().min(2, "Introduza o título principal."),
  headlineHighlight: z.string().trim().min(2, "Introduza o destaque do título."),
  description: z.string().trim().min(5, "Introduza a descrição."),
  ctaLabel: z.string().trim().min(2, "Introduza o texto do botão."),
  ctaHref: z.string().trim().min(1, "Introduza o destino do botão."),
  photoUrl: z.string().trim().min(1, "Introduza a URL da imagem."),
  photoAlt: z.string().trim().min(2, "Introduza o texto alternativo da imagem."),
  photoCompact: z.boolean().optional(),
  position: z.coerce.number().int().min(0).optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export type AdminHeroSlideInput = z.infer<typeof adminHeroSlideSchema>;

export const adminPromoBannerSchema = z.object({
  title: z.string().trim().min(2, "Introduza o título."),
  badge: z.string().trim().min(2, "Introduza o selo."),
  description: z.string().trim().min(5, "Introduza a descrição."),
  href: z.string().trim().min(1, "Introduza o destino do banner."),
  icon: z.string().trim().min(1, "Escolha um ícone."),
  gradient: z.string().trim().min(1, "Escolha uma cor."),
  position: z.coerce.number().int().min(0).optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export type AdminPromoBannerInput = z.infer<typeof adminPromoBannerSchema>;

export const adminPartnerLogoSchema = z.object({
  name: z.string().trim().min(1, "Introduza o nome do parceiro."),
  imageUrl: z.string().trim().min(1, "Introduza a URL do logótipo."),
  position: z.coerce.number().int().min(0).optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export type AdminPartnerLogoInput = z.infer<typeof adminPartnerLogoSchema>;

export const businessQuestionnaireSchema = z.object({
  respondentName: z.string().trim().min(2, "Introduza o seu nome."),
  respondentRole: z.string().trim().optional().or(z.literal("")),
  a1: z.string().min(1, "Selecione uma opção."),
  a1Outro: z.string().trim().optional().or(z.literal("")),
  c1: z.string().min(1, "Selecione uma opção."),
  c1Outro: z.string().trim().optional().or(z.literal("")),
  c3: z.string().min(1, "Selecione uma opção."),
  c3Outro: z.string().trim().optional().or(z.literal("")),
  e1: z.string().min(1, "Selecione uma opção."),
  e1Outro: z.string().trim().optional().or(z.literal("")),
  e2: z.string().min(1, "Selecione uma opção."),
  e2Outro: z.string().trim().optional().or(z.literal("")),
  g1: z.string().min(1, "Selecione uma opção."),
  g1Outro: z.string().trim().optional().or(z.literal("")),
  h1: z.string().min(1, "Selecione uma opção."),
  h1Outro: z.string().trim().optional().or(z.literal("")),
  notas: z.string().trim().optional().or(z.literal("")),
});

export type BusinessQuestionnaireInput = z.infer<typeof businessQuestionnaireSchema>;

export const adminSiteSettingsSchema = z.object({
  companyName: z.string().trim().min(2, "Introduza o nome da empresa."),
  phonePrimary: z.string().trim().min(6, "Introduza um telefone válido."),
  phoneSecondary: z.string().trim().optional().or(z.literal("")),
  whatsapp: z.string().trim().optional().or(z.literal("")),
  email: z.email("Introduza um email válido.").trim(),
  address: z.string().trim().min(5, "Introduza a morada."),
  hours: z.string().trim().min(5, "Introduza o horário."),
});

export type AdminSiteSettingsInput = z.infer<typeof adminSiteSettingsSchema>;
