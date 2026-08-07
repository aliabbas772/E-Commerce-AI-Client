import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { ApolloProvider } from '@apollo/client/react'
import { apolloClient } from './lib/apolloClient'
import { BrowserRouter } from 'react-router-dom'
import NotificationSocketProvider from './components/NotificationSocketProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <BrowserRouter>
          <NotificationSocketProvider>
            <App />
          </NotificationSocketProvider>
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
)