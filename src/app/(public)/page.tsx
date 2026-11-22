import Container from "@/components/shared/Container";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedStores from "@/components/home/FeaturedStores";
import PopularProductsSection from "./product/_components/PopularProductsSection";
import DealsOfTheDay from "@/components/home/DealsOfTheDay";
import HomeBenefits from "@/components/home/HomeBenefits";
import HomeCollections from "@/components/home/HomeCollections";
import { homeProducts, homeCategories } from "@/lib/homeMerchandising";
import RecentlyViewedSection from "@/components/home/RecentlyViewedSection";
import { serverFetchJson } from "@/lib/serverFetch";
import { API_ROUTES } from "@/config/apiRoutes";
import { SITE_URL } from "@/lib/site";
import type { Metadata } from "next";
import type { Category, EcommerceProduct, PaginatedResponse, Store } from "@/types";

export const metadata: Metadata = {
  title: "Online Shopping in Bangladesh",
  description:
    "Shop fashion, beauty, electronics, grocery and daily essentials from local sellers on Hawkeri, a Bangladesh-focused online shopping marketplace.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: SITE_URL,
    siteName: "Hawkeri",
    title: "Online Shopping in Bangladesh | Hawkeri",
    description:
      "Discover local sellers, marketplace stores, COD-friendly shopping and daily products on Hawkeri.",
  },
};

async function getPageItems<T>(
  path: string,
  params: Record<string, string | number | undefined | null>,
): Promise<T[]> {
  const response = await serverFetchJson<PaginatedResponse<T>>(
    path,
    { ...params, page: 1 },
    { revalidate: 60 },
  );
  return response.data.items;
}

async function getHomeProducts(): Promise<{ items: EcommerceProduct[]; total: number }> {
  try {
    const response = await serverFetchJson<PaginatedResponse<EcommerceProduct>>(
      API_ROUTES.ECOMMERCE_CATALOG.PRODUCTS,
      { page: 1, per_page: 80, sort_field: "created_at", sort_direction: "desc" },
      { revalidate: 30 },
    );
    return { items: response.data.items, total: response.data.pagination?.total ?? response.data.items.length };
  } catch (err) {
    console.error("[HomePage] Failed to fetch products:", err);
    return { items: [], total: 0 };
  }
}

async function getFeaturedCategories(): Promise<Category[]> {
  try {
    return await getPageItems<Category>(
      API_ROUTES.ECOMMERCE_CATALOG.FEATURED_CATEGORIES,
      { limit: 10 },
    );
  } catch (err) {
    console.error("[HomePage] Failed to fetch featured categories:", err);
    return [];
  }
}

async function getPopularProducts(): Promise<EcommerceProduct[]> {
  try {
    return await getPageItems<EcommerceProduct>(
      API_ROUTES.ECOMMERCE_CATALOG.POPULAR_PRODUCTS,
      { limit: 12 },
    );
  } catch (err) {
    console.error("[HomePage] Failed to fetch popular products:", err);
    return [];
  }
}

async function getDealsOfTheDay(): Promise<EcommerceProduct[]> {
  try {
    return await getPageItems<EcommerceProduct>(
      API_ROUTES.ECOMMERCE_CATALOG.DEALS_OF_DAY,
      { limit: 10 },
    );
  } catch (err) {
    console.error("[HomePage] Failed to fetch deals of the day:", err);
    return [];
  }
}

async function getHomeStores(): Promise<Store[]> {
  try {
    return await getPageItems<Store>(API_ROUTES.ECOMMERCE_CATALOG.STORES, {
      per_page: 100, sort_field: "store_name", sort_direction: "asc",
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const dedup = <T extends { id: number }>(arr: T[]) =>
    Array.from(new Map(arr.map((x) => [x.id, x])).values());

  const [rawProducts, featuredCategories, rawPopular, rawDeals, stores] = await Promise.all([
    getHomeProducts(),
    getFeaturedCategories(),
    getPopularProducts(),
    getDealsOfTheDay(),
    getHomeStores(),
  ]);
  const products = dedup(rawProducts.items);
  const popularProducts = dedup(rawPopular);
  const dealProducts = homeProducts(dedup(rawDeals), 5);
  const categories = homeCategories(products, featuredCategories);
  const fresh = homeProducts(products, 10);
  const more = homeProducts([...products, ...popularProducts], 40).filter(p => !fresh.some(first => first.id === p.id || first.product_name.trim().toLowerCase() === p.product_name.trim().toLowerCase())).slice(0, 10);
  return (
    <main className="market-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Hawkeri featured products",
            itemListElement: [...fresh, ...more].map((product, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${SITE_URL}/product/${product.slug}`,
              name: product.product_name,
            })),
          }),
        }}
      />

      <HeroBanner products={products} categories={categories} />
      <HomeBenefits />
      <FeaturedCategories categories={categories} />
      <PopularProductsSection products={fresh} />
      <DealsOfTheDay products={dealProducts} />
      <HomeCollections products={products} />
      <PopularProductsSection products={more} title="More to explore" description="A little inspiration for your next order." id="discover-more" />
      <FeaturedStores stores={stores.filter(store => [...fresh, ...more].some(p => p.sold_by.store_slug === store.slug))} />
      <Container><RecentlyViewedSection /></Container>
    </main>
  );
}
