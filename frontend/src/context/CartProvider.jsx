import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CartContext } from "./CartContext";
import { formatPrice } from "../lib/formatPrice";

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
      const finalPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;

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
  const totalPrice = formatPrice(totalRaw);

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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
