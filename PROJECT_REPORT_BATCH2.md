# FOOD ORDERING WEBSITE - PROJECT REPORT
## Batch 2: Features, Database Structure & API Endpoints

---

## 6. DETAILED FEATURE IMPLEMENTATION

### 6.1 Customer Frontend Features

#### 6.1.1 Home Page Display System
**Implementation**: `frontend/src/components/FoodDisplay/FoodDisplay.jsx`

**Features**:
- **Curated Initial Display**: Shows 8 carefully selected items:
  - 1 highest-rated salad
  - 2-3 highest-rated rolls from different stalls
  - 3-4 other highest-rated items from various stalls
- **Progressive Loading**:
  - First "Explore More" click: Shows 8 more items (total 16)
  - Second "Explore More" click: Transitions to stalls section
- **Smart Categorization**: Items sorted by rating and total ratings count
- **Category Filtering**: Flexible category matching with mappings for variations

**Code Logic**:
```javascript
const getCuratedItems = () => {
  const sortedByRating = [...food_list].sort((a, b) => {
    const ratingA = a.averageRating || 0;
    const ratingB = b.averageRating || 0;
    if (ratingB !== ratingA) return ratingB - ratingA;
    return (b.totalRatings || 0) - (a.totalRatings || 0);
  });
  // Selects items ensuring diversity across stalls
}
```

#### 6.1.2 Stall-Specific Dashboard
**Implementation**: `frontend/src/pages/StallDashboard/StallDashboard.jsx`

**Features**:
- **Smart Menu Categorization**:
  - Salads
  - Rolls
  - Breads (Paranthas, Roti, Naan, etc.)
  - Curries (Choley, Subji, etc.)
  - Beverages (Tea, Coffee, Lassi, etc.)
  - Snacks (Samosa, Pakora, Sandwich, etc.)
  - Pasta & Noodles
  - Other
- **Collapsible Categories**: Categories hidden by default, expandable on click
- **Search Functionality**: Real-time search across item names, descriptions, and categories
- **Category Auto-Expansion**: When navigating from category filter, target category auto-expands
- **Rating Display**: Shows average rating and total ratings for each item

#### 6.1.3 Rating System
**Implementation**: `frontend/src/components/FoodItem/FoodItem.jsx`

**Features**:
- **Dynamic Star Display**:
  - Items with ratings: Shows filled/half/empty stars based on averageRating
  - Items without ratings: Shows empty stars with "No ratings" text
- **Real-time Updates**: Ratings update immediately after feedback submission
- **Visual Feedback**: Color-coded stars (orange for filled, gray for empty)

**Rating Calculation**:
```javascript
const renderStars = () => {
  if (averageRating === 0 || totalRatings === 0) {
    return <div>Empty stars + "No ratings"</div>;
  }
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.5;
  // Renders stars accordingly
}
```

#### 6.1.4 Feedback System
**Implementation**: `frontend/src/components/Feedback/Feedback.jsx`

**Features**:
- **Star Rating**: 1-5 star selection with hover effects
- **Text Feedback**: Optional text input for detailed feedback
- **Photo Upload**: Up to 5 photos per feedback
- **Photo Previews**: Real-time preview before submission
- **Validation**: Ensures rating is selected before submission

#### 6.1.5 Order Management
**Implementation**: `frontend/src/pages/MyOrders/MyOrders.jsx`

**Features**:
- **Order History**: Displays all user orders
- **Order Status Tracking**: Shows current status of each order
- **Feedback Integration**: "Rate" button for delivered items
- **Feedback Status Check**: Prevents duplicate feedback submissions

---

### 6.2 Stall Admin Panel Features

#### 6.2.1 Orders Management
**Implementation**: `StallAdmin/src/components/Orders/Orders.jsx`

**Features**:
- **Date-Based Organization**: Orders grouped by date (Today, Yesterday, or specific date)
- **Status-Based Grouping**: Within each date, orders grouped by:
  - Food Processing
  - Out for delivery
  - Delivered
- **Status Filter Tabs**: Filter orders by status (All, Processing, Out for delivery, Delivered)
- **Search Functionality**: Search by order ID, customer name, phone, or items
- **Statistics Dashboard**:
  - Total Revenue (all delivered orders)
  - Today's Revenue
  - Pending Orders count
  - Total Orders count
