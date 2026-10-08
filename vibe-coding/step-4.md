We have reviewed the remaining V1 product decisions.

Please update docs/PRODUCT_BRIEF.md to include the following decisions.

1. Order request

Customers can order as guests.

Required:
- name
- phone
- shipping address

Optional:
- note

No customer account is required to place an order.

2. Shipping

Shipping rules are configured by the shop.

V1 supports simple rules such as:
- flat fee by area
- free shipping above an order amount

The AI may calculate shipping and order totals only when a matching shop rule exists.

If no applicable rule exists, the AI must not guess.

3. Shop policies

V1 supports:
- shipping policy
- delivery policy
- return policy
- contact information

Use a simple combination of structured fields and free text where appropriate.
Do not build a complex policy engine.

4. Order lifecycle

Initial statuses:

PENDING
CONFIRMED
SHIPPED
DELIVERED

Additional statuses:
REJECTED
CANCELLED

A confirmed order may be cancelled according to the shop's policy.

If stock was deducted and the order is cancelled, stock should be restored.

Customers may ask the AI about their order status, but the system must ensure that a customer can only access their own order information.

5. Inventory

Creating a PENDING order does not reserve stock.

Stock is checked and deducted when the shop owner confirms the order.

The confirmation must use a database transaction and protect against overselling.

If stock is insufficient during confirmation, the order cannot be confirmed.

6. Owner notifications

V1 uses dashboard notifications for:
- new order requests
- conversations requiring human attention

Do not implement email, SMS, Zalo, push notifications or other external notifications in V1.

If the owner is unavailable, the AI should tell the customer that the request has been recorded and the shop will follow up. It must not promise an immediate response.

7. Owner accounts

Support multiple users per shop in the data model.

Initial roles:
- OWNER
- STAFF

OWNER can manage shop settings and staff.
STAFF can manage day-to-day products, orders and conversations.

8. Scope

Do not add:
- online payments
- external messaging integrations
- complex inventory reservation
- complex policy engine
- advanced notification systems

After updating the brief:

1. List all product decisions that are now resolved.
2. List only the remaining decisions that are necessary before Phase 1.
3. Do not write application code.
4. Do not create architecture documents.