import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Badge } from "@/components/ui/badge";
import CartSheet from "./CartSheet";

export default function MobileTopNavbar() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/lp_logo.png"
            alt="Lucy's Perfumery Logo"
            className="h-10 w-10 object-contain rounded-md border-2 border-primary/20"
          />
          <p className="font-semibold text-lg">Lucy's Perfumery</p>
        </Link>

        {/* Cart Button */}
        <CartSheet>
          <button className="relative p-2">
            <ShoppingCart className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
              >
                {totalItems}
              </Badge>
            )}
          </button>
        </CartSheet>
      </div>
    </header>
  );
}
