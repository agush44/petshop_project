import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CartContext } from "./CartContext";
import { formatPrice } from "../lib/formatPrice";
import { getFinalPrice } from "../lib/pricing";

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item._id === product._id);
      const finalPrice = getFinalPrice(product);

      if (existing) {
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1, finalPrice }];
    });
    toast.success("Producto agregado al carrito");
  };

  const increaseQuantity = (productId) =>
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );

  const decreaseQuantity = (productId) =>
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== productId));
    toast.success("Producto eliminado del carrito");
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalRaw = cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  const totalOriginalRaw = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalPrice = formatPrice(totalRaw);
  const totalOriginalPrice = formatPrice(totalOriginalRaw);
  const totalSavings = totalOriginalRaw - totalRaw;
  const totalSavingsPrice = formatPrice(totalSavings);
  const hasSavings = totalSavings > 0.01;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalRaw,
        totalPrice,
        totalOriginalPrice,
        totalSavingsPrice,
        hasSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
