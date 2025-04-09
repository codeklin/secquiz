import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find root element');

const root = createRoot(rootElement);
root.render(<App />);

// Remove loading fallback after render
const loadingFallback = document.getElementById('loading-fallback');
if (loadingFallback?.parentElement) {
  loadingFallback.parentElement.removeChild(loadingFallback);
}
