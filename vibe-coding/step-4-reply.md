Write PRODUCT_BRIEF.md
I updated docs/PRODUCT_BRIEF.md to v0.3 with all eight decisions. It's the only file I changed; no code and no architecture documents.

I added four small things that follow from your decisions but that you didn't state. Please check them:

Order status updates by the shop (§5.4). Something has to move orders to SHIPPED and DELIVERED, so shop users need this.
"Never promise stock is reserved" as an AI rule (§9, §11), because pending orders don't hold stock.
"Never show order info to anyone but that order's customer" as an AI rule (§11).
"Owner" became "shop user" in places where STAFF can also act, such as confirming orders and taking over chats.
Resolved product decisions
Area	Decision
Market	Small online shops in Vietnam with their own website
Payer and users	Shop owner pays; the shop's customers chat with the AI
Channel	Website chat widget only; no Zalo, Messenger, Instagram, Shopee or TikTok Shop
Source of truth	ShopAI holds the catalog and stock: products, variants, prices, stock, descriptions
AI capabilities	Answer questions, recommend products, check price and stock, calculate shipping and totals, create order requests, report order status, hand off to a human
Language	Vietnamese first, with or without accent marks, and informal wording
Order request	Guest checkout; name, phone and address required, note optional
Payment	Cash on delivery only
Shipping	Shop-set rules: flat fee by area, free above an amount; the AI calculates only when a rule matches and never guesses
Policies	Shipping, delivery, returns and contact, as structured fields plus free text; no policy engine
Order lifecycle	PENDING, CONFIRMED, SHIPPED, DELIVERED, REJECTED, CANCELLED; stock comes back when a confirmed order is cancelled
Order status	Customers can ask, but only about their own orders
Inventory	No stock held for pending orders; stock is checked and deducted at confirmation in a transaction that prevents overselling; confirmation fails if stock is short
Handoff	When the AI can't answer safely or the customer asks for a human; shop users can take over
Notifications	Dashboard only; with nobody available, the AI says the request is recorded and promises no quick reply
Shop accounts	Several users per shop; OWNER manages settings and staff, STAFF handles daily work
AI rules	Never invents products, prices, stock, shipping or discounts; never promises unsupported delivery times; no refunds; never shows another shop's data
Tech	Next.js, NestJS, TypeScript, MySQL, Docker, shadcn/ui, an LLM API; MySQL search; shop_id on data; Redis only when needed
Deferred on purpose	ORM, LLM provider, vector search
Remaining decisions needed before Phase 1
How a guest proves an order is theirs. Guests have no account, so the AI needs a way to check before sharing order status. Options:

Allow it only within the same chat session.
Ask for the order code plus phone number (my suggestion).
Something else.
A phone number alone isn't safe enough, because other people often know it.

Which price applies when the shop confirms. If a price or shipping rule changes between PENDING and CONFIRMED, is it the price when the customer ordered, or the current one? This decides the total the AI quotes and what the customer pays on delivery.

Who can cancel, and when. "According to the shop's policy" isn't enough without a policy engine, so the allowed moves need fixing:

Can only shop users cancel, or can a customer cancel through the AI?
Can a customer withdraw a PENDING request?
Can a SHIPPED order be cancelled?
Everything else can wait until Phase 1 or later; the brief lists it in §14. That covers shipping-area detail and address format, whether the AI takes back over after a handoff, data retention, abuse and fake-order protection, metrics, the pilot shop and pricing. On address format: Vietnam's provinces and districts were reorganised in 2025, so area-based shipping rules need to match the current units.