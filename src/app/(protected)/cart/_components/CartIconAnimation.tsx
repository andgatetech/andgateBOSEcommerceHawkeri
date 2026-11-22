"use client";
import { FiShoppingBag } from "react-icons/fi";
type CartIconAnimationProps = { count?: number; variant?: "desktop" | "mobile" };
/** Keep the cart visible before hydration; the count remains supplied by cart state. */
export default function CartIconAnimation({ count = 0, variant = "desktop" }: CartIconAnimationProps) {
  return <span className={`shop-cart-icon shop-cart-icon--${variant}`} aria-hidden="true"><FiShoppingBag /><span>{count > 99 ? "99+" : count}</span></span>;
}
