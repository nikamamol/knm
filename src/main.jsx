import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { Provider } from 'react-redux';
import store from './redux/store/Store.js'; // No curly braces for default export

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Create a simple fallback component for loading
const Loader =  <div>Loading...</div>;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={Loader}>
        <App />
      </Suspense>
    </Provider>
  </React.StrictMode>,
);
