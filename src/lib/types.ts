export type ProductCardData = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number | null;
  currency: string;
  condition: string;
  stockQuantity: number;
  averageRating: number;
  reviewCount: number;
  isFeatured: boolean;
  image: { url: string; alt: string } | null;
  categoryName: string;
  categorySlug: string;
  brands: { name: string; slug: string }[];
};

export type CategoryNavData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  productCount: number;
};
