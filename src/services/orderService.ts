import api, { handleApiError } from "../lib/api";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface CustomerInfo {
  name: string;
  email?: string;
  phone: string;
}

export interface CreateOrderPayload {
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  paystackReference: string;
  metadata?: {
    deliveryMethod?: string;
    deliveryAddress?: string;
    [key: string]: any;
  };
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  totalAmount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  paystackReference: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderResponse {
  order: Order;
  paystackReference: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  order: Order;
}

class OrderService {
  /**
   * Create a new pending order before payment
   */
  async createOrder(
    orderData: CreateOrderPayload
  ): Promise<CreateOrderResponse> {
    try {
      const response = await api.post("/api/orders", orderData);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Verify payment and complete order
   */
  async verifyPayment(
    paystackReference: string
  ): Promise<VerifyPaymentResponse> {
    try {
      const response = await api.post("/api/orders/verify", {
        reference: paystackReference,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order> {
    try {
      const response = await api.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      throw new Error(errorMessage);
    }
  }
}

export default new OrderService();
