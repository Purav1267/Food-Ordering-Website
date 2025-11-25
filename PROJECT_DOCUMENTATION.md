# 🍅 TOMATO - Food Ordering Website
## Complete Project Documentation

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Tech Stack](#tech-stack)
4. [Installation & Setup](#installation--setup)
5. [Port Configuration](#port-configuration)
6. [Features](#features)
7. [User Roles & Access](#user-roles--access)
8. [API Endpoints](#api-endpoints)
9. [Database Schema](#database-schema)
10. [Deployment Guide](#deployment-guide)
11. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**TOMATO** is a comprehensive multi-stall food ordering platform that allows customers to order food from multiple restaurant stalls, with separate admin panels for system administrators and stall owners.

### Key Highlights
- **Multi-stall support**: Customers can order from multiple stalls in a single order
- **Role-based access**: Separate interfaces for customers, admins, and stall owners
- **Real-time order tracking**: Per-stall order status updates
- **Payment integration**: Razorpay payment gateway
- **Responsive design**: Mobile-first approach

---

## 🏗️ System Architecture

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

## 🛠️ Tech Stack

### Frontend (Customer)
- **Framework**: React.js 18+
- **Build Tool**: Vite
- **State Management**: Context API
- **Routing**: React Router DOM
- **Styling**: CSS3 with custom components
- **HTTP Client**: Axios

### Admin Panel
- **Framework**: React.js 18+
- **Build Tool**: Vite
- **UI Components**: Custom CSS components
- **Notifications**: React Toastify

### Stall Admin Panel
- **Framework**: React.js 18+
- **Build Tool**: Vite
- **Features**: Order management, menu management, pause/unpause items

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Payment**: Razorpay SDK

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager
- Git

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Food-Ordering-Website
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Install Admin Panel Dependencies**
   ```bash
   cd ../Admin
   npm install
   ```

5. **Install Stall Admin Dependencies**
   ```bash
   cd ../StallAdmin
   npm install
   ```

6. **Configure Environment Variables**
   
   Create `.env` file in `backend/` directory:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   PORT=4000
   ```

---

## 🔌 Port Configuration

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Backend API | 4000 | http://localhost:4000 | Express.js server |
| Frontend | 5173 | http://localhost:5173 | Customer interface |
| Admin Panel | 5174 | http://localhost:5174 | System admin panel |
| Stall Admin | 5175 | http://localhost:5175 | Stall owner panel |

### Starting All Services

**Option 1: Manual (Recommended for Development)**
```bash
# Terminal 1 - Backend
cd backend && npm run server

# Terminal 2 - Frontend
cd frontend && npm run dev

# Terminal 3 - Admin
cd Admin && npm run dev

# Terminal 4 - Stall Admin
cd StallAdmin && npm run dev
```

**Option 2: Using Background Processes**
```bash
# Start all services in background
cd backend && npm run server &
cd frontend && npm run dev &
cd Admin && npm run dev &
cd StallAdmin && npm run dev &
```

### Freeing Ports

If ports are in use:
```bash
# Kill all Node processes
pkill -f "node.*(server|start.js|vite)"

# Or kill specific ports
lsof -ti :4000 | xargs kill -9
lsof -ti :5173 | xargs kill -9
lsof -ti :5174 | xargs kill -9
lsof -ti :5175 | xargs kill -9
```

---

## ✨ Features

### Customer Features
- ✅ Browse food items by category
- ✅ Search functionality
- ✅ Filter by stall
- ✅ Add items to cart
- ✅ Promo code support (BML - 50% off)
- ✅ Multi-stall ordering
- ✅ Order tracking with per-stall status
- ✅ Order history
- ✅ User feedback and ratings
- ✅ Responsive design

### Admin Panel Features
- ✅ Food item management (Add, Edit, Delete)
- ✅ Image upload for food items
- ✅ Order management
- ✅ User management
- ✅ Stall management
- ✅ Category management

### Stall Admin Features
- ✅ View orders for their stall only
- ✅ Update order status (Food Processing → Out for delivery → Delivered)
- ✅ Menu management (Add, Edit, Remove items)
- ✅ Pause/Unpause food items
- ✅ Order statistics (Revenue, Pending orders)
- ✅ Search and filter orders
- ✅ View customer feedback

### System Features
- ✅ JWT-based authentication
- ✅ Secure password hashing (bcrypt)
- ✅ File upload handling
- ✅ Payment gateway integration
- ✅ Multi-stall order segregation
- ✅ Per-stall status tracking
- ✅ Real-time order updates

---

## 👥 User Roles & Access

### 1. Customer (Frontend)
- **Access**: http://localhost:5173
- **Features**: Browse, order, track orders
- **Registration**: Self-registration available

### 2. System Admin
- **Access**: http://localhost:5174
- **Features**: Full system management
- **Login**: Admin credentials required

### 3. Stall Owner
- **Access**: http://localhost:5175
- **Features**: Manage own stall's orders and menu
- **Login**: Stall-specific credentials

### Current Stall Owners

| Stall Name | Owner | Email | Phone |
|------------|-------|-------|-------|
| Kathi Junction | Daksh | kathi@gmail.com | 9306969737 |
| Muskan Hotel | Tej | muskan@gmail.com | 9990337812 |
| Old Rao Hotel | Kanika | oldrao@gmail.com | 9896682685 |
| Shyaam Dhaba | Kuldeep | shyaamdhaba@gmail.com | 9896972051 |
| Smoothie Zone | Sandeep | smoothie@gmail.com | 9812237712 |

**Note**: Passwords are encrypted. To view all stall logins, run:
```bash
cd backend
node scripts/listAllStallLogins.js
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/stallowner/login` - Stall owner login
- `POST /api/admin/login` - Admin login

### Food Items
- `GET /api/food/list` - Get all food items
- `POST /api/food/add` - Add food item (Admin)
- `PUT /api/food/update` - Update food item (Admin)
- `POST /api/food/remove` - Remove food item (Admin)
- `POST /api/food/toggle-pause` - Pause/Unpause item (Stall Admin)

### Cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/cart/get` - Get user's cart

### Orders
- `POST /api/order/placeorder` - Place new order
- `POST /api/order/userorders` - Get user's orders
- `POST /api/order/verify` - Verify payment

### Stall Orders
- `GET /api/stall/orders` - Get stall's orders (Stall Admin)
- `POST /api/stall/update-status` - Update order status (Stall Admin)

### Feedback
- `POST /api/feedback/add` - Add feedback
- `GET /api/feedback/item/:itemId` - Get item feedback
- `GET /api/feedback/check` - Check if feedback exists

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  cartData: Object,
  date: Date
}
```

### Food Model
```javascript
{
  name: String,
  description: String,
  price: Number,
  image: String,
  category: String,
  stall: String,
  averageRating: Number,
  totalRatings: Number,
  isPaused: Boolean
}
```

### Order Model
```javascript
{
  userId: String,
  items: Array,
  amount: Number,
  address: Object,
  status: String,
  date: Date,
  deliveryTime: Date,
  payment: Boolean,
  stalls: Array,
  stallStatuses: Object, // { "Stall Name": "Food Processing" }
  stallDeliveryTimes: Object, // { "Stall Name": Date }
  stallAcceptance: Object // { "Stall Name": "pending" | "accepted" | "rejected" }
}
```

### Stall Owner Model
```javascript
{
  name: String,
  email: String,
  password: String (hashed),
  phone: String,
  stallName: String,
  date: Date
}
```

### Feedback Model
```javascript
{
  userId: String,
  orderId: String,
  itemId: String,
  rating: Number,
  text: String,
  photos: Array,
  date: Date
}
```

---

## 🚀 Deployment Guide

### Backend Deployment
1. Set environment variables in production
2. Use process manager (PM2) for Node.js
3. Configure MongoDB Atlas connection
4. Set up SSL certificates
5. Configure CORS for production domains

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Update API URLs in environment variables
4. Configure routing for SPA

### Database
- Use MongoDB Atlas for cloud database
- Set up database backups
- Configure connection pooling
- Set up indexes for performance

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
- Ensure MongoDB is running
- Verify network connectivity

**3. Module Not Found**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**4. Image Upload Issues**
- Check `uploads/` directory permissions
- Verify Multer configuration
- Ensure file size limits are appropriate

**5. Payment Gateway Errors**
- Verify Razorpay credentials
- Check test mode settings
- Review payment logs

---

## 📝 Additional Notes

### Promo Codes
- **BML**: 50% discount on total order (including delivery fee)

### Order Status Flow
1. **Food Processing** → Order received, being prepared
2. **Out for delivery** → Order dispatched
3. **Delivered** → Order completed

### Pause/Unpause Feature
- Stall owners can pause items when ingredients are unavailable
- Paused items are hidden from customers
- Items can be resumed anytime

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review error logs in console
3. Verify environment variables
4. Check database connectivity

---

**Last Updated**: 2025
**Version**: 1.0.0
**Maintained By**: Development Team

