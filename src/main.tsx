import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { apolloClient } from './lib/apolloClient'
import { store } from './store/store'
import { router } from './routes/router'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
)