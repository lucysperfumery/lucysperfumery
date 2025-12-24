import { Link, useLocation } from "react-router-dom";
import { Home, Package, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CartSheet from "./CartSheet";

export default function Navbar() {
  const location = useLocation();
  const totalItems = useCartStore((state) => state.getTotalItems());

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Desktop Navbar - Sticky Top */}
      <header className="hidden md:block sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/lp_logo.png"
                alt="Lucy's Perfumery Logo"
                className="h-10 w-10 lg:h-12 lg:w-12 object-contain rounded-md border border-pink-200"
              />
              <h1 className="text-xl lg:text-2xl font-semibold">
                Lucy's Perfumery
              </h1>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-6">
              <Link
                to="/"
                className={`flex items-center gap-2 font-medium transition-colors hover:text-primary ${
                  isActive("/")
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-400"
                }`}
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                to="/products"
                className={`flex items-center gap-2 font-medium transition-colors hover:text-primary ${
                  isActive("/products")
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-400"
                }`}
              >
                <Package className="w-4 h-4" />
                Products
              </Link>

              {/* Cart Button */}
              <CartSheet>
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                  {totalItems > 0 && (
                    <Badge
                      variant="outline"
                      className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </CartSheet>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t pb-4 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
        <div className="flex items-center justify-around h-16 px-4">
          {/* Home */}
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 flex-1 ${
              isActive("/")
                ? "text-primary"
                : "text-neutral-600 dark:text-neutral-400"
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          {/* Products */}
          <Link
            to="/products"
            className={`flex flex-col items-center gap-1 flex-1 ${
              isActive("/products")
                ? "text-primary"
                : "text-neutral-600 dark:text-neutral-400"
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-xs font-medium">Products</span>
          </Link>

          {/* Cart */}
          <CartSheet>
            <button
              className={`flex flex-col items-center gap-1 flex-1 relative ${
                totalItems > 0
                  ? "text-primary"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {totalItems}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">Cart</span>
            </button>
          </CartSheet>
        </div>
      </nav>
    </>
  );
}
