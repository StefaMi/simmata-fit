
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './registerSW';

// Render the React application
createRoot(document.getElementById("root")!).render(<App />);

// Register Service Worker for PWA
registerServiceWorker();
