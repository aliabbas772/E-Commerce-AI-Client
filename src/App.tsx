import Navbar from "./components/Navbar"
import ProductCard from "./components/ProductCard"
import CartPage from "./pages/CartPage"
import LoginPage from "./pages/LoginPage"

const demoProducts = [
  { productId: '1', name: 'Classic White Tee', price: 799, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', sizes: ['S', 'M', 'L'] },
  { productId: '2', name: 'Denim Jacket', price: 2499, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', sizes: ['M', 'L', 'XL'] },
]

function App() {
  return (
    <div>
      <Navbar />
      <div className="mx-auto grid max-w-3xl grid-cols-2 gap-6 px-6 py-12">
        {demoProducts.map((p) => (
          <ProductCard key={p.productId} {...p} />
        ))}
      </div>
      <CartPage />
      <LoginPage />
    </div>
  )
}

export default App