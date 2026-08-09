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
import AdminRoute from "./components/AdminRoute"
import AdminLayout from "./components/AdminLayout"
import AdminOverviewPage from "./pages/admin/AdminOverviewPage"
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage"
import AdminProductsPage from "./pages/admin/AdminProductsPage"
import AdminManagementPage from "./pages/admin/AdminManagementPage"
import AdminOrdersPage from "./pages/admin/AdminOrdersPage"
import SearchResultsPage from "./pages/SearchResultsPage"
import WishlistPage from "./pages/WishlistPage"
import AdminAuditLogsPage from "./pages/admin/AdminAuditLogsPage"
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage"
import AdminUsersPage from "./pages/admin/AdminUsersPage"
import OutfitAdvisorPage from "./pages/OutfitAdvisorPage"
import SupportChatWidget from "./components/SupportChatWidget"

function App() {
  return (
    <div>
      <Navbar />
      <SupportChatWidget />
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/account/wishlist" element={<WishlistPage />} />
        <Route path="/outfit-advisor" element={<OutfitAdvisorPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/account/orders" element={<OrdersPage />} />
          <Route path="/account/orders/:id" element={<OrderDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminOverviewPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/admins" element={<AdminManagementPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App