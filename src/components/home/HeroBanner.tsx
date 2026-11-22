import Link from "next/link";
import { FiArrowRight, FiChevronRight, FiGrid } from "react-icons/fi";
import ProductPhoto from "@/components/shared/ProductPhoto";
import Container from "@/components/shared/Container";
import { ROUTES, ROUTE_BUILDERS } from "@/config/routes";
import { resolveImageUrl } from "@/lib/imageUrl";
import { homeProducts, type HomeCategory } from "@/lib/homeMerchandising";
import type { EcommerceProduct } from "@/types";

export default function HeroBanner({ products = [], categories = [] }: { products?: EcommerceProduct[]; categories?: HomeCategory[] }) {
  const available = homeProducts(products, products.length);
  const lead = available.find(p => /^headphones$/i.test(p.category?.name ?? "")) ?? available[0];
  const watch = available.find(p => /watch/i.test(p.category?.name ?? "") && p.id !== lead?.id);
  const power = available.find(p => /power bank/i.test(p.category?.name ?? "") && p.id !== lead?.id);
  const side = [watch, power].filter((p): p is EcommerceProduct => Boolean(p));
  return <section className="market-entry" aria-label="Discover Hawkeri"><Container>
    <div className={`market-entry-grid ${!side.length ? "market-entry-single" : ""}`}>
      {categories.length > 0 && <nav className="market-departments" aria-label="Shop departments">
        <h2><FiGrid aria-hidden /> Shop by category</h2>
        {categories.map(c => <Link prefetch={false} key={c.slug} href={ROUTE_BUILDERS.categoryDetail(c.slug)}>{c.name}<FiChevronRight aria-hidden /></Link>)}
        <Link prefetch={false} className="market-departments-all" href={ROUTES.CATEGORY}>All categories <FiArrowRight aria-hidden /></Link>
      </nav>}
      <div className="market-campaign">
        <div className="market-campaign-copy"><p className="market-kicker">Discover Hawkeri</p><h1>Your everyday,<br />upgraded.</h1><p>Good finds for your home,<br className="market-desktop-break" /> your style and everything in between.</p><Link prefetch={false} className="market-button" href={ROUTES.PRODUCT}>Start shopping <span><FiArrowRight aria-hidden /></span></Link></div>
        {lead && <Link prefetch={false} className="market-campaign-product" href={ROUTE_BUILDERS.productDetail(lead.slug)} aria-label={`Shop ${lead.product_name}`}>
          <div className="market-campaign-image"><ProductPhoto src={resolveImageUrl(lead.images[0]?.url)} alt={lead.product_name} priority sizes="(max-width: 760px) 45vw, (max-width: 1199px) 40vw, 28vw" className="object-contain" /></div>
          <div className="market-campaign-caption"><span>{lead.product_name}</span><strong>৳{Number(lead.promotion?.deal_price ?? lead.price).toLocaleString("en-BD")}</strong><FiArrowRight aria-hidden /></div>
        </Link>}
        <span className="market-campaign-index">Everyday discoveries / 01</span>
      </div>
      {side.length > 0 && <div className="market-side-campaigns">{side.map((p, i) => <Link prefetch={false} key={p.id} href={ROUTE_BUILDERS.productDetail(p.slug)} className={`market-mini-campaign market-mini-${i}`}>
        <div><span className="market-kicker">{i === 0 ? "The watch edit" : "On the go"}</span><h2>{i === 0 ? <>Time for<br />something new.</> : <>Power through<br />your day.</>}</h2><span className="market-mini-link">Discover more <FiArrowRight aria-hidden /></span></div>
        <div className="market-mini-image"><ProductPhoto src={resolveImageUrl(p.images[0]?.url)} alt={p.product_name} sizes="(max-width: 760px) 35vw, 18vw" className="object-contain" /></div>
      </Link>)}</div>}
    </div>
  </Container></section>;
}
