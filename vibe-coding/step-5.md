We have reviewed the remaining product decisions.

Please update docs/PRODUCT_BRIEF.md to v0.4 with these decisions.

1. Guest order verification

Customers do not need an account.

To access order information through the AI, the customer must provide:
- order code
- phone number used for the order

Phone number alone is not sufficient.

The system must verify that both values match the same order before exposing order information.

2. Price and shipping snapshot

When the customer confirms an order request, ShopAI snapshots:
- product unit price
- item quantity
- shipping fee
- subtotal
- total

The order keeps these values even if the shop later changes the product price or shipping rules.

When a shop user confirms a PENDING order:
- stock must be checked
- stock must be deducted transactionally
- the order's snapshot prices must not be silently changed

3. Cancellation rules

V1 state transitions:

PENDING -> CONFIRMED
PENDING -> REJECTED
PENDING -> CANCELLED

CONFIRMED -> SHIPPED
CONFIRMED -> CANCELLED

SHIPPED -> DELIVERED

A customer may withdraw/cancel a PENDING order request through the AI.

Customers cannot directly cancel CONFIRMED or SHIPPED orders through the AI in V1.

Shop users may cancel PENDING and CONFIRMED orders.

SHIPPED orders cannot be cancelled in V1.

When a CONFIRMED order is cancelled, its deducted stock is restored transactionally.

Please also review the three additional decisions already added to v0.3:

- Shop users update SHIPPED and DELIVERED statuses.
- The AI must never claim that a PENDING order has reserved stock.
- The AI must never expose order information to anyone who has not passed order verification.

If these are consistent, keep them.

Do not write application code.
Do not create architecture documents.

At the end:
1. List the final resolved product decisions.
2. List only decisions that can safely wait until Phase 1 or later.
3. Confirm whether the product requirements are now sufficient to start Phase 1.