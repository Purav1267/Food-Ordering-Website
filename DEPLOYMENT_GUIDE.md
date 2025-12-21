# 🚀 Complete Deployment Guide

This guide will walk you through deploying your Food Ordering Website online.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Deployment Architecture](#deployment-architecture)
3. [Option 1: Free Deployment (Recommended for Start)](#option-1-free-deployment-recommended-for-start)
4. [Option 2: Professional Deployment](#option-2-professional-deployment)
5. [Step-by-Step Deployment](#step-by-step-deployment)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account (already have)
- ✅ MongoDB Atlas account (free tier available)
- ✅ Razorpay account (for payments)
- ✅ Domain name (optional, can use free subdomains)

---

## Deployment Architecture

Your application consists of 4 separate services:

1. **Backend API** (Node.js/Express) - Port 4000
2. **Frontend** (React/Vite) - Customer interface
3. **Admin Panel** (React/Vite) - Admin dashboard
4. **StallAdmin** (React/Vite) - Stall owner panel

**Recommended Setup:**
- Backend: Railway/Render (Free tier available)
- Frontend: Vercel/Netlify (Free, excellent for React)
- Admin & StallAdmin: Vercel/Netlify (Free)
- Database: MongoDB Atlas (Free tier: 512MB)

---

## Option 1: Free Deployment (Recommended for Start)

### Step 1: Set Up MongoDB Atlas (Database)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free (M0 cluster - 512MB free)
   - Create a new cluster (choose closest region)

2. **Configure Database**
   - Click "Connect" → "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
   - Replace `<password>` with your database password
   - Add database name: `mongodb+srv://...@cluster.mongodb.net/tomato?retryWrites=true&w=majority`
   - Click "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)

3. **Save Your Connection String**
   - You'll need this for backend deployment

---

### Step 2: Deploy Backend (Railway - Free Tier)

**Railway offers $5 free credit monthly (enough for small apps)**

1. **Sign Up for Railway**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository: `Food-Ordering-Website`

3. **Configure Backend Service**
   - Railway will auto-detect it's a Node.js app
   - Set **Root Directory**: `backend`
   - Set **Start Command**: `npm run server` (or `node server.js`)

4. **Add Environment Variables**
   Click "Variables" tab and add:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tomato?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   PORT=4000
   NODE_ENV=production
   ```

5. **Deploy**
   - Railway will automatically deploy
   - Wait for deployment to complete
   - Copy your backend URL (e.g., `https://your-app.railway.app`)

6. **Configure Static Files**
   - Railway serves files, but for production, consider using cloud storage (AWS S3) for images
   - For now, uploaded images will be stored on Railway (may be lost on redeploy)

---

### Step 3: Deploy Frontend (Vercel - Free)

1. **Sign Up for Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Set **Root Directory**: `frontend`
   - Framework Preset: **Vite**

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   - Go to "Settings" → "Environment Variables"
   - Add: `VITE_API_URL=https://your-backend-url.railway.app`
   - (You'll update this after backend is deployed)

5. **Update API URL in Code**
   Before deploying, update `frontend/src/context/StoreContext.jsx`:
   ```javascript
   // Change from:
   const url = "http://localhost:4000";
   
   // To:
   const url = import.meta.env.VITE_API_URL || "https://your-backend-url.railway.app";
   ```

6. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy
   - You'll get a URL like: `https://your-app.vercel.app`

---

### Step 4: Deploy Admin Panel (Vercel)

1. **Add Another Project in Vercel**
   - Click "Add New" → "Project"
   - Import same repository
   - Set **Root Directory**: `Admin`
   - Framework Preset: **Vite**

2. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Update API URL**
   Update `Admin/src/App.jsx`:
   ```javascript
   // Change from:
   const url = "http://localhost:4000"
   
   // To:
   const url = import.meta.env.VITE_API_URL || "https://your-backend-url.railway.app"
   ```

4. **Add Environment Variable**
   - `VITE_API_URL=https://your-backend-url.railway.app`

5. **Deploy**

---

### Step 5: Deploy StallAdmin (Vercel)

1. **Add Another Project in Vercel**
   - Same process as Admin
   - Set **Root Directory**: `StallAdmin`

2. **Update API URL**
   Update `StallAdmin/src/assets/assets.js` (or wherever URL is defined):
   ```javascript
   export const url = import.meta.env.VITE_API_URL || "https://your-backend-url.railway.app"
   ```

3. **Add Environment Variable**
   - `VITE_API_URL=https://your-backend-url.railway.app`

4. **Deploy**

---

## Option 2: Professional Deployment

### Using AWS/DigitalOcean

**AWS Setup:**
- **EC2** for backend (t2.micro free tier)
- **S3** for image storage
- **CloudFront** for CDN
- **Route 53** for domain

**DigitalOcean Setup:**
- **Droplet** ($6/month) for backend
- **Spaces** ($5/month) for file storage
- **App Platform** for frontend ($5/month)

---

## Step-by-Step Deployment

### Quick Deployment Checklist

#### Backend (Railway)
- [ ] Create Railway account
- [ ] Connect GitHub repo
- [ ] Set root directory: `backend`
- [ ] Add environment variables
- [ ] Deploy and get URL

#### Frontend (Vercel)
- [ ] Create Vercel account
- [ ] Import repo, set root: `frontend`
- [ ] Update `StoreContext.jsx` with backend URL
- [ ] Add environment variable
- [ ] Deploy

#### Admin (Vercel)
- [ ] Add new Vercel project
- [ ] Set root: `Admin`
- [ ] Update `App.jsx` with backend URL
- [ ] Deploy

#### StallAdmin (Vercel)
- [ ] Add new Vercel project
- [ ] Set root: `StallAdmin`
- [ ] Update URL in assets
- [ ] Deploy

---

## Post-Deployment Configuration

### 1. Update CORS in Backend

Update `backend/server.js`:
```javascript
app.use(cors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://your-admin.vercel.app',
    'https://your-stalladmin.vercel.app'
  ],
  credentials: true
}))
```

### 2. Update Razorpay Webhook URLs

In Razorpay Dashboard:
- Add webhook URL: `https://your-backend.railway.app/api/order/verify`

### 3. Configure Image Storage (Important!)

**Current Issue:** Images uploaded to Railway will be lost on redeploy.

**Solution Options:**

**Option A: Use Cloudinary (Free tier: 25GB)**
1. Sign up at https://cloudinary.com
2. Install: `npm install cloudinary multer-storage-cloudinary`
3. Update backend to use Cloudinary instead of local storage

**Option B: Use AWS S3**
1. Create S3 bucket
2. Install: `npm install aws-sdk multer-s3`
3. Configure S3 upload

**Option C: Use Railway Volume (Paid)**
- Railway offers persistent storage (paid feature)

### 4. Set Up Custom Domain (Optional)

**For Vercel:**
1. Go to project settings
2. Add your domain
3. Update DNS records as instructed

**For Railway:**
1. Go to project settings
2. Add custom domain
3. Update DNS

---

## Important Code Changes Before Deployment

### 1. Frontend - StoreContext.jsx
```javascript
// Change this:
const url = "http://localhost:4000";

// To this:
const url = import.meta.env.VITE_API_URL || "https://your-backend.railway.app";
```

### 2. Admin - App.jsx
```javascript
// Change this:
const url = "http://localhost:4000"

// To this:
const url = import.meta.env.VITE_API_URL || "https://your-backend.railway.app"
```

### 3. StallAdmin - assets.js
```javascript
// Change this:
export const url = "http://localhost:4000"

// To this:
export const url = import.meta.env.VITE_API_URL || "https://your-backend.railway.app"
```

### 4. Backend - server.js
```javascript
// Update CORS:
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'https://your-frontend.vercel.app',
    process.env.ADMIN_URL || 'https://your-admin.vercel.app',
    process.env.STALLADMIN_URL || 'https://your-stalladmin.vercel.app'
  ],
  credentials: true
}))
```

---

## Troubleshooting

### Backend Issues

**Problem: Database connection fails**
- Check MongoDB Atlas IP whitelist (should allow 0.0.0.0/0)
- Verify connection string in environment variables
- Check database user permissions

**Problem: Images not loading**
- Images are stored locally and lost on redeploy
- Implement cloud storage (Cloudinary/S3)

**Problem: CORS errors**
- Update CORS origin list in server.js
- Ensure frontend URLs are correct

### Frontend Issues

**Problem: API calls fail**
- Check environment variable `VITE_API_URL` is set
- Verify backend URL is correct
- Check browser console for errors

**Problem: Build fails**
- Check for import errors
- Verify all dependencies are in package.json
- Check Vite configuration

### General Issues

**Problem: Environment variables not working**
- Vercel: Variables must start with `VITE_` for frontend
- Railway: Check variable names match exactly
- Redeploy after adding variables

**Problem: Slow performance**
- Enable Vercel CDN (automatic)
- Optimize images
- Use production builds

---

## Cost Estimate (Free Tier)

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| Railway (Backend) | $5 credit/month | $5-20/month |
| Vercel (Frontend) | Unlimited | Free |
| MongoDB Atlas | 512MB free | $9/month (M10) |
| Cloudinary (Images) | 25GB free | $99/month |
| **Total** | **$0/month** | **$20-30/month** |

---

## Security Checklist

Before going live:
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Set secure CORS origins
- [ ] Use environment variables (never commit secrets)
- [ ] Enable MongoDB authentication
- [ ] Set up error logging
- [ ] Configure rate limiting
- [ ] Use production Razorpay keys

---

## Next Steps After Deployment

1. **Test All Features**
   - User registration/login
   - Food browsing
   - Cart functionality
   - Order placement
   - Payment processing
   - Admin panel access
   - Stall admin access

2. **Monitor Performance**
   - Set up error tracking (Sentry - free tier)
   - Monitor API response times
   - Check database usage

3. **Optimize**
   - Compress images
   - Enable caching
   - Optimize database queries

---

## Support Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

**Need Help?** Check the troubleshooting section or review the error logs in your deployment platform's dashboard.

**Last Updated**: January 2025

