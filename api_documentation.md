
## API Endpoints

### Users

- `POST /api/users` - Register a new user
  ```json
  // Request
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- `POST /api/users/login` - User login
  ```json
  // Request
  {
    "email": "john@example.com",
    "password": "123456"
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- `GET /api/users/profile` - Get user profile (protected)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "phone": "1234567890",
    "address": "123 Main St"
  }
  ```

- `PUT /api/users/profile` - Update user profile (protected)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Request
  {
    "name": "John Updated",
    "email": "john@example.com",
    "password": "newpassword",
    "phone": "9876543210",
    "address": "456 New St"
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Updated",
    "email": "john@example.com",
    "isAdmin": false,
    "phone": "9876543210",
    "address": "456 New St",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

- `GET /api/users` - Get all users (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Response
  [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com",
      "isAdmin": false
    },
    {
      "_id": "60d21b4667d0d8992e610c86",
      "name": "Admin User",
      "email": "admin@example.com",
      "isAdmin": true
    }
  ]
  ```

- `GET /api/users/:id` - Get user by ID (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
  ```

- `PUT /api/users/:id` - Update user (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Request
  {
    "name": "John Modified",
    "email": "john@example.com",
    "isAdmin": true
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Modified",
    "email": "john@example.com",
    "isAdmin": true
  }
  ```

- `DELETE /api/users/:id` - Delete user (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Response
  {
    "message": "User removed"
  }
  ```

### Products

- `GET /api/products` - Get all products
  ```json
  // Query parameters
  // page=1 (optional)
  // keyword=phone (optional, for search)
  // category=60d21b4667d0d8992e610c85 (optional, filter by category ID)
  
  // Response
  {
    "products": [
      {
        "_id": "60d21b4667d0d8992e610c87",
        "name": "iPhone 12 Pro",
        "price": 999.99,
        "description": "Latest iPhone with A14 chip",
        "images": ["/uploads/iphone12pro.jpg"],
        "category": {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "Electronics"
        },
        "stock": 15,
        "rating": 4.5,
        "numReviews": 12,
        "featured": true,
        "discount": 10
      }
    ],
    "page": 1,
    "pages": 5,
    "count": 45
  }
  ```

- `GET /api/products/top` - Get top rated products
  ```json
  // Response
  [
    {
      "_id": "60d21b4667d0d8992e610c87",
      "name": "iPhone 12 Pro",
      "price": 999.99,
      "images": ["/uploads/iphone12pro.jpg"],
      "rating": 4.8,
      "numReviews": 12
    },
    {
      "_id": "60d21b4667d0d8992e610c88",
      "name": "Samsung Galaxy S21",
      "price": 899.99,
      "images": ["/uploads/galaxys21.jpg"],
      "rating": 4.7,
      "numReviews": 10
    }
  ]
  ```

- `GET /api/products/featured` - Get featured products
  ```json
  // Response
  [
    {
      "_id": "60d21b4667d0d8992e610c87",
      "name": "iPhone 12 Pro",
      "price": 999.99,
      "images": ["/uploads/iphone12pro.jpg"],
      "featured": true,
      "discount": 10
    },
    {
      "_id": "60d21b4667d0d8992e610c89",
      "name": "MacBook Pro",
      "price": 1299.99,
      "images": ["/uploads/macbookpro.jpg"],
      "featured": true,
      "discount": 15
    }
  ]
  ```

- `GET /api/products/:id` - Get product by ID
  ```json
  // Response
  {
    "_id": "60d21b4667d0d8992e610c87",
    "name": "iPhone 12 Pro",
    "price": 999.99,
    "description": "Latest iPhone with A14 chip",
    "images": ["/uploads/iphone12pro.jpg"],
    "category": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Electronics"
    },
    "stock": 15,
    "rating": 4.5,
    "numReviews": 12,
    "reviews": [
      {
        "_id": "60d21b4667d0d8992e610c90",
        "name": "John Doe",
        "rating": 4,
        "comment": "Great phone, but expensive",
        "user": "60d21b4667d0d8992e610c85",
        "createdAt": "2023-01-15T12:00:00.000Z"
      }
    ],
    "featured": true,
    "discount": 10
  }
  ```

- `POST /api/products` - Create a product (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Request
  {
    "name": "iPad Air",
    "price": 599.99,
    "description": "Latest iPad with A14 chip",
    "images": ["/uploads/ipadair.jpg"],
    "category": "60d21b4667d0d8992e610c85",
    "stock": 25,
    "featured": false,
    "discount": 0
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c91",
    "name": "iPad Air",
    "price": 599.99,
    "description": "Latest iPad with A14 chip",
    "images": ["/uploads/ipadair.jpg"],
    "category": "60d21b4667d0d8992e610c85",
    "stock": 25,
    "rating": 0,
    "numReviews": 0,
    "reviews": [],
    "featured": false,
    "discount": 0
  }
  ```

- `PUT /api/products/:id` - Update a product (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Request
  {
    "name": "iPad Air 4th Gen",
    "price": 649.99,
    "stock": 20,
    "featured": true
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c91",
    "name": "iPad Air 4th Gen",
    "price": 649.99,
    "description": "Latest iPad with A14 chip",
    "images": ["/uploads/ipadair.jpg"],
    "category": "60d21b4667d0d8992e610c85",
    "stock": 20,
    "rating": 0,
    "numReviews": 0,
    "reviews": [],
    "featured": true,
    "discount": 0
  }
  ```

- `DELETE /api/products/:id` - Delete a product (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Response
  {
    "message": "Product removed"
  }
  ```

- `POST /api/products/:id/reviews` - Create product review (protected)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Request
  {
    "rating": 5,
    "comment": "Excellent product, worth every penny!"
  }
  
  // Response
  {
    "message": "Review added"
  }
  ```

### Orders

- `POST /api/orders` - Create new order (protected)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Request
  {
    "orderItems": [
      {
        "product": "60d21b4667d0d8992e610c87",
        "name": "iPhone 12 Pro",
        "image": "/uploads/iphone12pro.jpg",
        "price": 999.99,
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02115",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "taxPrice": 100.00,
    "shippingPrice": 0.00,
    "totalPrice": 2099.98
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c92",
    "user": "60d21b4667d0d8992e610c85",
    "orderItems": [
      {
        "product": "60d21b4667d0d8992e610c87",
        "name": "iPhone 12 Pro",
        "image": "/uploads/iphone12pro.jpg",
        "price": 999.99,
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02115",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "taxPrice": 100.00,
    "shippingPrice": 0.00,
    "totalPrice": 2099.98,
    "isPaid": false,
    "isDelivered": false,
    "status": "Processing",
    "createdAt": "2023-01-15T12:00:00.000Z"
  }
  ```

- `GET /api/orders/myorders` - Get logged in user orders (protected)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Response
  [
    {
      "_id": "60d21b4667d0d8992e610c92",
      "user": "60d21b4667d0d8992e610c85",
      "totalPrice": 2099.98,
      "isPaid": true,
      "paidAt": "2023-01-15T14:00:00.000Z",
      "isDelivered": false,
      "status": "Paid",
      "createdAt": "2023-01-15T12:00:00.000Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c93",
      "user": "60d21b4667d0d8992e610c85",
      "totalPrice": 649.99,
      "isPaid": false,
      "isDelivered": false,
      "status": "Processing",
      "createdAt": "2023-01-16T12:00:00.000Z"
    }
  ]
  ```

- `GET /api/orders` - Get all orders (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Response
  [
    {
      "_id": "60d21b4667d0d8992e610c92",
      "user": {
        "id": "60d21b4667d0d8992e610c85",
        "name": "John Doe"
      },
      "totalPrice": 2099.98,
      "isPaid": true,
      "paidAt": "2023-01-15T14:00:00.000Z",
      "isDelivered": false,
      "status": "Paid",
      "createdAt": "2023-01-15T12:00:00.000Z"
    },
    {
      "_id": "60d21b4667d0d8992e610c94",
      "user": {
        "id": "60d21b4667d0d8992e610c86",
        "name": "Jane Smith"
      },
      "totalPrice": 1299.99,
      "isPaid": true,
      "paidAt": "2023-01-16T14:00:00.000Z",
      "isDelivered": true,
      "deliveredAt": "2023-01-18T12:00:00.000Z",
      "status": "Delivered",
      "createdAt": "2023-01-16T10:00:00.000Z"
    }
  ]
  ```

- `GET /api/orders/:id` - Get order by ID (protected)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c92",
    "user": {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "orderItems": [
      {
        "product": "60d21b4667d0d8992e610c87",
        "name": "iPhone 12 Pro",
        "image": "/uploads/iphone12pro.jpg",
        "price": 999.99,
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02115",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "paymentResult": {
      "id": "5O190127783361234",
      "status": "COMPLETED",
      "update_time": "2023-01-15T14:00:00Z",
      "email_address": "john@example.com"
    },
    "taxPrice": 100.00,
    "shippingPrice": 0.00,
    "totalPrice": 2099.98,
    "isPaid": true,
    "paidAt": "2023-01-15T14:00:00.000Z",
    "isDelivered": false,
    "status": "Paid",
    "createdAt": "2023-01-15T12:00:00.000Z"
  }
  ```

- `PUT /api/orders/:id/pay` - Update order to paid (protected)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Request
  {
    "id": "5O190127783361234",
    "status": "COMPLETED",
    "update_time": "2023-01-15T14:00:00Z",
    "payer": {
      "email_address": "john@example.com"
    }
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c92",
    "isPaid": true,
    "paidAt": "2023-01-15T14:00:00.000Z",
    "paymentResult": {
      "id": "5O190127783361234",
      "status": "COMPLETED",
      "update_time": "2023-01-15T14:00:00Z",
      "email_address": "john@example.com"
    },
    "status": "Paid"
    // Other order details...
  }
  ```

- `PUT /api/orders/:id/deliver` - Update order to delivered (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c92",
    "isDelivered": true,
    "deliveredAt": "2023-01-18T12:00:00.000Z",
    "status": "Delivered"
    // Other order details...
  }
  ```

- `PUT /api/orders/:id/status` - Update order status (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Request
  {
    "status": "Shipped"
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c92",
    "status": "Shipped"
    // Other order details...
  }
  ```

### Categories

- `GET /api/categories` - Get all categories
  ```json
  // Response
  [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "Electronics",
      "description": "Electronic devices and gadgets",
      "image": "/uploads/electronics.jpg"
    },
    {
      "_id": "60d21b4667d0d8992e610c95",
      "name": "Clothing",
      "description": "Fashion items and accessories",
      "image": "/uploads/clothing.jpg"
    }
  ]
  ```

- `GET /api/categories/:id` - Get category by ID
  ```json
  // Response
  {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "Electronics",
    "description": "Electronic devices and gadgets",
    "image": "/uploads/electronics.jpg"
  }
  ```

- `POST /api/categories` - Create a category (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Request
  {
    "name": "Home & Kitchen",
    "description": "Home appliances and kitchen items",
    "image": "/uploads/home-kitchen.jpg"
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c96",
    "name": "Home & Kitchen",
    "description": "Home appliances and kitchen items",
    "image": "/uploads/home-kitchen.jpg"
  }
  ```

- `PUT /api/categories/:id` - Update a category (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Request
  {
    "name": "Home & Kitchen Appliances",
    "description": "Updated description for home and kitchen items"
  }
  
  // Response
  {
    "_id": "60d21b4667d0d8992e610c96",
    "name": "Home & Kitchen Appliances",
    "description": "Updated description for home and kitchen items",
    "image": "/uploads/home-kitchen.jpg"
  }
  ```

- `DELETE /api/categories/:id` - Delete a category (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  
  // Response
  {
    "message": "Category removed"
  }
  ```

### File Upload

- `POST /api/upload` - Upload single image (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "multipart/form-data"
  }
  
  // Form Data
  {
    "image": [file] // Binary file data
  }
  
  // Response
  {
    "message": "Image uploaded successfully",
    "image": "/uploads/image-1642259200000.jpg"
  }
  ```

- `POST /api/upload/multiple` - Upload multiple images (admin only)
  ```json
  // Headers
  {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Content-Type": "multipart/form-data"
  }
  
  // Form Data
  {
    "images": [file1, file2, file3] // Multiple binary file data
  }
  
  // Response
  {
    "message": "Images uploaded successfully",
    "images": [
      "/uploads/image-1642259200001.jpg",
      "/uploads/image-1642259200002.jpg",
      "/uploads/image-1642259200003.jpg"
    ]
  }
  ```


