# Full-Stack Deployment Guide (Render)

## 🏗️ Architecture: The Monolith Pattern

This project is configured as a **unified monolith** for production. The Express server (`backend/`) performs two roles on Render:
1. **API Provider**: Handles all requests to `/api/*`.
2. **Static File Server**: Serves the built Vue application from the `dist/` folder.

This approach eliminates CORS issues, simplifies SSL/domain management, and provides a single URL for the entire application.

---

## 🔧 Local Development Setup

### Step 1: Configure Environment

1. **Backend** (`backend/.env`):
   ```bash
   DATABASE_URL="your-neon-connection-string"
   NEON_AUTH_URL="your-neon-auth-url"
   PORT=3000
   NODE_ENV="development"
   ```

2. **Frontend** (`.env`):
   ```bash
   # Defaults to http://localhost:3000/api in development
   VITE_API_URL="http://localhost:3000/api"
   ```

### Step 2: Start Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

---

## 🚀 Unified Deployment to Render

### Step 1: Push Everything to GitHub

The project structure is ready for Render to build both parts from the root directory.

### Step 2: Create Render Web Service

1. Go to [render.com](https://render.com)
2. Click **New +** → **Web Service**
3. Connect your repository
4. Use these settings:

   | Setting | Value |
   |---------|-------|
   | **Name** | `five-percent-mentor` |
   | **Environment** | `Node` |
   | **Root Directory** | `(Leave empty)` |
   | **Build Command** | `npm install && npm run build && cd backend && npm install` |
   | **Start Command** | `cd backend && node server.js` |

5. **Advanced Settings (Environment Variables)**:
   - `DATABASE_URL`: Your Neon connection string
   - `NEON_AUTH_URL`: Your Neon Auth URL (e.g. `https://xxx.neonauth.us-east-1.aws.neon.tech`)
   - `NODE_ENV`: `production`

6. Click **Create Web Service**

### Step 3: Verification

Once deployed, visit your Render URL (e.g., `https://five-percent-mentor.onrender.com`).
- The UI should load automatically.
- API requests will go to the same domain via relative `/api` paths.

---

## 🧪 Testing the Production Build Locally

To test exactly how it will run on Render:

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   cd backend
   NODE_ENV=production node server.js
   ```

3. **Visit**: `http://localhost:3000`

---

**Peace.** ✊🏿
