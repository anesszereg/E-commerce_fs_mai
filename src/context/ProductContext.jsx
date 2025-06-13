import { createContext, useState, useContext, useEffect } from 'react';

// Sample product data
const initialProducts = [
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
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    setCategories(uniqueCategories);
    
    // In a real app, you would fetch products from an API here
  }, []);

  const getProduct = (id) => {
    return products.find(product => product.id === Number(id)) || null;
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
    };
    setProducts([...products, newProduct]);
    
    // Update categories if needed
    if (!categories.includes(product.category)) {
      setCategories([...categories, product.category]);
    }
    
    return newProduct;
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(product => 
      product.id === Number(id) ? { ...product, ...updatedProduct } : product
    ));
    
    // Update categories
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    setCategories(uniqueCategories);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== Number(id)));
    
    // Update categories
    const remainingProducts = products.filter(product => product.id !== Number(id));
    const uniqueCategories = [...new Set(remainingProducts.map(product => product.category))];
    setCategories(uniqueCategories);
  };

  const getProductsByCategory = (category) => {
    if (!category || category === 'All') {
      return products;
    }
    return products.filter(product => product.category === category);
  };

  const value = {
    products,
    categories,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => useContext(ProductContext);
