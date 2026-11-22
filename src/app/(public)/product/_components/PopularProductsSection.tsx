import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import Container from "@/components/shared/Container";
import PopularProductCard from "./PopularProductCard";
import { ROUTES } from "@/config/routes";
import type { EcommerceProduct } from "@/types";

type Props = { products: EcommerceProduct[]; title?: string; description?: string; id?: string };
export default function PopularProductsSection({ products, title = "Fresh finds", description = "New additions worth a closer look.", id = "fresh-finds" }: Props) {
  if (!products.length) return null;
  return <section id={id} className="market-section market-products"><Container>
    <div className="market-section-head"><div><h2>{title}</h2><p>{description}</p></div><Link prefetch={false} href={ROUTES.PRODUCT}>Shop all products <FiArrowRight aria-hidden /></Link></div>
    <div className="shop-product-grid market-product-grid">{products.map(product => <PopularProductCard key={product.id} product={product} />)}</div>
  </Container></section>;
}
