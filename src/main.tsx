import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Clear old Paystack-related localStorage data on app initialization
// This ensures users on older versions get a clean slate
const clearOldPaystackData = () => {
  try {
    // Remove any old payment-related data
    const keysToRemove = ['paystackReference', 'checkoutData', 'paymentData'];
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Log version for debugging
    console.log('Lucy\'s Perfumery v1.0.0 - WhatsApp Ordering');
  } catch (error) {
    console.error('Error clearing old data:', error);
  }
};

clearOldPaystackData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
