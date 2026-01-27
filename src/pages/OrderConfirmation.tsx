import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle,
  Package,
  MapPin,
  Phone,
  Mail,
  FileText,
  MessageCircle,
} from "lucide-react";

interface OrderData {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  currency: string;
  status: string;
  paystackReference: string;
  metadata?: {
    deliveryMethod?: string;
    deliveryAddress?: string;
    country?: string;
    specialInstructions?: string;
  };
  createdAt: string;
  updatedAt: string;
}

function OrderConfirmation() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(() => {
    try {
      const saved = localStorage.getItem("lastOrder");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (orderData) {
      // Clear localStorage after retrieving order data
      localStorage.removeItem("lastOrder");
      return;
    }
    // If no order data, redirect to home
    navigate("/");
  }, [orderData, navigate]);

  if (!orderData) {
    return null;
  }

  return (
    <main className="w-full flex flex-col dark:bg-gray-900 font-[Inter] min-h-screen pb-20 md:pb-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <MessageCircle className="w-16 h-16 text-[#25D366]" />
            <CheckCircle className="w-8 h-8 text-green-500 absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Order Sent to WhatsApp!
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
            Your order details have been sent to WhatsApp. Please complete your purchase by chatting with us.
          </p>
        </div>

        {/* Order Details */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Order Number & Date */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Order ID
                </span>
                <span className="font-semibold font-mono text-xs">
                  {orderData.orderNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Order Date
                </span>
                <span className="font-semibold">
                  {orderData.createdAt
                    ? new Date(orderData.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                </span>
              </div>
              {orderData.metadata?.deliveryMethod && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Delivery Method
                  </span>
                  <span className="font-semibold capitalize">
                    {orderData.metadata.deliveryMethod === "pickup"
                      ? "Shop Pickup"
                      : "Delivery"}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Order Status
                </span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">
                  Pending WhatsApp Confirmation
                </span>
              </div>

              {/* PAYSTACK PAYMENT INFO COMMENTED OUT */}
              {/* <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Payment Reference
                </span>
                <span className="font-semibold font-mono text-xs">
                  {orderData.paystackReference}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  Payment Status
                </span>
                <span className="font-semibold text-green-600 dark:text-green-400 capitalize">
                  {orderData.status}
                </span>
              </div> */}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-neutral-500 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Name
                  </p>
                  <p className="font-medium">{orderData.customer.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-neutral-500 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Phone
                  </p>
                  <p className="font-medium">{orderData.customer.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-neutral-500 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Email
                  </p>
                  <p className="font-medium">{orderData.customer.email}</p>
                </div>
              </div>
              {orderData.metadata?.deliveryMethod === "delivery" &&
                orderData.metadata?.deliveryAddress && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-neutral-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Delivery Address
                      </p>
                      <p className="font-medium">
                        {orderData.metadata.deliveryAddress}
                      </p>
                      {orderData.metadata.country && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {orderData.metadata.country}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              {orderData.metadata?.specialInstructions && (
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-neutral-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Special Instructions
                    </p>
                    <p className="font-medium">
                      {orderData.metadata.specialInstructions}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderData.items.map((item, index) => (
                  <div
                    key={item.productId || index}
                    className="flex justify-between items-center pb-3 border-b last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Quantity: {item.quantity} × GH₵
                        {item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-semibold">
                      GH₵
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-3 border-t-2">
                  <p className="font-bold text-lg">Total</p>
                  <p className="font-bold text-lg">
                    GH₵
                    {orderData.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Notice */}
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-6 h-6 text-[#25D366] flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    Complete Your Order on WhatsApp
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    We've sent your order details to WhatsApp. Please check your WhatsApp messages to:
                  </p>
                  <ul className="text-sm text-green-800 dark:text-green-200 list-disc list-inside space-y-1 ml-2">
                    <li>Confirm your order details</li>
                    <li>Arrange payment (Mobile Money, Cash, Bank Transfer)</li>
                    <li>Coordinate delivery or pickup</li>
                  </ul>
                  <p className="text-sm text-green-800 dark:text-green-200 font-medium mt-3">
                    If you didn't see the WhatsApp message, you can contact us directly at +233 555 271 090
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/233555271090"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white" size="lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Open WhatsApp
              </Button>
            </a>
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderConfirmation;
