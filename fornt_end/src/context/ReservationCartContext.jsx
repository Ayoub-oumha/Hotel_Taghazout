import React, { createContext, useContext, useState, useEffect } from 'react';

const ReservationCartContext = createContext();

export function useReservationCart() {
  return useContext(ReservationCartContext);
}

export function ReservationCartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = localStorage.getItem('reservationCart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
        setCartItems([]);
      }
    }
  }, []);

  // Update localStorage whenever cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('reservationCart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('reservationCart');
    }

    // Calculate total amount
    const newTotal = cartItems.reduce((acc, item) => acc + parseFloat(item.total_price), 0);
    setTotalAmount(newTotal);
  }, [cartItems]);

  // Add reservation to cart
  const addToCart = (reservation) => {
    // Check if reservation is already in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === reservation.id);
    
    if (existingItemIndex >= 0) {
      // If reservation is already in cart, show message
      return { success: false, message: 'Cette réservation est déjà dans votre panier.' };
    } else {
      // Add to cart
      setCartItems([...cartItems, reservation]);
      return { success: true, message: 'Réservation ajoutée au panier.' };
    }
  };

  // Remove reservation from cart
  const removeFromCart = (reservationId) => {
    setCartItems(cartItems.filter(item => item.id !== reservationId));
  };

  // Clear all items from cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('reservationCart');
  };

  const value = {
    cartItems,
    totalAmount,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount: cartItems.length
  };

  return (
    <ReservationCartContext.Provider value={value}>
      {children}
    </ReservationCartContext.Provider>
  );
}