import "server-only";
import { prisma } from "@/lib/db";
import type { ProductCardData, CategoryNavData } from "@/lib/types";
import type { Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 12;

function toCardData(
  product: Prisma.ProductGetPayload<{
    include: { images: { take: 1 }; category: true };
  }>,
): ProductCardData {
  return {
    id: product.id,
    sku: product.sku,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    currency: product.currency,
    condition: product.condition,
    stockQuantity: product.stockQuantity,
    averageRating: Number(product.averageRating),
    reviewCount: product.reviewCount,
    isFeatured: product.isFeatured,
    image: product.images[0] ? { url: product.images[0].url, alt: product.images[0].alt } : null,
    categoryName: product.category.name,
    categorySlug: product.category.slug,
  };
}

const cardInclude = {
  images: { take: 1 as const, orderBy: { position: "asc" as const } },
  category: true,
} satisfies Prisma.ProductInclude;

export async function getCategories(): Promise<CategoryNavData[]> {
  const categories = await prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    imageUrl: c.imageUrl,
    productCount: c._count.products,
  }));
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getFeaturedProducts(limit = 8): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: cardInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toCardData);
}

export async function getNewProducts(limit = 8): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: cardInclude,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return products.map(toCardData);
}

export async function getPopularProducts(limit = 8): Promise<ProductCardData[]> {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: cardInclude,
    take: limit,
    orderBy: [{ reviewCount: "desc" }, { averageRating: "desc" }],
  });
  return products.map(toCardData);
}

export type ProductFilters = {
  q?: string;
  category?: string;
  brand?: string;
  machineModelId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  sort?: "relevancia" | "preco-asc" | "preco-desc" | "recentes" | "avaliacao";
  page?: number;
};

export async function searchProducts(filters: ProductFilters) {
  const page = Math.max(1, filters.page ?? 1);

  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { sku: { contains: filters.q, mode: "insensitive" } },
      { oemNumber: { contains: filters.q, mode: "insensitive" } },
      { shortDescription: { contains: filters.q, mode: "insensitive" } },
      { crossReferenceNumbers: { hasSome: [filters.q] } },
    ];
  }

  if (filters.category) {
    where.category = { slug: filters.category };
  }

  if (filters.condition) {
    where.condition = filters.condition as Prisma.EnumProductConditionFilter["equals"];
  }

  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      ...(filters.minPrice ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice ? { lte: filters.maxPrice } : {}),
    };
  }

  if (filters.brand || filters.machineModelId) {
    where.compatibility = {
      some: {
        machineModel: {
          ...(filters.brand ? { brand: { slug: filters.brand } } : {}),
          ...(filters.machineModelId ? { id: filters.machineModelId } : {}),
        },
      },
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "preco-asc"
      ? { price: "asc" }
      : filters.sort === "preco-desc"
        ? { price: "desc" }
        : filters.sort === "avaliacao"
          ? { averageRating: "desc" }
          : filters.sort === "recentes"
            ? { createdAt: "desc" }
            : { isFeatured: "desc" };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: cardInclude,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return {
    products: products.map(toCardData),
    total,
    page,
    pageSize: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      specs: { orderBy: { position: "asc" } },
      compatibility: { include: { machineModel: { include: { brand: true } } } },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!product) return null;

  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    weightKg: product.weightKg ? Number(product.weightKg) : null,
    averageRating: Number(product.averageRating),
  };
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  const products = await prisma.product.findMany({
    where: { categoryId, isActive: true, id: { not: excludeId } },
    include: cardInclude,
    take: limit,
    orderBy: { isFeatured: "desc" },
  });
  return products.map(toCardData);
}

export async function getBrandsWithModels() {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: { machineModels: { orderBy: { name: "asc" } } },
  });
}

export async function getBlogPosts(limit?: number) {
  return prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function getOrderByNumber(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) return null;

  return {
    ...order,
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.lineTotal),
    })),
  };
}

export async function getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return orders.map((order) => ({
    ...order,
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    total: Number(order.total),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.lineTotal),
    })),
  }));
}

export async function getPriceBounds() {
  const agg = await prisma.product.aggregate({
    where: { isActive: true },
    _min: { price: true },
    _max: { price: true },
  });
  return {
    min: agg._min.price ? Number(agg._min.price) : 0,
    max: agg._max.price ? Number(agg._max.price) : 0,
  };
}
