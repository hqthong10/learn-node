We have made the following decisions for V1.

Q1 — Target shops:
ShopAI V1 targets small online shops in Vietnam that have their own website.

The first customer interaction channel is a website chat widget.

We will NOT integrate Zalo, Facebook Messenger, Instagram, Shopee or TikTok Shop in V1.

Q2 — Product and inventory source of truth:
ShopAI will be the source of truth for the pilot shop's product catalog and inventory.

The shop owner manages:
- products
- variants
- prices
- stock
- product descriptions

The AI must only use current ShopAI data when answering product, price and stock questions.

Q3 — Orders:
V1 uses ShopAI's own order system.

The AI can create an order request after collecting the required information.

The shop owner confirms the order.

V1 payment method is Cash on Delivery (COD).

No online payment in V1.

Inventory must be protected against overselling when orders are confirmed.

Q6 — Discounts:
The AI must NOT apply or invent discounts in V1.

Q9 — Product search:
Start with MySQL-based search.

Do not introduce vector databases, embeddings or RAG infrastructure yet.

We will revisit search architecture when we have a real pilot catalog and understand its size and complexity.

Language:
V1 is Vietnamese-first.

The AI should understand Vietnamese with and without accents and common informal wording.

Human handoff:
The AI must be able to hand a conversation to the shop owner when it cannot safely answer or when the customer requests human support.

Additional V1 scope:

Shop owner needs:
- manage products
- manage inventory
- manage basic shop policies
- view conversations
- see order requests
- confirm/reject order requests
- take over conversations
- obtain the website widget integration code

AI safety:
- never invent product information
- never invent price
- never invent stock
- never invent shipping policy
- never invent discounts
- never promise unsupported delivery times
- never perform refunds automatically
- never expose data belonging to another shop

Technical direction:
- Next.js
- NestJS
- TypeScript
- MySQL
- Docker
- shadcn/ui
- LLM API

Redis may remain available but should only be introduced when there is a concrete need.

Do not choose the ORM yet.
Do not choose the LLM provider yet.
Do not choose vector search yet.
Do not write application code.

Now update docs/PRODUCT_BRIEF.md.

Then identify only the remaining product decisions that must be made before Phase 1.

Do not create additional architecture documents yet.