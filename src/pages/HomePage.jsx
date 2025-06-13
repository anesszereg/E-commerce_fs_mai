import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

export default function HomePage() {
  const { products } = useProducts();
  
  // Get featured products (first 3 products)
  const featuredProducts = products.slice(0, 3);
  
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
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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
          <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group relative overflow-hidden rounded-lg bg-white shadow">
              <Link to="/products">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=500"
                    alt="Electronics"
                    className="h-64 w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">Electronics</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Discover the latest gadgets and tech accessories
                  </p>
                </div>
              </Link>
            </div>

            <div className="group relative overflow-hidden rounded-lg bg-white shadow">
              <Link to="/products">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=500"
                    alt="Footwear"
                    className="h-64 w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">Footwear</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Step into comfort with our stylish footwear collection
                  </p>
                </div>
              </Link>
            </div>

            <div className="group relative overflow-hidden rounded-lg bg-white shadow">
              <Link to="/products">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=500"
                    alt="Accessories"
                    className="h-64 w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">Accessories</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Complete your look with our premium accessories
                  </p>
                </div>
              </Link>
            </div>
          </div>
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
