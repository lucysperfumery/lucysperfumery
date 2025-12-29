// Paystack configuration
export const PAYSTACK_PUBLIC_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
  "pk_test_9f84bcbcafb055b3631126963345a60c95e53c73";

export interface PaystackConfig {
  reference: string;
  email: string;
  amount: number; // Amount in pesewas (GHS 100 = 10000 pesewas)
  publicKey: string;
  currency?: string;
  metadata?: {
    [key: string]: string | number;
  };
  channels?: string[];
  label?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
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
 * Create Paystack configuration object for usePaystackPayment hook
 * @param email Customer email
 * @param amount Amount in pesewas
 * @param reference Payment reference from backend
 * @param metadata Additional metadata
 * @param firstName Customer first name
 * @param lastName Customer last name
 * @param phone Customer phone number
 * @returns Paystack config object
 */
export const createPaystackConfig = (
  email: string,
  amount: number,
  reference: string,
  metadata?: { [key: string]: string | number },
  firstName?: string,
  lastName?: string,
  phone?: string
): PaystackConfig => {
  return {
    reference,
    email,
    amount,
    publicKey: PAYSTACK_PUBLIC_KEY,
    currency: "GHS",
    metadata,
    firstname: firstName,
    lastname: lastName,
    phone,
  };
};

/**
 * Convert amount from GHS to kobo (smallest currency unit)
 * @param amount Amount in GHS
 * @returns Amount in kobo (pesewas)
 */
export const convertToPesewas = (amount: number): number => {
  return Math.round(amount * 100);
};
