import { useEffect } from "react";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShoppingCart, Trash2 } from "lucide-react";

// Form schema with conditional validation
const checkoutSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(5, "Phone number is required"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
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
    }
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
    }
  );

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart, removeItem, updateQuantity } =
    useCartStore();

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
      toast.error("Your cart is empty");
      navigate("/products");
    }
  }, [items.length, navigate]);

  const onSubmit = (data: CheckoutFormValues) => {
    // Generate order number
    const orderNumber = `LP${Date.now().toString().slice(-8)}`;

    // Prepare order data
    const orderData = {
      orderNumber,
      name: data.name,
      phone: data.phone,
      email: data.email || undefined,
      deliveryMethod: data.deliveryMethod,
      address: data.deliveryMethod === "delivery" ? data.address : undefined,
      country: data.deliveryMethod === "delivery" ? data.country : undefined,
      specialInstructions: data.specialInstructions || undefined,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: getTotalPrice(),
      orderDate: new Date().toISOString(),
    };

    // Save order to localStorage
    localStorage.setItem("lastOrder", JSON.stringify(orderData));

    // Clear cart
    clearCart();

    // Show success toast
    toast.success("Order placed successfully!", {
      description: `Order #${orderNumber}`,
    });

    // Redirect to order confirmation
    navigate("/order-confirmation");
  };

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
                                <RadioGroupItem value="delivery" id="delivery" />
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
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
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
                      className="w-full lg:hidden"
                    >
                      Place Order
                    </Button>
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
                  {items.map((item) => (
                    <div
                      key={item.id}
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
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          ₵{item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(1, item.quantity - 1)
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
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            +
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 ml-auto"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          ₵{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="pt-3 border-t-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Subtotal
                    </span>
                    <span className="font-semibold">
                      ₵{getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>₵{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>

                {/* Submit Button - Desktop */}
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  size="lg"
                  className="w-full hidden lg:block"
                >
                  Place Order
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;
