import { FiCreditCard, FiShoppingBag, FiMapPin, FiHeadphones } from "react-icons/fi";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { ROUTES } from "@/config/routes";
export default function HomeBenefits() {
  return <div className="market-benefits"><Container><div className="market-benefits-grid">
    <div><FiCreditCard aria-hidden /><span><strong>Pay when it arrives</strong><small>Cash on delivery available</small></span></div>
    <div><FiShoppingBag aria-hidden /><span><strong>Shop without signing up</strong><small>Easy guest checkout</small></span></div>
    <Link prefetch={false} href={ROUTES.ORDER_TRACKING}><FiMapPin aria-hidden /><span><strong>Keep track of your order</strong><small>Follow your order status</small></span></Link>
    <Link prefetch={false} href={ROUTES.CONTACT}><FiHeadphones aria-hidden /><span><strong>A little help, when needed</strong><small>Talk to the Hawkeri team</small></span></Link>
  </div></Container></div>;
}
