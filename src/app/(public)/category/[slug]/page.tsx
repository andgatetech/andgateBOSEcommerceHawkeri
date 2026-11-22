import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductPageDataProvider from "@/app/(public)/product/_components/ProductPageDataProvider";
import { serverFetchJson } from "@/lib/serverFetch";
import type { Category, PaginatedResponse } from "@/types";

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

// The catalogue spans multiple pages; valid categories must not become 404s
// simply because their names sort beyond the first page.
const getCategories = cache(async (): Promise<Category[]> => {
  try {
    const response = await serverFetchJson<PaginatedResponse<Category>>("/categories", {
      page: 1, per_page: 100, sort_field: "name", sort_direction: "asc",
    });
    const remaining = await Promise.all(
      Array.from({ length: Math.max(0, response.data.pagination.last_page - 1) }, (_, i) =>
        serverFetchJson<PaginatedResponse<Category>>("/categories", {
          page: i + 2, per_page: 100, sort_field: "name", sort_direction: "asc",
        }),
      ),
    );
    return [...response.data.items, ...remaining.flatMap(page => page.data.items)];
  } catch {
    return [];
  }
});

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return (await getCategories()).find(category => category.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: CategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  return {
    title: `${category.name} Products`,
    description: `Browse products in the ${category.name} category on Hawkeri.`,
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryDetailPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return <ProductPageDataProvider initialCategory={category.slug} categories={await getCategories()} />;
}
