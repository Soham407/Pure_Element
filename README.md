# Pure_element - Ayurvedic E-commerce Application

A full-stack e-commerce platform for Ayurvedic beauty and wellness products built with React, Node.js, Express, and Supabase.

## 🌿 Features

### Customer Features
- **Product Catalog**: Browse Ayurvedic beauty and wellness products
- **Category Filtering**: Filter products by categories (Hair Care, Skin Care, Body Care, Wellness, Gifting)
- **Product Search**: Search products by name and description
- **Shopping Cart**: Add, update, and remove items from cart
- **User Authentication**: Register and login functionality
- **User Profile**: Manage profile information and view order history
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS

### Admin Features
- **Product Management**: Create, edit, and delete products
- **Image Upload**: Upload product images to Supabase storage
- **Category Management**: Create and manage product categories
- **User Management**: View all registered users
- **Admin Dashboard**: Comprehensive admin interface

## 🛠️ Tech Stack

### Frontend
- **React.js** - User interface library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload middleware
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Database & Storage
- **Supabase** - PostgreSQL database with real-time features
- **Supabase Storage** - File storage for product images
- **Row Level Security (RLS)** - Database security policies

## 📁 Project Structure

```
pure-element-ecommerce/
├── backend/
│   ├── config/
│   │   └── supabase.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── cart.js
│   │   ├── profile.js
│   │   └── admin.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   └── layout/
│   │   ├── contexts/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   └── [other pages]
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pure-element-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the database schema (see Database Setup section)
   - Set up storage bucket for product images

4. **Configure environment variables**
   
   **Backend (.env)**
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   SUPABASE_ANON_KEY=your_anon_key
   JWT_SECRET=your_jwt_secret
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```
   
   **Frontend (.env)**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_anon_key
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

## 🗄️ Database Setup

### Tables Schema

The application uses the following Supabase tables:

1. **users** - User accounts and authentication
2. **categories** - Product categories
3. **products** - Product information
4. **carts** - User shopping carts
5. **cart_items** - Items in shopping carts
6. **orders** - Order information (for future expansion)
7. **order_items** - Order line items (for future expansion)

### Storage Setup

1. Create a storage bucket named `product-images`
2. Set up the following policies:
   - Public read access for product images
   - Admin-only write access for image uploads

## 🔐 Authentication & Authorization

- **JWT-based authentication** for secure user sessions
- **Role-based access control** (customer/admin roles)
- **Row Level Security (RLS)** policies in Supabase
- **Protected routes** for authenticated users
- **Admin-only routes** for administrative functions

## 🎨 UI/UX Features

- **Responsive design** that works on all devices
- **Modern UI** with Tailwind CSS
- **Loading states** and error handling
- **Toast notifications** for user feedback
- **Smooth animations** and transitions
- **Accessible design** following best practices

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:categoryId` - Get products by category
- `GET /api/products/search/:query` - Search products

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item quantity
- `DELETE /api/cart/remove/:itemId` - Remove item from cart

### Admin (Protected)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `POST /api/admin/upload-image` - Upload product image

## 🔧 Development

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run install-all` - Install dependencies for all projects

### Code Structure

- **Context API** for global state management (auth, cart)
- **Custom hooks** for reusable logic
- **Service layer** for API communication
- **Component-based architecture** with reusable components
- **Protected routes** for authentication
- **Error boundaries** for error handling

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)
1. Build the React app: `cd frontend && npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables

### Backend Deployment (Heroku/Railway/Render)
1. Deploy the `backend` folder
2. Configure environment variables
3. Ensure Supabase connection is working

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@pureelement.com or create an issue in the repository.

---

**Pure_element** - Bringing you the finest Ayurvedic beauty and wellness products! 🌿✨
