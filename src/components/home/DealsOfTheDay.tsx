import Link from "next/link";
import Container from "@/components/shared/Container";
import PopularProductCard from "@/app/(public)/product/_components/PopularProductCard";
import { ROUTES } from "@/config/routes";
import type { EcommerceProduct } from "@/types";
export default function DealsOfTheDay({ products }: { products: EcommerceProduct[] }) {
  const active = products.filter(p => p.promotion).slice(0, 6);
  if (!active.length) return null;
  return <section className="market-section market-deals"><Container><div className="market-section-head"><div><h2>A good deal feels better</h2><p>Explore current offers from our sellers.</p></div><Link href={ROUTES.DEAL_OF_DAY} prefetch={false}>See all deals ↗</Link></div><div className="shop-product-grid market-product-grid">{active.map(p => <PopularProductCard key={p.id} product={p} />)}</div></Container></section>;
}
