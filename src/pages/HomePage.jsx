import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

export default function HomePage() {
  const { products, categories, loading: productsLoading } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // If products are already loaded, use them
        if (products && products.length > 0 && !productsLoading) {
          // Use products with highest rating or marked as featured if available
          const featured = products
            .slice() // Create a copy to avoid modifying original array
            .sort((a, b) => (b.rating || 0) - (a.rating || 0)) // Handle missing rating
            .slice(0, 3);
          setFeaturedProducts(featured);
          setError(null);
        } else {
          // Otherwise, make an API call specifically for featured products
          try {
            const response = await axios.get('/api/products?featured=true&limit=3');
            // Ensure we have an array
            const featuredData = Array.isArray(response.data) ? response.data : 
                              response.data?.data || response.data?.products || [];
            setFeaturedProducts(featuredData);
            setError(null);
          } catch (apiError) {
            console.error('API call for featured products failed:', apiError);
            // Fallback to local products if available
            if (products && products.length > 0) {
              setFeaturedProducts(products.slice(0, 3));
            } else {
              setFeaturedProducts([]);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
        setError('Failed to load featured products');
        // Fallback to local products if available
        if (products && products.length > 0) {
          setFeaturedProducts(products.slice(0, 3));
        } else {
          setFeaturedProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, [products, productsLoading]);
  
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Welcome to ShopEasy
            </h1>
            <p className="mt-4 text-xl text-gray-300">
              Your one-stop shop for quality products at affordable prices.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                to="/products"
                className="inline-block rounded-md border border-transparent bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 md:py-4 md:px-10 md:text-lg"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured products section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Products</h2>
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Loading featured products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
          </div>
        ) : !featuredProducts || featuredProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No featured products available.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {Array.isArray(featuredProducts) ? featuredProducts.map((product) => (
              <ProductCard key={product?.id || product?._id || Math.random()} product={product} />
            )) : <p className="text-gray-500">Unable to display products.</p>}
          </div>
        )}
        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="text-base font-medium text-blue-600 hover:text-blue-800"
          >
            View all products &rarr;
          </Link>
        </div>
      </div>

      {/* Categories section */}
      <div className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Shop by Category</h2>
          {productsLoading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No categories available.</p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.slice(0, 3).map((category, index) => {
                // A set of placeholder images for categories
                const images = [
                  "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=500",
                  "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=500",
                  "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=500"
                ];
                
                return (
                  <div key={category} className="group relative overflow-hidden rounded-lg bg-white shadow">
                    <Link to={`/products?category=${category}`}>
                      <div className="aspect-w-3 aspect-h-2">
                        <img
                          src={images[index % images.length]}
                          alt={category}
                          className="h-64 w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900">{category}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {/* Explore our {category.toLowerCase()} collection */}
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-blue-700">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to start shopping?
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-blue-200">
                Create an account today and get access to exclusive deals and offers.
              </p>
              <div className="mt-8">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                  >
                    Sign up now
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="bg-blue-800 rounded-lg p-8">
                <blockquote>
                  <div>
                    <p className="text-xl font-medium text-white">
                      "ShopEasy has the best selection of products and the fastest shipping I've experienced. Highly recommended!"
                    </p>
                  </div>
                  <footer className="mt-4">
                    <p className="text-base font-medium text-blue-200">Sarah J., Happy Customer</p>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
