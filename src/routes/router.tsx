// import { createBrowserRouter } from 'react-router-dom'
// import { lazy, Suspense } from 'react'
// import RootLayout from '../components/layout/RootLayout'
// import ProtectedRoute from './ProtectedRoute'
// import ErrorPage from '../pages/ErrorPage'

// const HomePage = lazy(() => import('../pages/HomePage'))
// const ProductListPage = lazy(() => import('../pages/ProductListPage'))
// const ProductDetailPage = lazy(() => import('../pages/ProductDetailPage'))
// const CartPage = lazy(() => import('../pages/CartPage'))
// const CheckoutPage = lazy(() => import('../pages/CheckoutPage'))
// const LoginPage = lazy(() => import('../pages/LoginPage'))
// const AccountPage = lazy(() => import('../pages/AccountPage'))

// const withSuspense = (Component: React.LazyExoticComponent<() => JSX.Element>) => (
//     <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
//         <Component />
//     </Suspense>
// )

// export const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <RootLayout />,
//         errorElement: <ErrorPage />,
//         children: [
//             { index: true, element: withSuspense(HomePage) },
//             { path: 'products', element: withSuspense(ProductListPage) },
//             { path: 'products/:slug', element: withSuspense(ProductDetailPage) },
//             { path: 'cart', element: withSuspense(CartPage) },
//             { path: 'login', element: withSuspense(LoginPage) },
//             {
//                 element: <ProtectedRoute />,
//                 children: [
//                     { path: 'checkout', element: withSuspense(CheckoutPage) },
//                     { path: 'account', element: withSuspense(AccountPage) },
//                 ],
//             },
//         ],
//     },
// ])