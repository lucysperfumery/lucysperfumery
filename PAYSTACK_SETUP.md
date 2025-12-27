# Paystack Payment Integration Setup

This project uses Paystack for processing payments. Follow these steps to configure Paystack for your Lucy's Perfumery e-commerce site.

## Prerequisites

- A Paystack account (sign up at [https://paystack.com](https://paystack.com))
- Access to your Paystack Dashboard

## Setup Instructions

### 1. Get Your Paystack API Keys

1. Log in to your Paystack Dashboard at [https://dashboard.paystack.com](https://dashboard.paystack.com)
2. Navigate to **Settings** → **API Keys & Webhooks**
3. You'll see two types of keys:
   - **Test Keys** - For development and testing (starts with `pk_test_`)
   - **Live Keys** - For production (starts with `pk_live_`)

### 2. Configure Environment Variables

1. Open the `.env` file in the project root
2. Replace the placeholder Paystack public key with your actual key:

```env
# For testing/development
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_actual_test_key_here

# For production (uncomment and use your live key)
# VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_live_key_here
```

### 3. Test the Integration

#### Using Test Mode

Paystack provides test cards for testing payments in test mode:

**Successful Payment:**
- Card Number: `5531 8866 5214 2950`
- CVV: `123`
- Expiry: Any future date
- PIN: `3310`
- OTP: `123456`

**Failed Payment:**
- Card Number: `5060 6666 6666 6666`
- CVV: `123`
- Expiry: Any future date

More test cards: [https://paystack.com/docs/payments/test-payments](https://paystack.com/docs/payments/test-payments)

#### Testing Workflow

1. Add products to cart
2. Proceed to checkout
3. Fill in customer details (email is required for Paystack)
4. Click "Proceed to Payment"
5. Paystack popup will appear
6. Use test card details above
7. Complete the payment flow
8. You'll be redirected to order confirmation with payment reference

### 4. Go Live

When ready for production:

1. Get your **Live Public Key** from Paystack Dashboard
2. Update `.env` with live key:
   ```env
   VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_actual_live_key_here
   ```
3. Restart your development server
4. Test with real cards (small amounts first!)

## Payment Flow

1. Customer fills checkout form
2. Form validates (email is required for Paystack)
3. Payment amount calculated and converted to kobo (pesewas)
4. Paystack popup opens with payment options:
   - Card payment
   - Bank transfer
   - USSD
   - Mobile money
   - QR Code
5. Customer completes payment
6. On success:
   - Order saved with payment reference
   - Cart cleared
   - Success toast shown
   - Redirect to order confirmation
7. On failure/cancel:
   - Error message shown
   - Form data retained
   - Customer can try again

## Payment Details Stored

Each successful order includes:
- `orderNumber`: Unique order identifier
- `paymentReference`: Paystack transaction reference (for verification)
- `paymentStatus`: "paid"
- All customer and order details

## Currency

The integration is configured for **GHS (Ghana Cedis)**.

To change currency, edit `/src/lib/paystack.ts`:

```typescript
currency: "GHS", // Change to NGN, USD, etc.
```

Supported currencies: GHS, NGN, USD, ZAR, and more. See [Paystack docs](https://paystack.com/docs/payments/multi-currency-payments).

## Important Notes

### Security

- ✅ **Public key** is safe to expose in frontend code
- ❌ **Secret key** should NEVER be in frontend code or version control
- ❌ Do not commit real keys to Git (use placeholders in `.env.example`)

### Testing

- Always test thoroughly in test mode before going live
- Verify all payment scenarios (success, failure, cancel)
- Test on mobile devices as well as desktop

### Production Checklist

- [ ] Replace test key with live key
- [ ] Test with real cards (small amounts)
- [ ] Set up webhooks for payment verification (optional but recommended)
- [ ] Enable 3D Secure for card payments
- [ ] Configure business details in Paystack Dashboard
- [ ] Add support email/phone in Paystack settings

## Webhook Setup (Optional but Recommended)

For production, set up webhooks to verify payments server-side:

1. In Paystack Dashboard → Settings → Webhooks
2. Add your webhook URL (requires backend server)
3. Listen for `charge.success` events
4. Verify payment status before fulfilling orders

## Support

- Paystack Documentation: [https://paystack.com/docs](https://paystack.com/docs)
- Integration Guide: [https://paystack.com/docs/payments/accept-payments](https://paystack.com/docs/payments/accept-payments)
- Support: [support@paystack.com](mailto:support@paystack.com)

## Troubleshooting

### "Invalid key" error
- Check that you've copied the entire key without spaces
- Ensure you're using the public key (starts with `pk_`)
- Verify the key matches your environment (test vs live)

### Payment popup doesn't appear
- Check browser console for errors
- Ensure @paystack/inline-js is installed
- Verify email field is filled (required for Paystack)

### Payment succeeds but order not saved
- Check browser console for errors
- Verify localStorage is enabled
- Check that cart has items before checkout

---

**Need help?** Contact Paystack support or check their comprehensive documentation.
