"use client";

import Link from "next/link";
import {
  FaChevronRight,
} from "react-icons/fa";
import {
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlinePhone,
} from "react-icons/hi";
import Logo from "./Logo";
import { ROUTES } from "@/config/routes";

const companyLinks = [
  { label: "About Us", href: ROUTES.ABOUT },
  { label: "Contact Us", href: ROUTES.CONTACT },
  { label: "Shopping Guides", href: "/shopping-guides-bangladesh" },
  { label: "Privacy Policy", href: ROUTES.PRIVACY_POLICY },
  { label: "Terms & Conditions", href: ROUTES.TERMS },
  { label: "Return Policies", href: ROUTES.RETURN_POLICIES },
];

const accountLinks = [
  { label: "My Account", href: ROUTES.MY_ACCOUNT },
  { label: "Order Tracking", href: ROUTES.ORDER_TRACKING },
  { label: "Wishlist", href: ROUTES.WISHLIST },
  { label: "Affiliate Program", href: ROUTES.AFFILIATE },
  { label: "FAQs", href: ROUTES.FAQS },
];

export default function Footer() {
  return (
    <>
      <section className="shop-footer-help"><div><h2>Need help choosing?</h2><p>Ask about a product or get help with an order.</p></div><Link prefetch={false} href={ROUTES.CONTACT}>Contact Hawkeri ↗</Link></section>
      {/* ── Footer ── */}
      <footer className="shop-footer bg-(--color-primary-900) pt-10 pb-8 sm:pt-14">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">

          {/* Main grid */}
          <div className="grid grid-cols-12 gap-8 border-b border-white/10 pb-10">

            {/* Brand column */}
            <div className="col-span-12 flex flex-col gap-5 lg:col-span-5">
              <div className="inline-flex w-fit items-center rounded-2xl bg-white px-4 pb-4 pt-2 shadow-[0_16px_34px_rgba(0,0,0,0.16)]">
                <Logo
                  width={120}
                  height={60}
                  variant="default"
                  src="/images/HawkeriFooter.png"
                  className="translate-x-1"
                />
              </div>
              <p className="max-w-[380px] text-sm leading-7 text-(--color-secondary-200)">
                Discover products from local sellers and explore online shopping
                and modern ecommerce experiences across Bangladesh.
              </p>
              <div className="grid max-w-[430px] grid-cols-2 gap-3">
                <Link prefetch={false}
                  href={ROUTES.STORE}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:border-(--color-primary) hover:bg-white/10"
                >
                  Browse Stores
                </Link>
                <Link prefetch={false}
                  href={ROUTES.BRAND}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:border-(--color-primary) hover:bg-white/10"
                >
                  Browse Brands
                </Link>
              </div>
            </div>

            {/* Links columns */}
            <div className="col-span-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:col-span-4 lg:col-span-2">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">Company</h3>
              <ul className="flex flex-col gap-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link prefetch={false}
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-(--color-secondary-200) transition hover:text-white"
                    >
                      <FaChevronRight size={9} className="shrink-0 text-white/30 transition group-hover:text-(--color-primary)" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:col-span-4 lg:col-span-2">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">Customer</h3>
              <ul className="flex flex-col gap-3">
                {accountLinks.map((link) => (
                  <li key={link.label}>
                    <Link prefetch={false}
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-(--color-secondary-200) transition hover:text-white"
                    >
                      <FaChevronRight size={9} className="shrink-0 text-white/30 transition group-hover:text-(--color-primary)" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact column */}
            <div className="col-span-12 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:col-span-6 lg:col-span-3">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">Contact</h3>
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <HiOutlineLocationMarker size={16} className="text-(--color-primary)" />
                  </span>
                  <span className="text-sm leading-6 text-(--color-secondary-200)">
                    House: 34, Road: 3, Block: B, Aftabnagar, Badda, Dhaka, Bangladesh
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <HiOutlinePhone size={16} className="text-(--color-primary)" />
                  </span>
                  <a href="tel:+8801577303608" className="text-sm text-(--color-secondary-200) transition hover:text-(--color-primary)">
                    +880 1577303608
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <HiOutlineMail size={16} className="text-(--color-primary)" />
                  </span>
                  <a href="mailto:support@andgatetech.net" className="break-all text-sm text-(--color-secondary-200) transition hover:text-(--color-primary)">
                    support@andgatetech.net
                  </a>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-b border-white/10 py-6 text-xs leading-6 text-(--color-secondary-200)">Delivery availability and charges depend on the store and destination. Review the total at checkout.</div>
          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-3 pt-6 sm:flex-row">
            <p className="text-xs text-white/40">
              © {new Date().getFullYear()} Hawkeri. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link prefetch={false} href={ROUTES.PRIVACY_POLICY} className="text-xs text-white/40 transition hover:text-white/70">Privacy</Link>
              <Link prefetch={false} href={ROUTES.TERMS} className="text-xs text-white/40 transition hover:text-white/70">Terms</Link>
              <Link prefetch={false} href={ROUTES.RETURN_POLICIES} className="text-xs text-white/40 transition hover:text-white/70">Returns</Link>
            </div>
          </div>

        </div>
      </footer>

    </>
  );
}
