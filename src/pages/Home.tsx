import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductCard from "@/components/products/ProductCard";
import Autoplay from "embla-carousel-autoplay";
import { ShoppingCart } from "lucide-react";
import productService from "@/services/productService";
import type { Product } from "@/types/product";
import { toast } from "sonner";
import MobileTopNavbar from "@/components/layout/MobileTopNavbar";

// Import carousel images
const carouselImages = [
  "/carousel/hardcore-wood.png",
  "/carousel/lattafa-hayaati.png",
  "/carousel/ophylia.png",
  "/carousel/suspenso.png",
];

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Check if user has visited before
    // const hasVisited = localStorage.getItem("hasVisitedLucysPerfumery");
    // if (!hasVisited) {
    //   setShowWelcome(true);
    //   localStorage.setItem("hasVisitedLucysPerfumery", "true");
    // }

    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          page: 1,
          limit: 12,
        });
        console.log("Featured Products Response:", response.data);

        // Add slug for routing
        const productsWithSlug = response.data?.map((product: Product) => ({
          ...product,
          slug: product.name.toLowerCase().replace(/\s+/g, "-"),
        }));

        setFeaturedProducts(productsWithSlug);
      } catch (error) {
        toast.error("Error loading products", {
          description:
            error instanceof Error ? error.message : "Failed to fetch products",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <>
      <MobileTopNavbar />

      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              Welcome to Lucy's Perfumery! 🌷
            </DialogTitle>
            <DialogDescription className="text-center space-y-3 pt-4">
              <p className="text-base">We're delighted to have you here!</p>
              <p>
                Shop all your original perfumes, diffusers, body splashes &
                more. Choose from our variety of brands and categories.
              </p>
              <p className="font-medium text-primary">Happy shopping! 🛍️</p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center pt-4">
            <Button
              onClick={() => setShowWelcome(false)}
              className="w-full sm:w-auto px-8"
            >
              Start Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <main className="w-full flex flex-col dark:bg-gray-900 font-[Inter]">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center mt-2 pt-16 md:pt-0 text-center">
            <div className="w-full mb-6 sm:my-8">
              {/* <div className="flex flex-col items-center mb-4">
              <img
                src="/lp_logo.png"
                alt="Lucy's Perfumery Logo"
                className="h-20 rounded-md border-2 mt-8 md:mt-0 border-primary/20 w-20 sm:h-24 sm:w-24 mb-3 object-contain"
              />
              <p className="text-2xl font-semibold">Lucy's Perfumery</p>
            </div> */}
              <p className="mt-4 md:mt-0 font-serif text-base sm:text-xl mb-6 sm:mb-8 px-4">
                Shop your original perfumes, diffusers, body splashes & more.
                <br className="hidden md:block" /> Choose from our variety of
                brands and categories.
              </p>

              {/* Carousel */}
              <div className="relative">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  plugins={[
                    Autoplay({
                      delay: 3000,
                    }),
                  ]}
                  className="w-full"
                >
                  <CarouselContent>
                    {carouselImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="w-full h-48 sm:h-64 md:h-82 lg:h-156 overflow-hidden rounded-lg">
                          <img
                            src={image}
                            alt={`Perfume ${index + 1}`}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
                <Button className="mt-2 w-full md:hidden">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Shop Now
                </Button>
              </div>
            </div>
          </div>

          {/* Featured Products Section */}
          <div className="my-8 sm:my-10 lg:my-12">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold">
                Featured Products
              </h2>
              <Link to="/products">
                <Button variant="outline">View All</Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 xl:gap-8 2xl:gap-10">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Loading featured products...
                  </p>
                </div>
              ) : featuredProducts?.length > 0 ? (
                featuredProducts?.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-neutral-600 dark:text-neutral-400">
                    No featured products available
                  </p>
                </div>
              )}
            </div>

            <div className="text-center mt-8 sm:mt-10">
              <Link to="/products">
                <Button variant="outline" size="lg">
                  Browse All Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <footer>
          <div className="w-full bg-gray-100 dark:bg-gray-800 py-6 mt-12">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Lucy's Perfumery. All rights
                reserved.
              </p>

              <p className="text-sm dark:text-gray-400 mt-2">
                developed by{" "}
                <a
                  href="https://thelocalgodd.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:underline transition-all"
                >
                  Vincent Kwaku
                </a>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

export default HomePage;
