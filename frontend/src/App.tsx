import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import BookList from './BookList';
import CartPage from './components/CartPage';
import './App.css';

// Inner component to access location for "Continue Shopping" path
function AppRoutes() {
  const location = useLocation();
  const [lastBookPath, setLastBookPath] = useState('/');

  // Whenever we land on a non-cart page, remember it
  if (location.pathname !== '/cart') {
    const current = location.pathname + location.search;
    if (current !== lastBookPath) setLastBookPath(current);
  }

  return (
    <Routes>
      <Route path="/" element={<BookList />} />
      <Route path="/cart" element={<CartPage returnPath={lastBookPath} />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
