import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import Container from "@/components/shared/Container";
import ProductPhoto from "@/components/shared/ProductPhoto";
import { ROUTES, ROUTE_BUILDERS } from "@/config/routes";
import type { HomeCategory } from "@/lib/homeMerchandising";

export default function FeaturedCategories({ categories }: { categories: HomeCategory[] }) {
  if (!categories.length) return null;
  return <section className="market-categories market-section"><Container>
    <div className="market-section-head"><div><h2>What are you shopping for?</h2><p>A few good places to start.</p></div><Link prefetch={false} href={ROUTES.CATEGORY}>All categories <FiArrowRight aria-hidden /></Link></div>
    <div className="market-category-grid">{categories.map(c => <Link prefetch={false} key={c.slug} href={ROUTE_BUILDERS.categoryDetail(c.slug)} className="market-category"><div><ProductPhoto src={c.image} alt={c.name} sizes="(max-width: 639px) 25vw, 12vw" className="object-contain" /></div><h3>{c.name}</h3></Link>)}</div>
  </Container></section>;
}
