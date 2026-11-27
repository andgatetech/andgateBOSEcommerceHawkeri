import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductPageDataProvider from "@/app/(public)/product/_components/ProductPageDataProvider";
import { serverFetchJson } from "@/lib/serverFetch";
import type { Brand, PaginatedResponse } from "@/types";

interface BrandDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const response = await serverFetchJson<PaginatedResponse<Brand>>("/brands", { slug, per_page: 1 });
  return response.data.items.find((brand) => brand.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: BrandDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return { title: "Brand Not Found" };
  }

  return {
    title: `${brand.name} Products`,
    description: `Browse products for the ${brand.name} brand on Hawkeri.`,
  };
}

export default async function BrandDetailPage({ params }: BrandDetailPageProps) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  return <ProductPageDataProvider initialBrand={brand.slug} />;
}
