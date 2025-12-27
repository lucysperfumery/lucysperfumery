import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { featuredProducts } from "@/lib/mockData";
import ProductCard from "@/components/products/ProductCard";
import Autoplay from "embla-carousel-autoplay";
import { ShoppingCart } from "lucide-react";

// Import carousel images
const carouselImages = [
  "/carousel/hardcore-wood.png",
  "/carousel/lattafa-hayaati.png",
  "/carousel/ophylia.png",
  "/carousel/suspenso.png",
];

function HomePage() {
  return (
    <main className="w-full flex flex-col dark:bg-gray-900 font-[Inter]">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center mt-2  text-center">
          <div className="w-full mb-6 sm:my-8">
            <div className="flex flex-col items-center mb-4">
              <img
                src="/lp_logo.png"
                alt="Lucy's Perfumery Logo"
                className="h-20 rounded-md border-2 mt-8 md:mt-0 border-primary/20 w-20 sm:h-24 sm:w-24 mb-3 object-contain"
              />
              <p className="text-2xl font-semibold">Lucy's Perfumery</p>
            </div>
            <p className="font-serif text-sm sm:text-base mb-6 sm:mb-8 px-4">
              Shop perfumes, diffusers, body splashes & more. Choose from a
              variety of brands and categories
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

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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
    </main>
  );
}

export default HomePage;
