import Link from "next/link";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import { resolveStoreLogoUrl } from "@/lib/storeLogo";
import Container from "@/components/shared/Container";
import ProductPhoto from "@/components/shared/ProductPhoto";
import type { Store } from "@/types";
import { ROUTES, ROUTE_BUILDERS } from "@/config/routes";

export default function FeaturedStores({ stores }: { stores: Store[] }) {
  if (!stores.length) return null;
  return <section className="market-section market-sellers"><Container>
    <div className="market-section-head"><div><h2>Meet the stores</h2><p>Discover the people behind your next find.</p></div><Link prefetch={false} href={ROUTES.STORE}>Explore stores <FiArrowRight aria-hidden /></Link></div>
    <div className="market-store-grid">{stores.slice(0, 4).map(store => <Link prefetch={false} key={store.id} className="market-store" href={ROUTE_BUILDERS.storeDetail(store.slug)}><div className="market-store-logo">{store.logo_path ? <ProductPhoto src={resolveStoreLogoUrl(store.logo_path)} alt={store.store_name} sizes="64px" className="object-contain" /> : <span aria-hidden>{store.store_name.slice(0, 1)}</span>}</div><div><h3>{store.store_name}</h3><p><FiMapPin aria-hidden />{store.store_location || "Shop online"}</p><span>Visit store <FiArrowRight aria-hidden /></span></div></Link>)}</div>
    <div className="market-sell-note"><div><strong>Have a store of your own?</strong><span>Bring your products to Hawkeri.</span></div><Link prefetch={false} href={ROUTES.BECOME_PARTNER}>Sell on Hawkeri <FiArrowRight aria-hidden /></Link></div>
  </Container></section>;
}
