# 🔐 Stall Owner Login Details

This document contains all stall owner login credentials for the Food Ordering Website.

---

## 📋 Quick Access

**Login URL**: http://localhost:5175

**Script to View All Logins**:
```bash
cd backend
node scripts/listAllStallLogins.js
```

---

## 👥 Current Stall Owners

| # | Stall Name | Owner | Email | Phone |
|---|------------|-------|-------|-------|
| 1 | Kathi Junction | Daksh | kathi@gmail.com | 9306969737 | password kathi
| 2 | Muskan Hotel | Tej | muskan@gmail.com | 9990337812 | password qazwsx
| 3 | Old Rao Hotel | Kanika | oldrao@gmail.com | 9896682685 | password qazwsx
| 4 | Shyaam Dhaba | Kuldeep | shyaamdhaba@gmail.com | 9896972051 | password qazwsx
| 5 | Smoothie Zone | Sandeep | smoothie@gmail.com | 9812237712 | password qazwsx

---

## 🔑 Password Information

⚠️ **Important**: Passwords are encrypted using bcrypt and cannot be retrieved from the database.

**Default Password** (for most stalls): `qazwsx`

### Password Reset Options

1. **Database Update**: Directly update password hash in MongoDB
2. **Registration**: Create a new account through registration page
3. **Password Reset Script**: Use backend script (if available)

---

## 📊 Summary

- **Total Active Stalls**: 5
- **Login Portal**: http://localhost:5175
- **Access Level**: Stall-specific (each owner can only manage their own stall)

---

**Note**: For security reasons, actual passwords are not stored in plain text. Use the script or database access to verify credentials.

