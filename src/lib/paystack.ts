import PaystackPop from "@paystack/inline-js";

// Paystack configuration
export const PAYSTACK_PUBLIC_KEY =
  "pk_test_9f84bcbcafb055b3631126963345a60c95e53c73";

export interface PaystackPaymentData {
  email: string;
  amount: number; // Amount in kobo (GHS 100 = 10000 kobo)
  firstName: string;
  lastName: string;
  phone?: string;
  metadata?: {
    [key: string]: string | number;
  };
}

export interface PaystackResponse {
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  message: string;
  trxref: string;
}

/**
 * Initialize Paystack payment popup
 * @param data Payment data including email, amount, and customer details
 * @param onSuccess Callback function when payment is successful
 * @param onClose Callback function when popup is closed
 */
export const initializePayment = (
  data: PaystackPaymentData,
  onSuccess: (response: PaystackResponse) => void,
  onClose: () => void
) => {
  const paystack = new PaystackPop();

  // Split name into first and last name
  const nameParts = data.firstName.split(" ");
  const firstName = nameParts[0] || data.firstName;
  const lastName = nameParts.slice(1).join(" ") || data.lastName || "";

  paystack.newTransaction({
    key: PAYSTACK_PUBLIC_KEY,
    email: data.email,
    amount: data.amount, // Amount in kobo
    currency: "GHS", // Ghana Cedis
    ref: `LP${Date.now()}`, // Unique reference
    firstname: firstName,
    lastname: lastName,
    phone: data.phone,
    metadata: data.metadata,
    onSuccess: (transaction) => {
      onSuccess(transaction as PaystackResponse);
      // TODO send request to sever to verify payment and store order
    },
    onCancel: () => {
      onClose();
    },
  });
};

/**
 * Convert amount from GHS to kobo (smallest currency unit)
 * @param amount Amount in GHS
 * @returns Amount in kobo (pesewas)
 */
export const convertToKobo = (amount: number): number => {
  return Math.round(amount * 100);
};
