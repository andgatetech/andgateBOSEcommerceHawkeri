import type { MetadataRoute } from "next";
import { API_ROUTES } from "@/config/apiRoutes";
import { PUBLIC_ROUTES } from "@/config/routes";
import { seoPages } from "@/lib/seo-pages";
import { serverFetchJson } from "@/lib/serverFetch";
import { SITE_URL } from "@/lib/site";
import type {
  Brand,
  Category,
  EcommerceProduct,
  PaginatedResponse,
  Store,
} from "@/types";

export const revalidate = 3600;

const staticRoutes = PUBLIC_ROUTES.filter((route) => !["/login", "/register"].includes(route));

function absoluteUrl(path: string) {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

async function getItems<T>(path: string, perPage: number): Promise<T[]> {
  const first = await serverFetchJson<PaginatedResponse<T>>(path, { page: 1, per_page: Math.min(perPage, 100) }, { revalidate: 3600, timeout: 20000 });
  const items = [...first.data.items];
  const pages = first.data.pagination.last_page;
  if (pages > 450) throw new Error(`Sitemap ${path} requires splitting before exceeding 50,000 URLs`);
  for (let start = 2; start <= pages; start += 4) {
    const batch = await Promise.all(Array.from({ length: Math.min(4, pages - start + 1) }, (_, index) =>
      serverFetchJson<PaginatedResponse<T>>(path, { page: start + index, per_page: Math.min(perPage, 100) }, { revalidate: 3600, timeout: 20000 })));
    for (const response of batch) items.push(...response.data.items);
  }
  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, brands, stores, products] = await Promise.all([
    getItems<Category>(API_ROUTES.ECOMMERCE_CATALOG.CATEGORIES, 100),
    getItems<Brand>(API_ROUTES.ECOMMERCE_CATALOG.BRANDS, 100),
    getItems<Store>(API_ROUTES.ECOMMERCE_CATALOG.STORES, 100),
    getItems<EcommerceProduct>(API_ROUTES.ECOMMERCE_CATALOG.PRODUCTS, 200),
  ]);

  const now = new Date();
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.7,
  }));

  entries.push(
    {
      url: absoluteUrl("/shopping-guides-bangladesh"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.84,
    },
    ...seoPages.map((page) => ({
      url: absoluteUrl(`/${page.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.82,
    })),
    ...categories.map((category) => ({
      url: absoluteUrl(`/category/${category.slug}`),
      lastModified: category.updated_at ? new Date(category.updated_at) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...brands.map((brand) => ({
      url: absoluteUrl(`/brand/${brand.slug}`),
      lastModified: brand.updated_at ? new Date(brand.updated_at) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...stores.map((store) => ({
      url: absoluteUrl(`/store/${store.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...products.map((product) => ({
      url: absoluteUrl(`/product/${product.slug}`),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  );

  return Array.from(new Map(entries.map((entry) => [entry.url, entry])).values());
}
