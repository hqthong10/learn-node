We have decided the following for ShopAI.

Product:
ShopAI is an AI-powered sales assistant for small online shops in Vietnam.

Target customer:
Small online shop owners.

Who pays:
The shop owner.

Who interacts with the AI:
The shop's customers.

V1 channel:
A website chat widget.

V1 AI capabilities:
1. Answer product questions.
2. Recommend suitable products.
3. Check product price and stock.
4. Help customers create an order.

The AI must not:
- Invent product information.
- Invent prices.
- Invent stock levels.
- Promise unsupported delivery times.
- Apply discounts without explicit shop rules.
- Perform refunds automatically.

Out of scope for V1:
- Zalo
- Facebook Messenger
- Instagram
- Shopee
- TikTok Shop
- Mobile apps
- Voice AI
- Automatic promotions
- Automatic refunds
- Kafka
- Kubernetes
- Microservices

Technology stack:
- Next.js
- NestJS
- TypeScript
- MySQL
- Redis
- Docker
- shadcn/ui
- An LLM API

Architecture:
We will design the database for multi-tenancy from the beginning using shop_id,
but the initial pilot will focus on one shop.

Important:
- Do not choose an ORM yet.
- Do not write application code.
- Do not create Next.js or NestJS yet.
- Do not make architectural decisions that are not necessary yet.

Please:
1. Review these decisions.
2. Identify contradictions or missing decisions.
3. Suggest improvements if necessary.
4. Create docs/PRODUCT_BRIEF.md based on the approved direction.
5. Do not create any application code.