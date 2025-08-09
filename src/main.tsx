import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import App from './App.tsx'
import './index.css'

// Apollo Client配置
const client = new ApolloClient({
  uri: 'https://ai-chat-graphql.wyleleung.workers.dev/graphql', // 您的Workers域名
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  },
  headers: {
    'Content-Type': 'application/json',
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)
