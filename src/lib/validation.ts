import { z } from "zod";
import { PaymentMethod, Province } from "@/generated/prisma/client";

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
