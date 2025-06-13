import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

export default function CartPage() {
  const { 
    cart, 
    totalPrice, 
    updateQuantity, 
    removeFromCart, 
    loading: cartLoading,
    error: cartError,
    getCartWithDetails 
  } = useCart();
  const productsApi = useProducts();
  
  const [cartWithDetails, setCartWithDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load detailed cart data
  useEffect(() => {
    const fetchCartDetails = async () => {
      if (cart.length === 0) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const detailedCart = await getCartWithDetails(productsApi);
        setCartWithDetails(detailedCart);
        setError(null);
      } catch (err) {
        console.error('Error fetching cart details:', err);
        setError('Unable to load some product details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCartDetails();
  }, [cart, getCartWithDetails, productsApi]);

  // Items to display (use detailed cart if available, otherwise use basic cart)
  const displayItems = cartWithDetails.length > 0 ? cartWithDetails : cart;
  
  if (cart.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <p className="mb-6">Add some products to your cart to see them here.</p>
        <Link to="/products" className="text-blue-600 hover:text-blue-800 font-medium">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-700">{error || cartError}</p>
              </div>
            )}
            
            {isLoading || cartLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {displayItems.map((item) => (
                  <tr key={item._id || item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={Array.isArray(item.images) && item.images.length > 0
                              ? `http://localhost:8000/${item.images[0]}`
                              : item.image ? `http://localhost:8000/${item.image}` : 'https://via.placeholder.com/150'}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${parseFloat(item.price).toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => updateQuantity(item._id || item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item._id || item.id, parseInt(e.target.value) || 1)}
                          className="mx-2 w-12 text-center border border-gray-300 rounded-md"
                        />
                        <button
                          onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => removeFromCart(item._id || item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="flow-root">
              <div className="-my-4 divide-y divide-gray-200">
                <div className="py-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">${parseFloat(totalPrice).toFixed(2)}</p>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">$0.00</p>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-medium text-gray-900">${parseFloat(totalPrice).toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <Link
                to="/checkout"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center block"
              >
                Proceed to Checkout
              </Link>
            </div>
            
            <div className="mt-4">
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-800 text-sm flex justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
