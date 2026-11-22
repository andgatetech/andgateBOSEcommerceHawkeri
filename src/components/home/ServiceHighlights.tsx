import Link from "next/link";
import { FiPackage, FiHeadphones, FiCreditCard } from "react-icons/fi";
import Container from "@/components/shared/Container";
import { ROUTES } from "@/config/routes";
export default function ServiceHighlights({ className = "" }: { className?: string }) {
  return <section className={`shop-service-notes ${className}`}><Container><div className="shop-service-grid"><div><FiCreditCard aria-hidden /><h3>Cash on delivery</h3><p>Review your order and delivery details before confirming.</p></div><div><FiPackage aria-hidden /><h3>Know the details</h3><p>Check the seller and <Link prefetch={false} href={ROUTES.RETURN_POLICIES}>return policy</Link> before you buy.</p></div><div><FiHeadphones aria-hidden /><h3>Need a hand?</h3><p><Link prefetch={false} href={ROUTES.CONTACT}>Contact our team</Link> with a product or order question.</p></div></div></Container></section>;
}
