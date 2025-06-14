import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  
  useEffect(() => {
    // Get order details from location state
    const orderInfo = location.state?.orderInfo;
    
    if (orderInfo) {
      setOrderDetails(orderInfo);
    } else if (!user) {
      // If no order info and not logged in, redirect
      navigate('/products');
    }
  }, [location, navigate, user]);
  
  // Use real order ID or generate a fallback for demo purposes
  const orderNumber = orderDetails?.orderId || orderDetails?.id || Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order #{orderNumber} has been confirmed.
        </p>
        
        {orderDetails && orderDetails.totalAmount && (
          <p className="text-gray-700 font-medium mb-2">
            Total amount: ${parseFloat(orderDetails.totalAmount).toFixed(2)}
          </p>
        )}
        
        <p className="text-gray-600 mb-6">
          You will receive an email confirmation shortly.
        </p>
        
        <div className="flex flex-col space-y-3">
          {user && (
            <Link
              to="/account/orders"
              className="border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-3"
            >
              View Your Orders
            </Link>
          )}
          <Link
            to="/products"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
