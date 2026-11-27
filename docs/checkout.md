# Checkout integration

Checkout uses a server-verified quote for item prices and per-seller delivery charges. Customers select District → Zone → Area; unsupported delivery areas are disabled. Location errors retain entered details and offer a retry.

`POST /checkout/quote` validates `items` and either `shipping_address` (including canonical `city_id`, `zone_id`, `area_id`) or an owned `address_id`. Its response supplies `quote_id`, expiry, item prices and totals. Orders require that quote and a UUID `idempotency_key`. Exact manual retries retain the request after ambiguous network failures; POST mutations are never automatically retried. A changed or expired quote requires verification again.

Guest checkout does not require or create a login account. Existing persisted carts are repaired with seller IDs and current prices from the quote. Public order tracking shows progress; sign-in is required to view account-linked personal details.

Before releasing, run TypeScript, ESLint and the production build, then test mobile and desktop checkout with intercepted order requests and an isolated backend test database. Keep API credentials and private environments outside Git.
