import Navbar from "./components/Navbar"
import LoginPage from "./pages/LoginPage"
import ProductListPage from "./pages/ProductListPage"

function App() {
  return (
    <div>
      <Navbar />
      <ProductListPage />
      <LoginPage />
    </div>
  )
}

export default App