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
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Order Confirmed!
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Thank you for your order. We'll contact you shortly.
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
                  {new Date(orderData.createdAt).toLocaleDateString("en-US", {
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
              </div>
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/" className="flex-1">
              <Button className="w-full" size="lg">
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
