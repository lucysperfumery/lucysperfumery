import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingCart, Trash2, MessageCircle } from "lucide-react";
// PAYSTACK DISABLED - NOW USING WHATSAPP CHECKOUT
// import { PaystackButton } from "react-paystack";
// import { PAYSTACK_PUBLIC_KEY, convertToPesewas } from "@/lib/paystack";
// import orderService from "@/services/orderService";

// Form schema with conditional validation
const checkoutSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(5, "Phone number is required"),
    email: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    deliveryMethod: z.enum(["pickup", "delivery"]),
    address: z.string().optional(),
    country: z.string().optional(),
    specialInstructions: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.deliveryMethod === "delivery") {
        return !!data.address && data.address.trim().length > 0;
      }
      return true;
    },
    {
      message: "Delivery address is required for delivery orders",
      path: ["address"],
    },
  )
  .refine(
    (data) => {
      if (data.deliveryMethod === "delivery") {
        return !!data.country && data.country.trim().length > 0;
      }
      return true;
    },
    {
      message: "Country is required for delivery orders",
      path: ["country"],
    },
  );

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart, removeItem, updateQuantity } =
    useCartStore();

  // const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  // const [paymentReference, setPaymentReference] = useState<string>("");
  // const [checkoutData, setCheckoutData] = useState<CheckoutFormValues | null>(
  //   null
  // );
  // const paystackButtonRef = useRef<HTMLDivElement>(null);

  // WhatsApp configuration
  const WHATSAPP_NUMBER = "233555271090"; // +233555271090
  const [isRedirectingToWhatsApp, setIsRedirectingToWhatsApp] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      deliveryMethod: "delivery",
      address: "",
      country: "",
      specialInstructions: "",
    },
  });

  const deliveryMethod = form.watch("deliveryMethod");

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate("/");
    }
  }, [items.length, navigate]);

  // PAYSTACK CODE COMMENTED OUT - NOW USING WHATSAPP
  // // Auto-trigger PaystackButton when checkout data is ready
  // useEffect(() => {
  //   if (checkoutData && paymentReference && paystackButtonRef.current) {
  //     // Small delay to ensure button is rendered and ready
  //     const timer = setTimeout(() => {
  //       const button = paystackButtonRef.current?.querySelector('button');
  //       button?.click();
  //     }, 100);
  //     return () => clearTimeout(timer);
  //   }
  // }, [checkoutData, paymentReference]);

  // Function to format order message for WhatsApp
  const formatWhatsAppMessage = (data: CheckoutFormValues) => {
    const itemsList = items
      .map((item) => {
        const itemPrice = item.selectedOption
          ? item.selectedOption.optionPrice
          : item.price;
        const optionText = item.selectedOption
          ? ` (${item.selectedOption.optionName})`
          : "";
        return `• ${item.name}${optionText}\n  ${item.quantity}x - GH₵${itemPrice.toFixed(2)} = GH₵${(item.quantity * itemPrice).toFixed(2)}`;
      })
      .join("\n\n");

    const deliveryInfo =
      data.deliveryMethod === "delivery"
        ? `*Delivery Address:*\n${data.address}\n*Country:* ${data.country}`
        : "*Pickup:* I will pick up from your store";

    const specialInstructions = data.specialInstructions
      ? `\n\n*Special Instructions:*\n${data.specialInstructions}`
      : "";

    return `*NEW ORDER - Lucy's Perfumery* 🛍️

*Customer Details:*
Name: ${data.name}
Phone: ${data.phone}${data.email ? `\nEmail: ${data.email}` : ""}

*Order Items:*
${itemsList}

*Total Amount: GH₵${getTotalPrice().toFixed(2)}*

*Delivery Method:*
${deliveryInfo}${specialInstructions}

I would like to complete this order. Please let me know the payment details. Thank you!`;
  };

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsRedirectingToWhatsApp(true);

    try {
      // Format the WhatsApp message
      const message = formatWhatsAppMessage(data);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      // Save order data to localStorage for confirmation page
      const orderData = {
        customer: data,
        items: items,
        totalAmount: getTotalPrice(),
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem("lastOrder", JSON.stringify(orderData));

      // Clear cart
      clearCart();

      // Show success toast
      toast.success("Redirecting to WhatsApp!", {
        description: "Complete your order via WhatsApp chat",
      });

      // Open WhatsApp
      window.open(whatsappUrl, "_blank");

      // Redirect to confirmation page after a brief delay
      setTimeout(() => {
        navigate("/order-confirmation");
      }, 1000);
    } catch {
      setIsRedirectingToWhatsApp(false);
      toast.error("Failed to redirect", {
        description: "Please try again or contact us directly",
      });
    }
  };

  // PAYSTACK FUNCTIONS COMMENTED OUT
  // const handlePaymentSuccess = async (reference: any) => {
  //   if (!checkoutData) return;
  //   setIsProcessingPayment(true);
  //   try {
  //     const orderPayload = {
  //       customer: {
  //         name: checkoutData.name,
  //         email: checkoutData.email,
  //         phone: checkoutData.phone,
  //       },
  //       items: items.map((item) => ({
  //         productId: item._id,
  //         name: item.name,
  //         quantity: item.quantity,
  //         price: item.selectedOption ? item.selectedOption.optionPrice : item.price,
  //         selectedOption: item.selectedOption || undefined,
  //       })),
  //       totalAmount: getTotalPrice(),
  //       paystackReference: reference.reference || paymentReference,
  //       metadata: {
  //         deliveryMethod: checkoutData.deliveryMethod,
  //         deliveryAddress: checkoutData.deliveryMethod === "delivery" ? checkoutData.address : undefined,
  //         country: checkoutData.deliveryMethod === "delivery" ? checkoutData.country : undefined,
  //         specialInstructions: checkoutData.specialInstructions,
  //       },
  //     };
  //     const createOrderResponse = await orderService.createOrder(orderPayload);
  //     localStorage.setItem("lastOrder", JSON.stringify(createOrderResponse.order));
  //     clearCart();
  //     toast.success("Payment successful!", {
  //       description: `Order #${createOrderResponse.order._id.slice(-8)} has been placed`,
  //     });
  //     setIsProcessingPayment(false);
  //     navigate("/order-confirmation");
  //   } catch (error) {
  //     setIsProcessingPayment(false);
  //     toast.error("Order creation failed", {
  //       description: error instanceof Error ? error.message : "Please contact support",
  //     });
  //   }
  // };

  // const handlePaymentClose = () => {
  //   setIsProcessingPayment(false);
  //   toast.error("Payment cancelled", {
  //     description: "You can try again when ready",
  //   });
  // };

  // const paystackProps = {
  //   email: checkoutData?.email || `temp_${Date.now()}@noemail.lucysperfumery.com`,
  //   amount: convertToPesewas(getTotalPrice()),
  //   publicKey: PAYSTACK_PUBLIC_KEY,
  //   text: isProcessingPayment ? "Processing..." : "Proceed to Payment",
  //   reference: paymentReference,
  //   currency: "GHS",
  //   metadata: {
  //     custom_fields: [
  //       { display_name: "Customer Name", variable_name: "customer_name", value: checkoutData?.name || "" },
  //       { display_name: "Phone Number", variable_name: "phone_number", value: checkoutData?.phone || "" },
  //     ],
  //   },
  //   onSuccess: handlePaymentSuccess,
  //   onClose: handlePaymentClose,
  // };

  if (items.length === 0) {
    return null;
  }

  return (
    <main className="w-full flex flex-col dark:bg-gray-900 font-[Inter] min-h-screen pb-20 md:pb-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    {/* Delivery Method */}
                    <FormField
                      control={form.control}
                      name="deliveryMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Method *</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col sm:flex-row gap-4"
                            >
                              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900">
                                <RadioGroupItem value="pickup" id="pickup" />
                                <label
                                  htmlFor="pickup"
                                  className="flex-1 cursor-pointer"
                                >
                                  <p className="font-medium">Shop Pickup</p>
                                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Pick up from our store
                                  </p>
                                </label>
                              </div>
                              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900">
                                <RadioGroupItem
                                  value="delivery"
                                  id="delivery"
                                />
                                <label
                                  htmlFor="delivery"
                                  className="flex-1 cursor-pointer"
                                >
                                  <p className="font-medium">Delivery</p>
                                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Deliver to your address
                                  </p>
                                </label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+233 XX XXX XXXX"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Optional - leave blank if you don't have one"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                          <FormDescription>
                            If you don't have an email, leave this blank and
                            we'll process your order via phone/SMS
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Delivery Address - Only shown for delivery */}
                    {deliveryMethod === "delivery" && (
                      <>
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Delivery Address *</FormLabel>
                              <p className="text-xs text-muted-foreground">
                                Please provide your full delivery address with
                                as much detail as possible.
                              </p>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter your full delivery address"
                                  {...field}
                                  className="w-full resize-none"
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Ghana"
                                  {...field}
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    )}

                    {/* Special Instructions */}
                    <FormField
                      control={form.control}
                      name="specialInstructions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Special Instructions (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any special requests or delivery instructions..."
                              {...field}
                              className="w-full resize-none"
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button - Mobile */}
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full lg:hidden bg-[#25D366] hover:bg-[#20BD5A] text-white"
                      disabled={isRedirectingToWhatsApp}
                    >
                      {isRedirectingToWhatsApp
                        ? "Opening WhatsApp..."
                        : "Order via WhatsApp"}
                    </Button>

                    {/* PAYSTACK BUTTON COMMENTED OUT */}
                    {/* {!checkoutData ? (
                      <Button type="submit" size="lg" className="w-full lg:hidden" disabled={isProcessingPayment}>
                        Continue to Payment
                      </Button>
                    ) : (
                      <div ref={paystackButtonRef}>
                        <PaystackButton {...paystackProps} className="w-full lg:hidden px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50" />
                      </div>
                    )} */}
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Cart Summary - Sticky on desktop */}
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {items.map((item) => {
                    const itemPrice = item.selectedOption
                      ? item.selectedOption.optionPrice
                      : item.price;
                    const itemId = item.cartItemId || item._id;

                    return (
                      <div
                        key={itemId}
                        className="flex gap-3 pb-3 border-b last:border-b-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {item.name}
                          </p>
                          {item.selectedOption && (
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              {item.selectedOption.optionName}
                            </p>
                          )}
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            GH₵{itemPrice.toFixed(2)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                updateQuantity(
                                  itemId,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                            >
                              -
                            </Button>
                            <span className="text-sm w-6 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() =>
                                updateQuantity(itemId, item.quantity + 1)
                              }
                            >
                              +
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 ml-auto"
                              onClick={() => removeItem(itemId)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-sm">
                              GH₵{(itemPrice * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="pt-3 border-t-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Subtotal
                    </span>
                    <span className="font-semibold">
                      GH₵{getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>GH₵{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button - Desktop */}
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  size="lg"
                  className="w-full hidden lg:block bg-[#25D366] hover:bg-[#20BD5A] text-white"
                  disabled={isRedirectingToWhatsApp}
                >
                  {isRedirectingToWhatsApp
                    ? "Opening WhatsApp..."
                    : "Order via WhatsApp"}
                </Button>

                {/* PAYSTACK BUTTON COMMENTED OUT */}
                {/* {!checkoutData ? (
                  <Button onClick={form.handleSubmit(onSubmit)} size="lg" className="w-full hidden lg:block" disabled={isProcessingPayment}>
                    Continue to Payment
                  </Button>
                ) : (
                  <PaystackButton {...paystackProps} className="w-full hidden lg:block px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50" />
                )} */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
