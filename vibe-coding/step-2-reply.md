I created docs/PRODUCT_BRIEF.md. It's the only file I added or changed; there's no app code, no project setup and no ORM choice. Where I filled a gap with a suggestion, the brief marks it (proposed — needs approval), and the unresolved items are listed in §10.

Written for: you and future AI coding sessions, as the reference for scope.

Review of the decisions
Most of the direction holds up. The V1 scope is tight, the AI's "must not" rules are clear, and planning for multiple shops with shop_id from the start is the right call. Leaving out Kafka, Kubernetes and microservices fits a single-shop pilot.

Contradictions
Discounts. "Apply discounts without explicit shop rules" implies the AI applies discounts when rules exist. But automatic promotions are out of scope. Suggestion: in V1 the AI never applies discounts. (Q6)
"Help customers create an order" isn't defined. Does the order live in ShopAI or in the shop's own system? Is it confirmed straight away, and is there payment? Without an answer, the AI could promise something the shop hasn't agreed to. Suggestion: the AI creates an order request, the owner confirms it, payment is cash on delivery, and there's no online payment in V1 (§5.4).
Target customer vs. channel. Many small Vietnamese shops sell only through Facebook or Zalo and have no website. A website-only widget leaves them out. That's fine for V1, but it should be a deliberate choice, and the pilot shop needs a website. (Q1)
"Never invent stock" needs a source of truth that's kept current. If the owner types the catalog into ShopAI by hand while stock really changes elsewhere, the AI will give wrong numbers while following its rules. (Q2)
Missing decisions
The shop owner's side isn't listed, but V1 can't work without it. The owner needs to manage the catalog and policies, see order requests and conversations, and get the widget embed code. I added these in §5.3.
Delivery and shipping policy data. "Unsupported delivery times" only has meaning if the shop has written down what it does support.
How the owner hears about a new order request, and whether a human can take over a chat (Q4, Q5).
Which personal data is collected and how long it's kept, under Vietnam's Decree 13/2023 (Q7).
Language handling, including Vietnamese typed without accent marks (Q8).
Abuse protection for the public widget. Every message costs LLM money (Q11).
Success metrics. I proposed some in §9.
Other suggestions
Redis: keep it in the stack, but don't add it to V1 until there's a concrete need such as rate limiting or caching (Q10). That follows the "no dependency without a clear reason" rule.
Preventing data leaks between shops: shop_id in the database isn't enough on its own. The AI's lookups for products, orders and policies also need to be limited to one shop. I listed this as an AI rule and a risk, not as a design.
Decisions still open on purpose: ORM, LLM provider, how the AI searches products, hosting and owner login (§8). How the AI searches products should wait until we know the pilot shop's catalog size (Q9).
Recommended next step
Answer Q1–Q3, Q6 and Q9 first, because they decide what V1 actually is. After that I can write the user stories and conversation flows for the four AI capabilities, plus a first set of test questions with expected answers.

docs/ is still uncommitted, and the engineering-instruction.md deletion is still pending from earlier. Tell me if you'd like me to commit them.