# TOMATO - Food Delivery Website 🍅

A complete food delivery website built with React.js frontend, Node.js backend, and MongoDB database. This project includes a customer-facing website, admin panel, and a robust backend API.

## 🚀 Features

- **Customer Frontend**: Browse food items, add to cart, place orders, and track order status
- **Admin Panel**: Manage food items, view orders, and handle restaurant operations
- **Backend API**: RESTful API with authentication, cart management, and order processing
- **Payment Integration**: Test payment system with card processing
- **Responsive Design**: Mobile-friendly interface for all devices

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- CSS3
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer for file uploads

### Admin Panel
- React.js
- Vite
- CSS3

## 📁 Project Structure

```
TOMATO - Food Delivery Website/
├── frontend/          # Customer-facing React app
├── backend/           # Node.js API server
├── Admin/            # Admin panel React app
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd "TOMATO - Food Delivery Website"
   ```

2. **Install dependencies for all parts**

   **Frontend:**
   ```bash
   cd frontend
   npm install
   ```

   **Backend:**
   ```bash
   cd ../backend
   npm install
   ```

   **Admin Panel:**
   ```bash
   cd ../Admin
   npm install
   ```

3. **Set up MongoDB**
   - Make sure MongoDB is running on your system
   - Update database connection in `backend/config/db.js` if needed

### 🏃‍♂️ Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run server
   ```
   The backend will run on `http://localhost:4000`

2. **Start the Frontend (Customer App)**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Start the Admin Panel**
   ```bash
   cd Admin
   npm run dev
   ```
   The admin panel will run on `http://localhost:5174`

## 💳 Test Payment Details

For testing payment functionality:
- **Card Number**: 4111 1111 1111 1111
- **Expiry Date**: 12/25 or any future date
- **CVV**: 123
- **Cardholder Name**: Test User
- **OTP**: Any number

## 📱 Usage

1. **Customer Experience**:
   - Browse food items on the homepage
   - Add items to cart
   - Login/Register to place orders
   - Track order status in "My Orders"

2. **Admin Experience**:
   - Login to admin panel
   - Add new food items with images
   - View and manage orders
   - Update order status

## 🔧 API Endpoints

The backend provides RESTful APIs for:
- User authentication and registration
- Food item management
- Cart operations
- Order processing and tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created with ❤️ for food delivery enthusiasts.

---

**Note**: This is a demo project for educational purposes. For production use, ensure proper security measures, environment variables, and database configurations.