- **Order Details**:
  - Exact order date and time
  - Delivery time calculation (received time - order time)
  - Customer information
  - Item details with quantities
  - Feedback viewing for delivered orders
- **Status Management**:
  - Update order status via dropdown
  - Status locked after "Delivered"
  - Prevents further status changes

**Date Formatting**:
```javascript
const formatDateOnly = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString('en-IN', {...});
}
```

#### 6.2.2 Menu Management
**Implementation**: `StallAdmin/src/components/Menu/Menu.jsx`

**Features**:
- **Add New Items**: Form with name, description, price, category, image upload
- **Edit Existing Items**: 
  - Update name, price, description
  - Replace image (old image deleted)
  - Changes reflect immediately on frontend
- **Remove Items**: Delete items from menu
- **Rating Display**: Shows average rating and total ratings for each item
- **Auto-refresh**: Menu refreshes every 30 seconds to show updated ratings

#### 6.2.3 Dashboard
**Implementation**: `StallAdmin/src/components/Dashboard/Dashboard.jsx`

**Features**:
- **Key Statistics**:
  - Total Orders
  - Pending Orders
  - Menu Items count
  - Total Revenue
- **Visual Cards**: Color-coded statistics cards with icons
- **Real-time Updates**: Statistics update automatically

---

### 6.3 Main Admin Panel Features

#### 6.3.1 Food Management
**Implementation**: `Admin/src/components/pages/Add/Add.jsx` & `List/List.jsx`

**Features**:
- **Add Food Items**: Upload images, set details
- **List All Items**: View all food items in system
- **Edit/Remove**: Modify or delete items

#### 6.3.2 Order Management
**Implementation**: `Admin/src/components/pages/Orders/Orders.jsx`

**Features**:
- **View All Orders**: System-wide order overview
- **Status Updates**: Update order statuses
- **Order Details**: View complete order information

---

## 7. DATABASE STRUCTURE

### 7.1 User Model
**File**: `backend/models/userModel.js`

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  cartData: Object (default: {}),
  date: Date (default: Date.now)
}
```

**Purpose**: Stores customer account information and cart data

### 7.2 Food Model
**File**: `backend/models/foodModel.js`

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
  date: Date (default: Date.now)
}
```

**Purpose**: Stores food item information with ratings

**Key Features**:
- `stall` field links items to specific stalls
- `averageRating` and `totalRatings` updated automatically from feedback

### 7.3 Order Model
**File**: `backend/models/orderModel.js`

```javascript
{
  userId: ObjectId (ref: 'users'),
  items: [{
    itemId: ObjectId,
    name: String,
    quantity: Number,
    price: Number
  }],
  amount: Number (required),
  address: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    phone: String
  },
  status: String (default: 'Food Processing'),
  date: Date (default: Date.now),
  stalls: [String], // Array of stall names
  deliveryTime: Date // Set when status changes to 'Delivered'
}
```

**Purpose**: Stores order information with multi-stall support

**Key Features**:
- `stalls` array tracks which stalls are involved
- `deliveryTime` records when order is marked delivered

### 7.4 Stall Owner Model
**File**: `backend/models/stallOwnerModel.js`

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  stallName: String (required),
  phone: String (required),
  date: Date (default: Date.now)
}
```

**Purpose**: Stores stall owner account information

### 7.5 Feedback Model
**File**: `backend/models/feedbackModel.js`

```javascript
{
  userId: ObjectId (ref: 'users'),
  orderId: ObjectId (ref: 'orders'),
  itemId: ObjectId (ref: 'foods'),
  itemName: String,
  stallName: String,
  rating: Number (required, 1-5),
  text: String (optional),
  photos: [String], // Array of photo filenames
  date: Date (default: Date.now)
}
```

**Purpose**: Stores user feedback with ratings and photos

**Key Features**:
- Links feedback to specific order and item
- Supports multiple photos per feedback
- Used to calculate average ratings

---

## 8. API ENDPOINTS

### 8.1 User Routes (`/api/user`)
**File**: `backend/routes/userRoute.js`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| POST | `/tokenvalid` | Validate JWT token | Yes |
| GET | `/info` | Get user information | Yes |

### 8.2 Food Routes (`/api/food`)
**File**: `backend/routes/foodRoute.js`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/add` | Add new food item | Yes (Admin) |
| GET | `/list` | Get all food items | No |
| POST | `/remove` | Remove food item | Yes (Admin) |
| POST | `/add-stall-menus` | Bulk add stall menus | Yes (Admin) |
| PUT | `/update` | Update food item | Yes (Stall Owner) |

