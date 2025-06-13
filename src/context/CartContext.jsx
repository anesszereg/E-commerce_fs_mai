import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Load cart from localStorage on initial load
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
      }
    } catch (err) {
      console.error('Error loading cart from localStorage:', err);
      // Clear corrupted cart data
      localStorage.removeItem('cart');
      setCart([]);
    }
  }, []);
  
  // Clear cart when user logs out
  useEffect(() => {
    if (!user) {
      // If no user is available, make sure cart persists in localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [user, cart]);

  useEffect(() => {
    // Update totals whenever cart changes
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    const price = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTotalItems(itemCount);
    setTotalPrice(price);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setError(null);
    
    // Ensure product has a consistent ID property
    const normalizedProduct = {
      ...product,
      id: product._id || product.id
    };
    
    setCart(prevCart => {
      // Check using both id and _id for compatibility
      const existingItemIndex = prevCart.findIndex(item => 
        (item.id === normalizedProduct.id) || 
        (item._id && item._id === normalizedProduct._id)
      );
      
      if (existingItemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        toast.success(`Updated ${updatedCart[existingItemIndex].name || 'Product'} quantity in cart`);
        return updatedCart;
      } else {
        // Item doesn't exist, add new item
        toast.success(`${normalizedProduct.name || 'Product'} added to cart`);
        return [...prevCart, { ...normalizedProduct, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cart.find(item => item.id === productId || item._id === productId);
    setCart(prevCart => prevCart.filter(item => 
      item.id !== productId && 
      item._id !== productId
    ));
    if (itemToRemove) {
      toast.success(`${itemToRemove.name || 'Product'} removed from cart`);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const itemToUpdate = cart.find(item => item.id === productId || item._id === productId);
    setCart(prevCart => 
      prevCart.map(item => 
        (item.id === productId || item._id === productId) ? 
          { ...item, quantity } : item
      )
    );
    if (itemToUpdate) {
      toast.success(`Updated ${itemToUpdate.name || 'Product'} quantity`);
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    toast.success('Cart cleared');
  };

  // Get cart items with full product details (useful for checkout page)
  const getCartWithDetails = async (productsApi) => {
    if (!productsApi?.getProduct) {
      return cart;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get full product details for each cart item
      const cartWithDetails = await Promise.all(
        cart.map(async (item) => {
          try {
            const fullProduct = await productsApi.getProduct(item.id || item._id);
            return {
              ...fullProduct,
              quantity: item.quantity
            };
          } catch (err) {
            // If we can't fetch details, use what we have
            return item;
          }
        })
      );
      
      return cartWithDetails;
    } catch (err) {
      const errorMsg = 'Failed to fetch cart details';
      setError(errorMsg);
      toast.error(errorMsg);
      return cart;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cart,
    totalItems,
    totalPrice,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartWithDetails
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
