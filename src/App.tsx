import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Navbar from "./components/layout/Navbar";
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Toaster position="top-center" richColors />
        <div className="flex-1 md:pt-0 pb-16 md:pb-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/category/:categoryName" element={<Products />} />
            <Route path="/products/brand/:brandName" element={<Products />} />
            <Route path="/products/:productSlug" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
