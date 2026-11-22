import type { Category, EcommerceProduct } from "@/types";
import { resolveImageUrl } from "@/lib/imageUrl";

export type HomeCategory = { name: string; slug: string; image: string };

/** Presentation only: stock IDs, seller ownership and catalogue records stay intact. */
export function homeProducts(products: EcommerceProduct[], limit = 10) {
  const eligible = products.filter(p => Number(p.quantity) > 0 && resolveImageUrl(p.images[0]?.url) && !/\bdemo\b/i.test(p.sold_by.store_name));
  const selected: EcommerceProduct[] = [];
  const names = new Set<string>();
  const categories = new Set<string>();
  for (const p of eligible) {
    const name = p.product_name.trim().toLowerCase();
    const categoryName = p.category?.name ?? "";
    const category = /watch/i.test(categoryName) && !/smart/i.test(categoryName)
      ? "watches"
      : /smart watch/i.test(categoryName) ? "smart-watches" : p.category?.slug ?? "uncategorized";
    if (names.has(name) || categories.has(category)) continue;
    selected.push(p); names.add(name); categories.add(category);
    if (selected.length === limit) return selected;
  }
  for (const p of eligible) {
    const name = p.product_name.trim().toLowerCase();
    if (names.has(name)) continue;
    selected.push(p); names.add(name);
    if (selected.length === limit) break;
  }
  return selected;
}

export function homeCategories(products: EcommerceProduct[], featured: Category[]): HomeCategory[] {
  const available = homeProducts(products, products.length);
  const groups: [RegExp, string][] = [
    [/^headphones$/i, "Headphones"], [/power bank/i, "Power banks"],
    [/tws earbuds/i, "Earbuds"], [/smart watches.*wearables/i, "Smart watches"],
    [/trimmers.*shavers/i, "Grooming"], [/table.*portable fans/i, "Portable fans"],
    [/game controllers/i, "Gaming"], [/cables.*converters/i, "Cables & adapters"],
  ];
  const result: HomeCategory[] = [];
  for (const [pattern, name] of groups) {
    const p = available.find(p => p.category && pattern.test(p.category.name));
    if (p?.category) result.push({ name, slug: p.category.slug, image: resolveImageUrl(p.images[0]?.url)! });
  }
  for (const c of featured) {
    const image = resolveImageUrl(c.image_url);
    if (result.length >= 8) break;
    if (image && !/\bdemo\b/i.test(c.store?.store_name ?? "") && !result.some(x => x.slug === c.slug)) result.push({ name: c.name, slug: c.slug, image });
  }
  return result;
}
