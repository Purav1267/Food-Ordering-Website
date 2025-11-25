# FOOD ORDERING WEBSITE - PROJECT REPORT
## Batch 1: Introduction, Overview, Architecture & Tech Stack

---

## 1. INTRODUCTION

### 1.1 Project Overview
The Food Ordering Website is a comprehensive multi-vendor food delivery platform that enables customers to browse, order, and track food items from multiple stalls. The system includes separate dashboards for customers, main administrators, and individual stall owners, providing a complete ecosystem for food ordering and management.

### 1.2 Project Objectives
- Provide a user-friendly interface for customers to browse and order food items
- Enable multiple food stalls to manage their menus and orders independently
- Implement a robust feedback and rating system for food items
- Create separate administrative panels for main admin and stall owners
- Ensure real-time order tracking and status updates
- Implement secure authentication and authorization systems

### 1.3 Scope of the Project
The project encompasses:
- **Customer Frontend**: React-based web application for browsing, ordering, and tracking
- **Main Admin Panel**: Administrative interface for overall system management
- **Stall Admin Panel**: Individual dashboard for each stall owner to manage their menu and orders
- **Backend API**: RESTful API server handling all business logic, authentication, and data management
- **Database**: MongoDB database storing users, food items, orders, feedback, and ratings

---

## 2. SYSTEM ARCHITECTURE

### 2.1 Overall Architecture
The system follows a **three-tier architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
├─────────────────────────────────────────────────────────────┤
│  Customer Frontend  │  Main Admin Panel  │  Stall Admin    │
│  (React + Vite)     │  (React + Vite)     │  (React + Vite) │
│  Port: 5173         │  Port: 5174         │  Port: 5175     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
├─────────────────────────────────────────────────────────────┤
│              Backend API Server (Node.js + Express)          │
│                        Port: 4000                            │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │  │Controllers│  │Middleware│  │  Models  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                               │
├─────────────────────────────────────────────────────────────┤
│                    MongoDB Database                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │  Foods   │  │  Orders  │  │ Feedback │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Component Architecture

#### 2.2.1 Frontend Architecture (Customer App)
- **Framework**: React 18.3.1 with Vite
- **State Management**: React Context API (StoreContext)
- **Routing**: React Router DOM v6.24.1
- **HTTP Client**: Axios v1.7.2
- **Structure**:
  ```
  frontend/
  ├── src/
  │   ├── components/        # Reusable UI components
  │   │   ├── FoodItem/     # Individual food item card
  │   │   ├── FoodDisplay/  # Food items grid display
  │   │   ├── Header/       # Hero section
  │   │   ├── Navbar/       # Navigation bar
  │   │   ├── Footer/       # Footer component
  │   │   ├── ExploreMenu/  # Category/stall explorer
  │   │   ├── LoginPopup/   # Authentication modal
  │   │   └── Feedback/     # Feedback submission modal
  │   ├── pages/            # Page components
  │   │   ├── Home/         # Homepage
  │   │   ├── Cart/         # Shopping cart
  │   │   ├── PlaceOrder/   # Order placement
  │   │   ├── MyOrders/     # Order history
  │   │   ├── Verify/       # Payment verification
  │   │   └── StallDashboard/ # Stall-specific menu
  │   ├── context/          # Context providers
  │   │   └── StoreContext.jsx
  │   └── assets/           # Static assets
  ```

#### 2.2.2 Backend Architecture
- **Runtime**: Node.js
- **Framework**: Express.js v4.19.2
- **Database**: MongoDB with Mongoose v8.5.0
- **Structure**:
  ```
  backend/
  ├── config/              # Configuration files
  │   └── db.js           # Database connection
  ├── controllers/        # Business logic
  │   ├── userController.js
  │   ├── foodController.js
  │   ├── cartController.js
  │   ├── orderController.js
  │   ├── stallOwnerController.js
  │   ├── stallOrderController.js
  │   ├── feedbackController.js
  │   └── ratingController.js
  ├── models/             # Database schemas
  │   ├── userModel.js
  │   ├── foodModel.js
  │   ├── orderModel.js
  │   ├── stallOwnerModel.js
  │   └── feedbackModel.js
  ├── routes/             # API route definitions
  │   ├── userRoute.js
  │   ├── foodRoute.js
  │   ├── cartRoute.js
  │   ├── orderRoute.js
  │   ├── stallOwnerRoute.js
  │   ├── stallOrderRoute.js
  │   ├── feedbackRoute.js
  │   └── ratingRoute.js
  ├── middleware/         # Custom middleware
  │   ├── auth.js         # User authentication
  │   └── stallOwnerAuth.js # Stall owner authentication
  ├── uploads/           # File uploads directory
  │   ├── images/        # Food item images
  │   └── feedback/      # Feedback photos
  └── scripts/           # Utility scripts
      ├── addStallMenus.js
      └── connectStallToAccount.js
  ```

