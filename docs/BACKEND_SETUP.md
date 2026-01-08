# Backend Setup & Deployment Guide

## 🔧 Local Development Setup

### Step 1: Configure Backend Environment

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Edit `backend/.env` and add your values:
   ```bash
   DATABASE_URL="your-neon-connection-string-here"
   NEON_AUTH_URL="your-neon-auth-url-here"
   PORT=3000
   FRONTEND_URL="http://localhost:5173"
   NODE_ENV="development"
   ```

### Step 2: Configure Frontend Environment

1. Navigate back to the root directory:
   ```bash
   cd ..
   ```

2. Edit `.env` in the root directory and set:
   ```bash
   VITE_API_URL="http://localhost:3000"
   ```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Step 4: Start Both Servers

You'll need **two terminal windows**:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Should show: `🌟 Five Percent Mentor API - Server running on port 3000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Should show: `Local: http://localhost:5173/`

---

## 🚀 Deploying to Render

### Step 1: Push Backend to GitHub

If your backend is in a subdirectory, you have two options:

**Option A: Deploy from subdirectory (Recommended)**
- Render can deploy from the `backend/` subdirectory
- During setup, specify `backend` as the root directory

**Option B: Separate repository**
- Create a new repo for just the backend
- Push the `backend/` folder contents to it

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

   | Setting | Value |
   |---------|-------|
   | **Name** | `five-percent-mentor-api` |
   | **Region** | Choose your preferred region |
   | **Root Directory** | `backend` (if deploying from subdirectory) |
   | **Environment** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | `Free` |

5. Click **Advanced** and add environment variables:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Neon database connection string |
   | `NEON_AUTH_URL` | Your Neon Auth service URL |
   | `FRONTEND_URL` | Your Netlify frontend URL (e.g., `https://your-app.netlify.app`) |
   | `NODE_ENV` | `production` |

6. Click **Create Web Service**

### Step 3: Wait for Deployment

Render will:
- Pull your code
- Run `npm install`
- Start your server with `npm start`
- Provide you with a URL like: `https://five-percent-mentor-api.onrender.com`

### Step 4: Update Frontend to Use Render Backend

1. Go to **Netlify Dashboard** → Your Site → **Site configuration** → **Environment variables**

2. Update/add `VITE_API_URL`:
   ```
   VITE_API_URL=https://your-render-api-url.onrender.com
   ```

3. Trigger a new Netlify deployment (it should auto-redeploy)

### Step 5: Verify Production Deployment

Test your API directly:
```bash
curl https://your-render-api-url.onrender.com/health
```

Should return:
```json
{
  "status": "operational",
  "message": "Knowledge is the foundation. Peace."
}
```

---

## 🧪 Testing the Full Stack

### Local Testing

1. Start both servers (backend + frontend)
2. Open `http://localhost:5173` in your browser
3. Open Developer Tools → Network tab
4. Try to sign in or sign up
5. Check that API requests go to `http://localhost:3000/api/*`
6. Verify data persists after refresh

### Production Testing

1. Visit your Netlify URL
2. Open Developer Tools → Network tab
3. Sign up with a new account
4. Verify API calls go to your Render backend URL
5. Create some journal entries, complete quizzes
6. Sign out and sign back in
7. Confirm data persistence

---

## 🔥 Troubleshooting

### Backend won't start

**Error:** `DATABASE_URL environment variable is required`
- Solution: Check that `backend/.env` exists and has `DATABASE_URL` set

**Port 3000 already in use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Frontend can't reach backend

**Error:** `Failed to fetch` or CORS errors
- Check backend is running on port 3000
- Verify `VITE_API_URL` is set in frontend `.env`
- Check browser console for the exact API URL being called

### Render deployment fails

**Build fails:**
- Check Render logs for the exact error
- Verify `package.json` exists in the backend directory
- Ensure all dependencies are in `dependencies`, not `devDependencies`

**App crashes after deployment:**
- Check Render logs
- Verify all environment variables are set
- Ensure `DATABASE_URL` is valid

### Authentication not working

**Session not persisting:**
- Check that `FRONTEND_URL` in backend matches your actual frontend URL
- Verify CORS is configured correctly
- Check browser cookies (auth service may use cookies)

---

**Peace.** ✊🏿
