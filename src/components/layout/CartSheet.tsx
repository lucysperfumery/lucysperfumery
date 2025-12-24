import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/products/EmptyState";

interface CartSheetProps {
  children: React.ReactNode;
}

export default function CartSheet({ children }: CartSheetProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } =
    useCartStore();

  const totalPrice = getTotalPrice();

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col px-4">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shopping Cart
              {items.length > 0 && (
                <Badge variant="secondary">{items.length}</Badge>
              )}
            </SheetTitle>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {items.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              description="Add some products to get started!"
            />
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 border border-neutral-200 dark:border-neutral-800 rounded-lg"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-1 mb-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                      {item.brand}
                    </p>
                    <p className="font-bold text-primary">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto text-destructive hover:text-destructive h-7 px-2"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with Total and Checkout */}
        {items.length > 0 && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 space-y-4 mb-8">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">${totalPrice.toFixed(2)}</span>
            </div>
            <Link to="/checkout">
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