**Query Parameters**:
- `GET /list?stall=StallName`: Filter by stall

### 8.3 Cart Routes (`/api/cart`)
**File**: `backend/routes/cartRoute.js`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/add` | Add item to cart | Yes |
| POST | `/remove` | Remove item from cart | Yes |
| POST | `/get` | Get user's cart | Yes |

### 8.4 Order Routes (`/api/order`)
**File**: `backend/routes/orderRoute.js`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/place` | Place new order | Yes |
| POST | `/userorders` | Get user's orders | Yes |
| GET | `/list` | Get all orders (Admin) | Yes (Admin) |
| POST | `/status` | Update order status | Yes (Admin) |

### 8.5 Stall Owner Routes (`/api/stall-owner`)
**File**: `backend/routes/stallOwnerRoute.js`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register stall owner | No |
| POST | `/login` | Stall owner login | No |
| GET | `/info` | Get stall owner info | Yes (Stall Owner) |
| PUT | `/update` | Update stall owner info | Yes (Stall Owner) |

### 8.6 Stall Order Routes (`/api/stall`)
**File**: `backend/routes/stallOrderRoute.js`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/orders` | Get stall's orders | Yes (Stall Owner) |
| POST | `/update-status` | Update order status | Yes (Stall Owner) |

**Response Format**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "order_id",
      "stallItems": [...], // Items from this stall
      "stallTotal": 500.00, // Total for this stall
      "status": "Food Processing",
      "date": "2025-01-17T10:30:00Z",
      "deliveryTime": null,
      "address": {...}
    }
  ]
}
```

### 8.7 Feedback Routes (`/api/feedback`)
**File**: `backend/routes/feedbackRoute.js`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/add` | Submit feedback | Yes |
| GET | `/item/:itemId` | Get feedbacks for item | No |
| GET | `/stall/:stallName` | Get feedbacks for stall | No |
| GET | `/user/:userId` | Get user's feedbacks | Yes |
| GET | `/check` | Check if feedback exists | Yes |

**Request Format (POST /add)**:
- Content-Type: `multipart/form-data`
- Fields: `userId`, `orderId`, `itemId`, `itemName`, `stallName`, `rating`, `text`, `photos[]`

### 8.8 Rating Routes (`/api/rating`)
**File**: `backend/routes/ratingRoute.js`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/update-all` | Recalculate all ratings | Yes (Admin) |

**Note**: Ratings are automatically updated when feedback is submitted via `feedbackController.js`

---

## 9. AUTHENTICATION & AUTHORIZATION

### 9.1 User Authentication
**Implementation**: `backend/middleware/auth.js`

**Process**:
1. User registers/logs in
2. Server generates JWT token
3. Token stored in localStorage (frontend)
4. Token sent in request headers: `{ token: "jwt_token" }`
5. Middleware validates token and extracts user ID

**Token Structure**:
```javascript
{
  userId: "user_id",
  iat: timestamp,
  exp: expiration_timestamp
}
```

### 9.2 Stall Owner Authentication
**Implementation**: `backend/middleware/stallOwnerAuth.js`

**Process**:
- Similar to user authentication
- Separate token storage: `stallOwnerToken`
- Validates stall owner identity
- Ensures stall owner can only access their own data

### 9.3 Password Security
**Implementation**: `bcryptjs` hashing

**Process**:
- Passwords hashed with bcrypt (10 salt rounds)
- Original passwords never stored
- Login compares hashed password with input

---

## 10. FILE UPLOAD SYSTEM

### 10.1 Food Item Images
**Storage**: `backend/uploads/`
**Handler**: Multer middleware
**Configuration**:
- Single file upload
- Accepted formats: Images (jpg, png, etc.)
- Filename: Timestamp + original name

### 10.2 Feedback Photos
**Storage**: `backend/uploads/feedback/`
**Handler**: Multer middleware (multiple files)
**Configuration**:
- Multiple file upload (up to 5)
- Same image format restrictions
- Stored separately from food images

**Serving Static Files**:
```javascript
app.use("/images", express.static('uploads'));
app.use("/feedback-images", express.static('uploads/feedback'));
```

---

**End of Batch 2**

*Continue to Batch 3 for implementation details, connections, testing, and conclusion...*

