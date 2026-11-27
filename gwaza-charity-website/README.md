# GWAZA Charity Foundation website

A responsive charity foundation homepage built with plain HTML, CSS and vanilla JavaScript.

## Run locally
Open `index.html` in a modern browser. No build tools or framework are required.

## Files
- `index.html` — page structure and content
- `styles.css` — responsive styling
- `script.js` — mobile navigation, hero slider, and demo contact-form feedback
- `assets/` — supplied GWAZA logo and photos cropped from the supplied homepage reference

## Before publishing
1. Replace the social-media `#` links with GWAZA's real profiles.
2. Connect the contact form to an email service or backend; it currently shows a front-end demo confirmation only.
3. Configure the donation form's `data-checkout-endpoint` in `donate.html` and implement that endpoint on a trusted server before accepting online donations. The form sends JSON containing `amount`, `currency` (`UGX`), `name`, `email`, `method` (`mtn`, `airtel`, or `card`) and `phone` (for mobile money). Return either `{ "checkoutUrl": "https://..." }` for a hosted checkout, or `{ "status": "pending", "message": "..." }` for a mobile-money payment prompt. Do not mark a donation paid from the browser response; verify the provider callback/webhook server-side.
4. Choose and activate providers with GWAZA's own merchant accounts and complete their business verification:
   - **MTN Mobile Money:** [MTN MoMo Developer Portal](https://momodeveloper.mtn.com/) — use the Collections API to request a payment. Keep API keys on the server and verify the final transaction status using the provider's callback/status flow.
   - **Airtel Money:** [Airtel Africa Developer Portal](https://developers.airtel.africa/) — register an application and use its collection/payment APIs for the relevant country and currency. Keep credentials server-side and confirm completion using the provider's callback/status flow.
   - **Bank cards:** [Flutterwave Developer Portal](https://developer.flutterwave.com/) — use a server-created hosted checkout so card details are entered on the provider's page, not on GWAZA's website. Confirm Uganda availability, supported currencies and settlement terms for the merchant account.
5. Before launch, configure HTTPS, validate allowed amounts and methods on the server, use unique donation references/idempotency, verify webhook signatures and amount/currency/reference, and store only the minimum donor information required. Never request or store mobile-money PINs/OTPs or card security codes.
6. Review all organization details, program descriptions, and contact information. The online form is not live until its server endpoint and provider merchant accounts are configured and tested in their sandbox environments.
