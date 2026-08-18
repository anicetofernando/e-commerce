import "server-only";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 20;

function serializeProduct<
  T extends { price: Prisma.Decimal; compareAtPrice: Prisma.Decimal | null; averageRating: Prisma.Decimal; weightKg?: Prisma.Decimal | null },
>(product: T) {
  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    averageRating: Number(product.averageRating),
    weightKg: product.weightKg ? Number(product.weightKg) : null,
  };
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export async function getDashboardStats() {
  const [
    productCount,
    lowStockCount,
    orderCount,
    pendingOrderCount,
    revenueAgg,
    customerCount,
    unreadMessageCount,
    pendingReviewCount,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, stockQuantity: { lte: 5 } } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDENTE" } }),
    prisma.order.aggregate({ where: { status: { not: "CANCELADA" } }, _sum: { total: true } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.review.count({ where: { isApproved: false } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: { id: true, orderNumber: true, customerName: true, total: true, status: true, createdAt: true },
    }),
  ]);

  return {
    productCount,
    lowStockCount,
    orderCount,
    pendingOrderCount,
    revenue: Number(revenueAgg._sum.total ?? 0),
    customerCount,
    unreadMessageCount,
    pendingReviewCount,
    recentOrders: recentOrders.map((o) => ({ ...o, total: Number(o.total) })),
  };
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function getAdminProducts(params: { q?: string; category?: string; page?: number }) {
  const page = Math.max(1, params.page ?? 1);
  const where: Prisma.ProductWhereInput = {};

  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { sku: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.category) {
    where.categoryId = params.category;
  }

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { category: true, images: { take: 1, orderBy: { position: "asc" } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return {
    products: products.map((p) => ({ ...p, price: Number(p.price) })),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getAdminProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      specs: { orderBy: { position: "asc" } },
      compatibility: { include: { machineModel: { include: { brand: true } } } },
    },
  });
  if (!product) return null;
  return serializeProduct(product);
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function getAdminCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return categories;
}

// ---------------------------------------------------------------------------
// Brands & machine models
// ---------------------------------------------------------------------------

export async function getAdminBrands() {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { machineModels: { orderBy: { name: "asc" } }, _count: { select: { machineModels: true } } },
  });
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export async function getAdminOrders(params: { status?: string; page?: number }) {
  const page = Math.max(1, params.page ?? 1);
  const where: Prisma.OrderWhereInput = {};
  if (params.status) {
    where.status = params.status as Prisma.EnumOrderStatusFilter["equals"];
  }

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return {
    orders: orders.map((o) => ({
      ...o,
      subtotal: Number(o.subtotal),
      shippingCost: Number(o.shippingCost),
      discountAmount: Number(o.discountAmount),
      total: Number(o.total),
    })),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getAdminOrderById(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: { select: { id: true, name: true, email: true } } },
  });
  if (!order) return null;
  return {
    ...order,
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    discountAmount: Number(order.discountAmount),
    total: Number(order.total),
    items: order.items.map((item) => ({ ...item, unitPrice: Number(item.unitPrice), lineTotal: Number(item.lineTotal) })),
  };
}

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------

export async function getAdminCustomers(params: { q?: string; page?: number }) {
  const page = Math.max(1, params.page ?? 1);
  const where: Prisma.UserWhereInput = { role: "CUSTOMER" };
  if (params.q) {
    where.OR = [
      { name: { contains: params.q, mode: "insensitive" } },
      { email: { contains: params.q, mode: "insensitive" } },
    ];
  }

  const [total, customers] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { _count: { select: { orders: true } } },
    }),
  ]);

  return { customers, total, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getAdminCustomerById(id: string) {
  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      addresses: true,
      orders: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!customer) return null;
  return {
    ...customer,
    orders: customer.orders.map((o) => ({ ...o, subtotal: Number(o.subtotal), shippingCost: Number(o.shippingCost), total: Number(o.total) })),
  };
}

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export async function getAdminBlogPosts() {
  return prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });
}

export async function getAdminBlogPostById(id: string) {
  return prisma.blogPost.findUnique({ where: { id } });
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export async function getAdminReviews(params: { status?: "pendentes" | "aprovadas"; page?: number }) {
  const page = Math.max(1, params.page ?? 1);
  const where: Prisma.ReviewWhereInput =
    params.status === "pendentes" ? { isApproved: false } : params.status === "aprovadas" ? { isApproved: true } : {};

  const [total, reviews] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { product: { select: { name: true, slug: true } }, user: { select: { name: true, email: true } } },
    }),
  ]);

  return { reviews, total, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

// ---------------------------------------------------------------------------
// Homepage content
// ---------------------------------------------------------------------------

export async function getAdminHeroSlides() {
  return prisma.heroSlide.findMany({ orderBy: { position: "asc" } });
}

export async function getAdminPromoBanners() {
  return prisma.promoBanner.findMany({ orderBy: { position: "asc" } });
}

export async function getAdminPartnerLogos() {
  return prisma.partnerLogo.findMany({ orderBy: { position: "asc" } });
}

// ---------------------------------------------------------------------------
// Business questionnaire
// ---------------------------------------------------------------------------

export async function getAdminQuestionnaireResponses() {
  return prisma.businessQuestionnaireResponse.findMany({ orderBy: { submittedAt: "desc" } });
}

// ---------------------------------------------------------------------------
// Contact messages
// ---------------------------------------------------------------------------

export async function getAdminMessages(params: { status?: "nao-lidas" | "lidas"; page?: number }) {
  const page = Math.max(1, params.page ?? 1);
  const where: Prisma.ContactMessageWhereInput =
    params.status === "nao-lidas" ? { isRead: false } : params.status === "lidas" ? { isRead: true } : {};

  const [total, messages] = await Promise.all([
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return { messages, total, page, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

// ---------------------------------------------------------------------------
// Newsletter subscribers
// ---------------------------------------------------------------------------

export async function getAdminNewsletterSubscribers() {
  return prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
}

// ---------------------------------------------------------------------------
// Coupons
// ---------------------------------------------------------------------------

export async function getAdminCoupons() {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return coupons.map((c) => ({
    ...c,
    value: Number(c.value),
    minOrderValue: c.minOrderValue ? Number(c.minOrderValue) : null,
  }));
}

// ---------------------------------------------------------------------------
// Pricing table (aluguer de equipamentos / mão de obra)
// ---------------------------------------------------------------------------

export async function getPricingTableOverrides(): Promise<Record<string, string>> {
  const row = await prisma.pricingTable.findUnique({ where: { id: "singleton" } });
  return (row?.data as Record<string, string> | undefined) ?? {};
}
