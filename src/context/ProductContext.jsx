import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:8000/api';

// Fallback product data in case API fails
const fallbackProducts = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 99.99,
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500',
    category: 'Electronics',
    stock: 15
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    description: 'Feature-packed smartwatch with health tracking, notifications, and apps.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=500',
    category: 'Electronics',
    stock: 10
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 89.99,
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=500',
    category: 'Footwear',
    stock: 20
  },
  {
    id: 4,
    name: 'Coffee Maker',
    price: 129.99,
    description: 'Programmable coffee maker with thermal carafe and auto-brew functionality.',
    image: 'https://images.unsplash.com/photo-1570288685369-f7305163d0e3?q=80&w=500',
    category: 'Home',
    stock: 8
  },
  {
    id: 5,
    name: 'Backpack',
    price: 59.99,
    description: 'Durable backpack with laptop compartment, water bottle pockets, and padded straps.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500',
    category: 'Accessories',
    stock: 25
  },
  {
    id: 6,
    name: 'Wireless Speaker',
    price: 79.99,
    description: 'Portable Bluetooth speaker with 360° sound and 12-hour battery life.',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=500',
    category: 'Electronics',
    stock: 12
  }
];

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  // Helper function to normalize IDs for consistency
  const normalizeId = (product) => {
    if (product) {
      // Ensure we have a consistent id property
      return {
        ...product,
        id: product._id || product.id
      };
    }
    return product;
  };

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const config = user?.token ? {
        headers: { Authorization: `Bearer ${user.token}` }
      } : {};
      
      const response = await axios.get(`${API_URL}/products`, config);
      
      // Handle different API response structures
      // If data is directly an array, use it; if it's nested (e.g., { data: [...] }), extract it
      const productsArray = Array.isArray(response.data) ? response.data : 
                          response.data.data || response.data.products || response.data.items || [];
      
      // Ensure consistent ID property for all products
      const normalizedProducts = productsArray.map(product => normalizeId(product));
      setProducts(normalizedProducts);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(normalizedProducts.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching products:', err);
      const errorMsg = err.response?.data?.message || 'Failed to fetch products. Please try again later.';
      setError(errorMsg);
      toast.error(errorMsg);
      setProducts(fallbackProducts);
      
      // Extract categories from fallback data
      const uniqueCategories = [...new Set(fallbackProducts.map(product => product.category))];
      setCategories(uniqueCategories);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setError(null);
      const config = user?.token ? {
        headers: { Authorization: `Bearer ${user.token}` }
      } : {};
      
      const { data } = await axios.get(`${API_URL}/categories`, config);
      // Handle both array of strings or array of objects with name property
      const categoryNames = Array.isArray(data) ? 
        (data[0]?.name ? data.map(cat => cat.name) : data) : [];
      
      setCategories(categoryNames);
    } catch (err) {
      console.error('Error fetching categories:', err);
      // If categories API fails, extract from products
      const uniqueCategories = [...new Set(products.map(product => product.category))];
      setCategories(uniqueCategories);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const getProduct = async (id) => {
    // Check if we already have the product in state
    const existingProduct = products.find(p => p._id === id || p.id === id || p.id === Number(id));
    
    // If in development mode or product exists and has complete data, use it
    if (existingProduct && Object.keys(existingProduct).length > 3) {
      return normalizeId(existingProduct);
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const config = user?.token ? {
        headers: { Authorization: `Bearer ${user.token}` }
      } : {};
      
      const { data } = await axios.get(`${API_URL}/products/${id}`, config);
      return normalizeId(data);
    } catch (err) {
      console.error(`Error fetching product ${id}:`, err);
      setError(err.response?.data?.message || 'Failed to fetch product details.');
      // Fallback to local data
      return normalizeId(products.find(product => 
        product._id === id || product.id === id || product.id === Number(id)
      ) || null);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if product is FormData (for file uploads)
      const isFormData = product instanceof FormData;
      
      const config = {
        headers: {
          // Don't set Content-Type for FormData, axios will set it with boundary
          ...(!isFormData && { 'Content-Type': 'application/json' }),
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const response = await axios.post(
        `${API_URL}/products`,
        product,
        config
      );
      
      const data = response.data;
      
      // Ensure consistent ID property
      const normalizedProduct = normalizeId(data);
      setProducts([...products, normalizedProduct]);
      
      // Update categories if needed
      if (!categories.includes(normalizedProduct.category)) {
        setCategories([...categories, normalizedProduct.category]);
      }
      
      toast.success('Product added successfully!');
      return normalizedProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      const errorMsg = 'Failed to add product. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if updatedProduct is FormData (for file uploads)
      const isFormData = updatedProduct instanceof FormData;
      
      const config = {
        headers: {
          // Don't set Content-Type for FormData, axios will set it with boundary
          ...(!isFormData && { 'Content-Type': 'application/json' }),
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const response = await axios.put(
        `${API_URL}/products/${id}`,
        updatedProduct,
        config
      );
      
      const data = response.data;
      
      // Ensure consistent ID property
      const normalizedProduct = normalizeId(data);
      
      // Update local state
      setProducts(products.map(product => 
        product._id === id || product.id === Number(id) ? normalizedProduct : product
      ));
      
      // Update categories
      fetchCategories();
      
      toast.success('Product updated successfully!');
      return normalizedProduct;
    } catch (err) {
      console.error(`Error updating product ${id}:`, err);
      const errorMsg = 'Failed to update product. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      await axios.delete(`${API_URL}/products/${id}`, config);
      
      // Update local state
      setProducts(products.filter(product => 
        product._id !== id && product.id !== Number(id)
      ));
      
      // Update categories
      fetchCategories();
      
      toast.success('Product deleted successfully');
      return { success: true, message: 'Product deleted successfully' };
    } catch (err) {
      console.error(`Error deleting product ${id}:`, err);
      const errorMsg = 'Failed to delete product. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = async (category) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!category || category === 'All') {
        return products;
      }
      
      // Option 1: Filter locally if we already have products
      if (products.length > 0) {
        return products.filter(product => product.category === category);
      }
      
      // Option 2: Fetch from API with category filter
      const { data } = await axios.get(`${API_URL}/products?category=${category}`);
      return data;
    } catch (err) {
      console.error(`Error fetching products by category ${category}:`, err);
      const errorMsg = 'Failed to fetch products by category.';
      setError(errorMsg);
      toast.error(errorMsg);
      // Fallback to local filtering
      return products.filter(product => product.category === category);
    } finally {
      setLoading(false);
    }
  };

  // Refresh products and categories when user changes
  useEffect(() => {
    if (user) {
      fetchProducts();
      fetchCategories();
    }
  }, [user]);

  const value = {
    products,
    categories,
    loading,
    error,
    fetchProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    // Reset error function for components to use
    resetError: () => setError(null)
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => useContext(ProductContext);
