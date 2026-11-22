import Link from "next/link";
import { ROUTES } from "@/config/routes";
export default function TopBar() {
  return <div className="shop-topbar"><div className="shop-topbar-inner"><span>Shop local. Pay on delivery.</span><div><Link href={ROUTES.ORDER_TRACKING}>Track an order</Link><Link href={ROUTES.CONTACT}>Help &amp; contact</Link></div></div></div>;
}
