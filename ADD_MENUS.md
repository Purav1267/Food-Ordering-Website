# 📝 Adding Stall Menus Guide

This guide explains how to add menu items for different stalls in the system.

---

## 🎯 Methods to Add Menus

### Method 1: Using Script (Recommended) ⭐

**Best for**: Bulk menu additions, initial setup

**Steps**:
1. Ensure backend server is **NOT running**
2. Navigate to backend directory
3. Run the script:
   ```bash
   cd backend
   node scripts/addStallMenus.js
   ```

**Advantages**:
- ✅ Direct database insertion
- ✅ No server required
- ✅ Fast bulk operations
- ✅ Error handling included

---

### Method 2: Using API Endpoint

**Best for**: Adding menus programmatically, integration with other systems

**Prerequisites**:
- Backend server **MUST be running** (port 4000)
- Valid authentication (if required)

**API Endpoint**:
```
POST http://localhost:4000/api/food/add-stall-menus
Content-Type: application/json
```

**Request Body**:
```json
{
  "stallName": "Kathi Junction",
  "items": [
    {
      "name": "Aalu Roll",
      "price": 80,
      "category": "Rolls",
      "description": "Delicious potato roll with spices",
      "image": "1721329323168food_1.png"
    },
    {
      "name": "Chicken Roll",
      "price": 120,
      "category": "Rolls",
      "description": "Tender chicken wrapped in paratha",
      "image": "1721329323168food_2.png"
    }
  ]
}
```

**Using cURL**:
```bash
curl -X POST http://localhost:4000/api/food/add-stall-menus \
  -H "Content-Type: application/json" \
  -d '{
    "stallName": "Kathi Junction",
    "items": [...]
  }'
```

---

### Method 3: Using Admin Panel

**Best for**: Adding individual items, updating existing items

**Steps**:
1. Login to Admin Panel (http://localhost:5174)
2. Navigate to "Add Food" section
3. Fill in item details:
   - Name
   - Description
   - Price
   - Category
   - Stall assignment
   - Upload image
4. Click "Add" to save

---

## 📋 Pre-loaded Menu Items

### Kathi Junction (8 items)
- Aalu Roll
- Chicken Roll
- Soya Chaap Roll
- Egg Roll
- Double Egg Roll
- Peri Peri Chicken Roll
- Dbl Soya Chaap Roll
- Mutton Roll

### Old Rao Hotel (47 items)
- **Hot Beverages**: 13 items (Tea, Coffee, Latte, etc.)
- **Cold Beverages**: 8 items (Cold Coffee, Lassi, etc.)
- **Paranthas**: 12 items (6 regular + 6 with dahi)
- **Snacks**: 12 items (Samosa, Pakora, etc.)
- **Pakoras**: 2 items

### Other Stalls
- Menu items can be added using any of the methods above

---

## 📸 Image Management

### Initial Setup
- All items use **placeholder images** initially
- Default image: `1721329323168food_1.png`

### Updating Images
1. **Via Admin Panel**:
   - Go to "List Food" section
   - Click "Edit" on any item
   - Upload new image
   - Save changes

2. **Via API**:
   - Use `PUT /api/food/update` endpoint
   - Include image file in multipart/form-data

### Image Requirements
- **Format**: JPG, PNG, WebP
- **Size**: Recommended < 2MB
- **Dimensions**: Recommended 800x600px
- **Storage**: `backend/uploads/` directory

---

## ⚙️ Menu Item Schema

```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required),
  category: String (required),
  image: String (required),
  stall: String (optional),
  averageRating: Number (default: 0),
  totalRatings: Number (default: 0),
  isPaused: Boolean (default: false)
}
```

---

## 🔧 Troubleshooting

### Items Not Appearing
- ✅ Check if stall name matches exactly
- ✅ Verify backend server is running
- ✅ Check database connection
- ✅ Review console for errors

### Image Upload Issues
- ✅ Verify `uploads/` directory exists
- ✅ Check file permissions
- ✅ Ensure file size is within limits
- ✅ Verify image format is supported

### Duplicate Items
- ✅ Scripts check for existing items
- ✅ Duplicates are skipped automatically
- ✅ Check console output for skipped items

---

## 📝 Best Practices

1. **Use consistent naming** for categories
2. **Include detailed descriptions** for better UX
3. **Set appropriate prices** (include taxes if applicable)
4. **Use high-quality images** for better presentation
5. **Test items** after adding to ensure they appear correctly
6. **Update images** through admin panel for better quality

---

**Last Updated**: 2025

