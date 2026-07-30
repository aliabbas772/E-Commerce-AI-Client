import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import ProductListPage from "./pages/ProductListPage"
import CartPage from "./pages/CartPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import CheckoutPage from "./pages/CheckoutPage"
import OrdersPage from "./pages/OrdersPage"
import OrderDetailPage from "./pages/OrderDetailPage"
import ProtectedRoute from "./components/ProtectedRoute"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/account/orders" element={<OrdersPage />} />
          <Route path="/account/orders/:id" element={<OrderDetailPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App