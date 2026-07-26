import { Route, Routes } from "react-router-dom"
import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import ProductListPage from "./pages/ProductListPage"
import CartPage from "./pages/CartPage"
import ProductDetailPage from "./pages/ProductDetailPage"

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </div>
  )
}

export default App