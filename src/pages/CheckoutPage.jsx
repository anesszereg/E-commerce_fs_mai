import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import axios from 'axios';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart, loading: cartLoading, getCartWithDetails } = useCart();
  const { user } = useAuth();
  const productsApi = useProducts();
  const navigate = useNavigate();
  
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [cartWithDetails, setCartWithDetails] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'credit'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch full product details for cart items
  useEffect(() => {
    const loadCartDetails = async () => {
      if (cart.length > 0) {
        const detailedCart = await getCartWithDetails(productsApi);
        setCartWithDetails(detailedCart);
      }
    };
    
    loadCartDetails();
  }, [cart, getCartWithDetails, productsApi]);
  
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    
    return newErrors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setOrderProcessing(true);
    setOrderError(null);
    
    try {
      // Prepare order data
      const orderData = {
        orderItems: cart.map(item => ({
          product: item._id || item.id,
          name: item.name,
          image: Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : item.image,
          quantity: item.quantity,
          price: parseFloat(item.price)
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          fullName: `${formData.firstName} ${formData.lastName}`
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: parseFloat(totalPrice),
        taxPrice: 0, // Calculate tax if needed
        shippingPrice: 0, // Free shipping for now
        totalPrice: parseFloat(totalPrice)
      };
      
      // Send order to API
      const config = user?.token ? {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      } : {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      const { data } = await axios.post('http://localhost:8000/api/orders', orderData, config);
      
      // Clear cart and redirect to success page with order data
      clearCart();
      navigate('/order-success', { state: { order: data } });
    } catch (error) {
      console.error('Error creating order:', error);
      setOrderError(error.response?.data?.message || 'Failed to process your order. Please try again.');
    } finally {
      setIsSubmitting(false);
      setOrderProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full border ${errors.city ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={`w-full border ${errors.postalCode ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full border ${errors.country ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      id="credit"
                      name="paymentMethod"
                      type="radio"
                      value="credit"
                      checked={formData.paymentMethod === 'credit'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="credit" className="ml-3 block text-sm font-medium text-gray-700">
                      Credit Card
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="paypal"
                      name="paymentMethod"
                      type="radio"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                      PayPal
                    </label>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || orderProcessing}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
              >
                {orderProcessing ? 'Processing Order...' : 
                 isSubmitting ? 'Validating...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            {orderError && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-700">{orderError}</p>
              </div>
            )}
            
            <div className="flow-root">
              {cartLoading ? (
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <ul className="-my-6 divide-y divide-gray-200">
                  {(cartWithDetails.length > 0 ? cartWithDetails : cart).map((item) => (
                    <li key={item._id || item.id} className="py-6 flex">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
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
                      
                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <p className="text-gray-500">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-6">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                <p>Subtotal</p>
                <p>${parseFloat(totalPrice).toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 mb-2">
                <p>Shipping</p>
                <p>$0.00</p>
              </div>
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Total</p>
                <p>${parseFloat(totalPrice).toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
