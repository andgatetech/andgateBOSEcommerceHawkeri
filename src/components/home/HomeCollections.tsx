import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import Container from "@/components/shared/Container";
import ProductPhoto from "@/components/shared/ProductPhoto";
import { ROUTE_BUILDERS } from "@/config/routes";
import { homeProducts } from "@/lib/homeMerchandising";
import { resolveImageUrl } from "@/lib/imageUrl";
import type { EcommerceProduct } from "@/types";

export default function HomeCollections({ products }: { products: EcommerceProduct[] }) {
  const available = homeProducts(products, products.length);
  const edits = [
    { pattern: /trimmers.*shavers/i, kicker: "Your daily routine", title: "A fresh start, every day.", description: "Find your next grooming essential.", tone: "peach" },
    { pattern: /tws earbuds/i, kicker: "Take your sound along", title: "Less noise. More you.", description: "Explore earbuds for your everyday playlist.", tone: "blue" },
  ].map(edit => ({ ...edit, product: available.find(p => edit.pattern.test(p.category?.name ?? "")) })).filter(edit => edit.product?.category);
  if (!edits.length) return null;
  return <section className="market-collections market-section" aria-label="Explore collections"><Container><div className="market-collection-grid">{edits.map(({ product: p, ...edit }) => p?.category && <Link prefetch={false} className={`market-collection market-collection-${edit.tone}`} key={p.id} href={ROUTE_BUILDERS.categoryDetail(p.category.slug)}><div><p className="market-kicker">{edit.kicker}</p><h2>{edit.title}</h2><p>{edit.description}</p><span>Shop the collection <FiArrowRight aria-hidden /></span></div><div className="market-collection-image"><ProductPhoto src={resolveImageUrl(p.images[0]?.url)} alt={p.product_name} sizes="(max-width: 760px) 40vw, 22vw" className="object-contain" /></div></Link>)}</div></Container></section>;
}
