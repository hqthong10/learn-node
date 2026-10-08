We are starting Phase 1: Requirements and AI Behavior Specification.

Read:
- docs/PRODUCT_BRIEF.md
- docs/AI_RULES.md

Do not write application code.

Create:
docs/AI_BEHAVIOR.md

The goal is to define exactly how the ShopAI assistant should behave so that the behavior can later be implemented and tested.

Use the following structure:

# 1. Principles

Define the core behavior rules of the AI.

# 2. Supported intents

Define the initial intents, including at least:

- PRODUCT_QUESTION
- PRODUCT_SEARCH
- PRODUCT_RECOMMENDATION
- PRICE_CHECK
- STOCK_CHECK
- SHIPPING_QUESTION
- DELIVERY_QUESTION
- RETURN_POLICY_QUESTION
- ORDER_CREATE
- ORDER_STATUS
- ORDER_CANCEL
- HUMAN_HANDOFF
- UNKNOWN

For each intent define:
- purpose
- required information
- allowed data sources
- allowed actions
- response requirements
- when to hand off

# 3. Conversation flows

Define detailed flows for:

1. Product question
2. Product search
3. Product recommendation
4. Price and stock
5. Shipping calculation
6. Order creation
7. Order status lookup
8. Pending order withdrawal
9. Human handoff
10. Unsupported/unknown questions

# 4. Order creation flow

Define the exact sequence:

customer intent
→ identify product/variant
→ check stock
→ collect customer information
→ determine shipping zone
→ calculate subtotal
→ calculate shipping
→ calculate total
→ show order summary
→ customer confirmation
→ create PENDING order
→ return order code

Important:
- No stock is reserved at PENDING.
- Prices and shipping are snapshotted when the customer confirms the order.
- If there is no matching shipping rule, do not create the order and hand off.
- The AI must never invent missing information.

# 5. Order verification

Define:
- when verification is required
- order code + phone verification
- same-conversation behavior
- what information may be exposed after verification
- failed verification behavior

# 6. Human handoff

Define:
- when handoff is mandatory
- when customer can request handoff
- what the AI tells the customer
- what happens when a shop user takes over
- what happens while a conversation is under human control
- how control returns to AI

# 7. Safety rules

Translate the product brief's AI "never" rules into explicit behavioral requirements.

# 8. Conversation examples

Create at least 15 realistic Vietnamese conversations.

Include:
- Vietnamese with accents
- Vietnamese without accents
- informal wording
- successful cases
- missing information
- ambiguous product names
- unavailable products
- insufficient stock
- missing shipping rules
- human handoff
- invalid order verification
- order status
- pending cancellation

For every example include:
- customer message
- expected AI behavior
- relevant intent
- expected tool/data lookup
- expected response
- whether handoff is required

# 9. Evaluation test cases

Create a concise table of test cases with:
- ID
- input
- expected behavior
- expected result
- pass criteria

Include both happy paths and failure/safety cases.

# 10. Open questions

Only include questions that genuinely cannot be resolved from PRODUCT_BRIEF.md.

Important constraints:

- Vietnamese-first.
- No RAG/vector database assumptions.
- Product and inventory data come from ShopAI/MySQL.
- Do not invent products, prices, stock, shipping, delivery times or discounts.
- Do not expose another customer's order information.
- Do not create an order when shipping cannot be calculated.
- Do not reserve stock for PENDING orders.
- Do not cancel CONFIRMED or SHIPPED orders through the AI.
- Do not introduce technical architecture decisions.
- Do not choose an LLM provider.
- Do not write application code.

Before writing the document, briefly inspect the existing files and make sure the behavior is consistent with PRODUCT_BRIEF.md v0.4.