#### 2.2.3 Admin Panel Architecture
- **Main Admin Panel** (Port 5174):
  - Food item management (Add, Edit, Remove)
  - Order management and status updates
  - User management

- **Stall Admin Panel** (Port 5175):
  - Stall-specific order management
  - Menu item management (CRUD operations)
  - Order status updates
  - Feedback viewing
  - Revenue and statistics dashboard

---

## 3. TECHNOLOGY STACK

### 3.1 Frontend Technologies

#### 3.1.1 Customer Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| React Router DOM | 6.24.1 | Client-side routing |
| Vite | 5.3.1 | Build tool and dev server |
| Axios | 1.7.2 | HTTP client for API calls |
| CSS3 | - | Styling and animations |

#### 3.1.2 Admin Panels
- **Main Admin**: React 18.3.1, Vite 5.3.1
- **Stall Admin**: React 18.3.1, Vite 5.3.1, React Router DOM 6.24.1

### 3.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v25+ | JavaScript runtime |
| Express.js | 4.19.2 | Web framework |
| MongoDB | Latest | NoSQL database |
| Mongoose | 8.5.0 | ODM for MongoDB |
| JWT (jsonwebtoken) | 9.0.2 | Authentication tokens |
| bcryptjs | 3.0.3 | Password hashing |
| Multer | 1.4.5-lts.1 | File upload handling |
| Razorpay | 2.9.4 | Payment gateway integration |
| CORS | 2.8.5 | Cross-origin resource sharing |
| dotenv | 16.4.5 | Environment variables |

### 3.3 Development Tools

| Tool | Purpose |
|------|---------|
| Nodemon | 3.1.4 | Auto-restart server on changes |
| ESLint | 8.57.0 | Code linting |
| Git | - | Version control |

### 3.4 Database
- **MongoDB**: Document-based NoSQL database
- **Collections**:
  - `users`: Customer accounts
  - `foods`: Food items with ratings
  - `orders`: Order records
  - `stallowners`: Stall owner accounts
  - `feedbacks`: User feedback and ratings

---

## 4. PROJECT STRUCTURE

### 4.1 Directory Structure
```
Food-Ordering-Website/
├── frontend/              # Customer-facing React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # Context providers
│   │   └── assets/       # Images, icons, data
│   ├── package.json
│   └── vite.config.js
│
├── backend/              # Node.js API server
│   ├── config/          # Configuration
│   ├── controllers/     # Business logic
│   ├── models/          # Database schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── uploads/         # File storage
│   ├── scripts/         # Utility scripts
│   ├── server.js        # Entry point
│   └── package.json
│
├── Admin/               # Main admin panel
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── package.json
│
├── StallAdmin/          # Stall owner admin panel
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── Orders/
│   │   │   ├── Menu/
│   │   │   ├── Login/
│   │   │   └── Navbar/
│   └── package.json
│
└── README.md
```

### 4.2 Port Configuration
- **Backend API**: `http://localhost:4000`
- **Customer Frontend**: `http://localhost:5173`
- **Main Admin Panel**: `http://localhost:5174`
- **Stall Admin Panel**: `http://localhost:5175`

---

## 5. KEY FEATURES OVERVIEW

### 5.1 Customer Features
1. **Food Browsing**
   - Curated home page display (8 items initially)
   - Category-based filtering
   - Stall-specific menu viewing
   - Search functionality
   - Progressive item loading ("Explore More")

2. **Ordering System**
   - Shopping cart management
   - Multiple stall support
   - Order placement with address
   - Payment integration (Razorpay)
   - Order tracking

3. **Feedback & Ratings**
   - Star ratings (1-5)
   - Text feedback
   - Photo uploads (up to 5 images)
   - Real-time rating updates

### 5.2 Stall Owner Features
1. **Order Management**
   - Date and status-based organization
   - Order status updates (Processing → Out for delivery → Delivered)
   - Customer information display
   - Delivery time calculation
   - Feedback viewing

2. **Menu Management**
   - Add new food items
   - Edit existing items (name, price, image)
   - Remove items
   - View ratings and feedback

3. **Dashboard**
   - Revenue statistics
   - Order counts
   - Pending orders tracking

### 5.3 Main Admin Features
1. **Food Management**
   - Add/Edit/Remove food items
   - Image uploads
   - Category assignment

2. **Order Management**
   - View all orders
   - Update order status
   - System-wide oversight

---

**End of Batch 1**

*Continue to Batch 2 for detailed feature implementation, database structure, and API endpoints...*

