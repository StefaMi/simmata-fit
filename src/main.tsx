
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './registerSW';

// Create a client instance with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      suspense: false, // Don't use React Suspense yet
    },
  },
});

// Improved rendering process with error handling
const renderApp = () => {
  try {
    const rootElement = document.getElementById("root");
    
    if (rootElement) {
      const root = createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </React.StrictMode>
      );
    } else {
      console.error("Root element not found. Cannot render application.");
    }
  } catch (error) {
    console.error("Error rendering application:", error);
  }
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}

// Register Service Worker for PWA
registerServiceWorker();
