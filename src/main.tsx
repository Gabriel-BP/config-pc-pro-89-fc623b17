
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.tsx'
import './index.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      meta: {
        onError: (error: Error) => {
          console.error('Query error:', error);
        }
      }
    },
  },
});

// Add global error handler for better debugging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
