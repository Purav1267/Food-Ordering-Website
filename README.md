# 🍅 TOMATO - Multi-Stall Food Ordering Platform

A comprehensive food ordering website that allows customers to order from multiple restaurant stalls in a single order. Built with React.js, Node.js, Express.js, and MongoDB.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Port Configuration](#-port-configuration)
- [User Roles & Access](#-user-roles--access)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Configuration](#-configuration)
- [Payment Integration](#-payment-integration)
- [Troubleshooting](#-troubleshooting)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**TOMATO** is a full-stack food ordering platform designed for multi-stall operations. The system supports:

- **Multi-stall ordering**: Customers can order from multiple stalls in a single transaction
- **Role-based access**: Separate interfaces for customers, system admins, and stall owners
- **Real-time tracking**: Per-stall order status updates
- **Payment gateway**: Integrated Razorpay for secure payments
- **Responsive design**: Mobile-first approach for all devices

### System Architecture

```
┌─────────────────┐
│   Frontend      │  Port: 5173 (Customer Interface)
│   (React + Vite)│
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
┌────────▼────────┐  ┌─────▼──────┐
│   Admin Panel   │  │ Stall Admin│
│   Port: 5174    │  │ Port: 5175 │
└────────┬────────┘  └─────┬───────┘
         │                 │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │  Backend API   │  Port: 4000
         │  (Express.js)  │
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │    MongoDB      │  Database
         └─────────────────┘
```

---

## ✨ Key Features

### 👤 Customer Features
- ✅ Browse food items by category and stall
- ✅ Search and filter functionality
- ✅ Add items to cart with quantity management
- ✅ Promo code support (BML - 50% discount)
- ✅ Multi-stall ordering in single transaction
- ✅ Real-time order tracking with per-stall status
- ✅ Order history with detailed information
- ✅ User feedback and rating system with photo uploads
- ✅ Responsive design for mobile, tablet, and desktop
- ✅ Floating cart button on all pages
- ✅ Paused items automatically hidden

### 🔧 Admin Panel Features
- ✅ Food item management (Add, Edit, Delete)
- ✅ Image upload for food items
- ✅ Order management and oversight
- ✅ User management dashboard
- ✅ Stall management
- ✅ Category management
- ✅ System-wide statistics

### 🏪 Stall Admin Features
- ✅ View orders specific to their stall only
- ✅ Update order status (Food Processing → Out for delivery → Delivered)
- ✅ Menu management (Add, Edit, Remove items)
- ✅ Pause/Unpause food items when ingredients unavailable
- ✅ Order statistics (Revenue, Pending orders)
- ✅ Search and filter orders
- ✅ View customer feedback and ratings
- ✅ Dashboard with revenue analytics

### 🔐 System Features
- ✅ JWT-based authentication for all user types
- ✅ Secure password hashing with bcrypt
- ✅ File upload handling with Multer
- ✅ Razorpay payment gateway integration
- ✅ Multi-stall order segregation
- ✅ Per-stall status tracking
- ✅ Real-time order updates via polling
- ✅ CORS configuration for cross-origin requests

---

## 🛠️ Tech Stack

### Frontend (Customer)
- **Framework**: React.js 18.3.1
- **Build Tool**: Vite 5.3.1
- **State Management**: Context API
- **Routing**: React Router DOM 6.24.1
- **HTTP Client**: Axios 1.7.2
- **Styling**: CSS3 with custom components

### Admin Panel
- **Framework**: React.js 18.3.1
- **Build Tool**: Vite 5.3.1
- **Notifications**: React Toastify 10.0.5
- **Routing**: React Router DOM 6.24.1

### Stall Admin Panel
- **Framework**: React.js 18.3.1
- **Build Tool**: Vite 5.3.1
- **Notifications**: React Toastify 10.0.5
- **Routing**: React Router DOM 6.24.1

### Backend
- **Runtime**: Node.js (v16+)
- **Framework**: Express.js 4.19.2
- **Database**: MongoDB with Mongoose 8.5.0
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcrypt 6.0.0, bcryptjs 3.0.3
- **File Upload**: Multer 1.4.5-lts.1
- **Payment**: Razorpay SDK 2.9.4
- **Validation**: validator 13.12.0
- **Environment**: dotenv 16.4.5
- **CORS**: cors 2.8.5

---

## 📁 Project Structure

```
Food-Ordering-Website/
├── frontend/                 # Customer-facing React app
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── Header/
│   │   │   ├── Navbar/
│   │   │   ├── FoodDisplay/
│   │   │   ├── FoodItem/
│   │   │   ├── Cart/
│   │   │   ├── LoginPopup/
│   │   │   └── Feedback/
│   │   ├── pages/           # Page components
│   │   │   ├── Home/
│   │   │   ├── Cart/
│   │   │   ├── PlaceOrder/
│   │   │   ├── MyOrders/
│   │   │   ├── StallDashboard/
│   │   │   └── Verify/
│   │   ├── context/         # Context API
│   │   │   └── StoreContext.jsx
│   │   └── assets/         # Images and static files
│   ├── public/
│   └── package.json
│
├── Admin/                   # System Admin Panel
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   └── pages/
│   │   │       ├── Add/     # Add food items
│   │   │       ├── List/    # List all items
│   │   │       ├── Orders/  # Order management
│   │   │       ├── Stalls/  # Stall management
│   │   │       └── Users/   # User management
│   │   └── assets/
│   └── package.json
│
├── StallAdmin/              # Stall Owner Panel
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar/
│   │   │   ├── Login/
│   │   │   ├── Dashboard/   # Revenue and stats
│   │   │   ├── Menu/        # Menu management
│   │   │   └── Orders/      # Order management
│   │   └── App.jsx
│   └── package.json
│
├── backend/                 # Node.js API Server
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/        # Business logic
│   │   ├── userController.js
│   │   ├── foodController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── stallOwnerController.js
│   │   ├── stallOrderController.js
│   │   ├── feedbackController.js
│   │   └── ratingController.js
│   ├── models/             # Mongoose schemas
│   │   ├── userModel.js
│   │   ├── foodModel.js
│   │   ├── orderModel.js
│   │   ├── stallOwnerModel.js
│   │   └── feedbackModel.js
│   ├── routes/             # API routes
│   │   ├── userRoute.js
│   │   ├── foodRoute.js
│   │   ├── cartRoute.js
│   │   ├── orderRoute.js
│   │   ├── stallOwnerRoute.js
│   │   ├── stallOrderRoute.js
│   │   ├── feedbackRoute.js
│   │   └── ratingRoute.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js         # User JWT auth
│   │   └── stallOwnerAuth.js # Stall owner JWT auth
│   ├── uploads/            # File uploads
│   │   └── feedback/      # Feedback photos
│   ├── scripts/            # Utility scripts
│   │   ├── addStallMenus.js
│   │   ├── connectStalls.js
│   │   └── ...
│   ├── server.js           # Express server
│   ├── start.js            # Server entry point
│   └── package.json
│
├── PROJECT_DOCUMENTATION.md    # Complete documentation
├── DOCUMENTATION_INDEX.md       # Documentation index
├── PORTS_INFO.md               # Port configuration guide
├── STALL_LOGIN_DETAILS.md      # Stall owner credentials
├── ADD_MENUS.md                # Menu addition guide
└── README.md                   # This file
```

---

## 📦 Installation

### Prerequisites

- **Node.js**: v16.0.0 or higher
- **MongoDB**: Local installation or MongoDB Atlas account
- **npm** or **yarn**: Package manager
- **Git**: Version control

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd Food-Ordering-Website
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Install Admin Panel Dependencies**
   ```bash
   cd Admin
   npm install
   cd ..
   ```

5. **Install Stall Admin Dependencies**
   ```bash
   cd StallAdmin
   npm install
   cd ..
   ```

6. **Configure Environment Variables**

   Create a `.env` file in the `backend/` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/tomato
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

   JWT_SECRET=your_super_secret_jwt_key_here
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   PORT=4000
   ```

7. **Set up MongoDB**
   - **Local**: Ensure MongoDB is running on your system
   - **Atlas**: Update `MONGODB_URI` in `.env` with your connection string

---

## 🚀 Running the Application

### Start All Services

You need to run 4 services simultaneously. Open 4 separate terminal windows:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run server
```
Backend will run on `http://localhost:4000`

**Terminal 2 - Frontend (Customer):**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

**Terminal 3 - Admin Panel:**
```bash
cd Admin
npm run dev
```
Admin panel will run on `http://localhost:5174`

**Terminal 4 - Stall Admin:**
```bash
cd StallAdmin
npm run dev
```
Stall admin will run on `http://localhost:5175`

### Quick Start Script (Optional)

You can create a script to start all services at once, but it's recommended to use separate terminals for better debugging.

---

## 🔌 Port Configuration

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| **Backend API** | 4000 | http://localhost:4000 | Express.js server |
| **Frontend** | 5173 | http://localhost:5173 | Customer interface |
| **Admin Panel** | 5174 | http://localhost:5174 | System admin panel |
| **Stall Admin** | 5175 | http://localhost:5175 | Stall owner panel |

### Freeing Ports

If ports are already in use:

```bash
# Kill all Node processes
pkill -f "node.*(server|start.js|vite)"

# Or kill specific ports
lsof -ti :4000 | xargs kill -9
lsof -ti :5173 | xargs kill -9
lsof -ti :5174 | xargs kill -9
lsof -ti :5175 | xargs kill -9
```

For detailed port management, see [PORTS_INFO.md](./PORTS_INFO.md).

---

## 👥 User Roles & Access

### 1. Customer (Frontend)
- **URL**: http://localhost:5173
- **Features**: Browse, add to cart, place orders, track orders, give feedback
- **Registration**: Self-registration available
- **Access**: Public (login required for orders)

### 2. System Admin
- **URL**: http://localhost:5174
- **Features**: Full system management, food items, orders, users, stalls
- **Login**: Admin credentials required
- **Access**: Restricted to admin users

### 3. Stall Owner
- **URL**: http://localhost:5175
- **Features**: Manage own stall's orders, menu, pause items, view feedback
- **Login**: Stall-specific credentials
- **Access**: Each owner can only manage their own stall

### Current Stalls

| Stall Name | Owner | Email |
|------------|-------|-------|
| Kathi Junction | Daksh | kathi@gmail.com |
| Muskan Hotel | Tej | muskan@gmail.com |
| Old Rao Hotel | Kanika | oldrao@gmail.com |
| Shyaam Dhaba | Kuldeep | shyaamdhaba@gmail.com |
| Smoothie Zone | Sandeep | smoothie@gmail.com |

For detailed login credentials, see [STALL_LOGIN_DETAILS.md](./STALL_LOGIN_DETAILS.md).

---

## 🔌 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/tokenvalid` - Validate JWT token
- `POST /api/stallowner/login` - Stall owner login
- `POST /api/admin/login` - Admin login

### Food Items
- `GET /api/food/list` - Get all food items
- `POST /api/food/add` - Add food item (Admin only)
- `PUT /api/food/update` - Update food item (Admin only)
- `POST /api/food/remove` - Remove food item (Admin only)
- `POST /api/food/toggle-pause` - Pause/Unpause item (Stall Admin only)

### Cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/get` - Get user's cart

### Orders
- `POST /api/order/placeorder` - Place new order
- `POST /api/order/userorders` - Get user's orders
- `POST /api/order/verify` - Verify Razorpay payment

### Stall Orders
- `GET /api/stall/orders` - Get stall's orders (Stall Admin only)
- `POST /api/stall/update-status` - Update order status (Stall Admin only)

### Feedback
- `POST /api/feedback/add` - Add feedback with rating
- `GET /api/feedback/item/:itemId` - Get item feedback
- `GET /api/feedback/check` - Check if feedback exists

For complete API documentation, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  cartData: Object (default: {})
}
```

### Food Model
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  image: String (required),
  category: String (required),
  stall: String (optional),
  averageRating: Number (default: 0),
  totalRatings: Number (default: 0),
  isPaused: Boolean (default: false)
}
```

### Order Model
```javascript
{
  userId: String (required),
  items: Array (required), // [{itemId, name, quantity, price, stall}]
  amount: Number (required),
  address: Object (required),
  status: String (default: "Food Processing"),
  date: Date (default: Date.now),
  deliveryTime: Date (nullable),
  payment: Boolean (default: false),
  stalls: Array (default: []), // Array of stall names
  stallStatuses: Object (default: {}), // { "Stall Name": "Food Processing" }
  stallDeliveryTimes: Object (default: {}) // { "Stall Name": Date }
}
```

### Stall Owner Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  stallName: String (required, unique),
  phone: String (optional),
  createdAt: Date (default: Date.now)
}
```

### Feedback Model
```javascript
{
  userId: String (required),
  orderId: String (required),
  itemId: String (required),
  itemName: String (required),
  stallName: String (optional),
  rating: Number (required, min: 1, max: 5),
  text: String (optional),
  photos: Array (default: []),
  date: Date (default: Date.now)
}
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in `backend/` directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/tomato

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Razorpay (get from Razorpay dashboard)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Server Port
PORT=4000
```

### Frontend Configuration

Update API base URL in `frontend/src/context/StoreContext.jsx`:
```javascript
const url = "http://localhost:4000";
```

### Admin Panel Configuration

Update API base URL in admin panel components if needed.

---

## 💳 Payment Integration

### Razorpay Setup

1. **Create Razorpay Account**
   - Sign up at https://razorpay.com
   - Get your Key ID and Key Secret from dashboard

2. **Configure Environment Variables**
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_key_here
   ```

3. **Test Mode**
   - Use test credentials for development
   - Test card: `4111 1111 1111 1111`
   - Any future expiry date and CVV

### Payment Flow

1. User places order → Order created in database
2. Razorpay order created → Payment modal shown
3. User completes payment → Payment verified
4. Order status updated → Payment confirmed
5. If payment fails → Order deleted automatically

For detailed payment integration, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).

---

## 🔧 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Find and kill process
lsof -ti :PORT_NUMBER | xargs kill -9
```

**2. MongoDB Connection Error**
- Check MongoDB URI in `.env`
- Ensure MongoDB is running locally
- Verify network connectivity for Atlas
- Check firewall settings

**3. Module Not Found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**4. Image Upload Issues**
- Check `backend/uploads/` directory exists
- Verify directory permissions
- Check Multer configuration
- Ensure file size limits are appropriate

**5. Payment Gateway Errors**
- Verify Razorpay credentials in `.env`
- Check test mode settings
- Review payment logs in console
- Ensure backend is accessible from frontend

**6. CORS Errors**
- Verify CORS configuration in `backend/server.js`
- Check if backend URL matches frontend API calls
- Ensure all origins are whitelisted

**7. Authentication Issues**
- Verify JWT_SECRET is set in `.env`
- Check token expiration
- Ensure tokens are being sent in headers
- Review middleware authentication logic

For more troubleshooting, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md).

---

## 📚 Documentation

This project includes comprehensive documentation:

- **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)** - Complete project documentation
- **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Documentation index and quick reference
- **[PORTS_INFO.md](./PORTS_INFO.md)** - Port configuration and management
- **[STALL_LOGIN_DETAILS.md](./STALL_LOGIN_DETAILS.md)** - Stall owner login credentials
- **[ADD_MENUS.md](./ADD_MENUS.md)** - Guide for adding menu items
- **[IMPROVEMENTS_SUGGESTIONS.md](./IMPROVEMENTS_SUGGESTIONS.md)** - Future improvement suggestions

---

## 🎯 Key Features Explained

### Multi-Stall Ordering
- Customers can add items from different stalls to a single cart
- Order is automatically grouped by stall
- Each stall receives their portion of the order
- Per-stall status tracking for better management

### Promo Code System
- Promo code: **BML** - 50% discount
- Applied at cart level
- Discount calculated on total (including delivery fee)
- Can be removed before checkout

### Pause/Unpause Feature
- Stall owners can pause items when ingredients unavailable
- Paused items are hidden from customers automatically
- Items can be resumed anytime
- Real-time updates across all interfaces

### Order Status Flow
1. **Food Processing** → Order received, being prepared
2. **Out for delivery** → Order dispatched
3. **Delivered** → Order completed (status locked)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test all changes thoroughly
- Ensure no breaking changes

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

Created with ❤️ for food delivery enthusiasts.

---

## 🙏 Acknowledgments

- React.js community
- Express.js team
- MongoDB team
- Razorpay for payment integration
- All contributors and testers

---

## 📞 Support

For issues, questions, or contributions:
1. Check the [documentation](./DOCUMENTATION_INDEX.md)
2. Review [troubleshooting section](#-troubleshooting)
3. Check existing issues on GitHub
4. Create a new issue with detailed information

---

## 🚀 Future Enhancements

See [IMPROVEMENTS_SUGGESTIONS.md](./IMPROVEMENTS_SUGGESTIONS.md) for a comprehensive list of suggested improvements including:
- Real-time notifications
- Advanced analytics
- Mobile apps
- Delivery tracking
- And 25+ more suggestions

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Active Development

---

<div align="center">

**⭐ If you find this project helpful, please give it a star! ⭐**

Made with ❤️ using React, Node.js, and MongoDB

</div>
