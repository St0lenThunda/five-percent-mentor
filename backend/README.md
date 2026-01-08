# Five Percent Mentor Backend API

Express.js backend for the Five Percent Mentor knowledge system.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Add your environment variables to `.env`:
   - `DATABASE_URL` - Your Neon PostgreSQL connection string
   - `NEON_AUTH_URL` - Your Neon Auth service URL
   - `FRONTEND_URL` - Your frontend URL (for CORS)

4. Start the server:
   ```bash
   # Development (with auto-reload)
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Sign in with email/password
- `POST /api/auth/sign-out` - End session
- `GET /api/auth/session` - Get current session

### Progress Tracking
- `GET /api/progress/:userId` - Get user progress
- `POST /api/progress` - Create progress entry
- `DELETE /api/progress/:id` - Remove progress entry

### Journal
- `GET /api/journal/:userId` - Get user journal entries
- `POST /api/journal` - Create journal entry
- `PUT /api/journal/:id` - Update journal entry
- `DELETE /api/journal/:id` - Delete journal entry

### Attributes
- `GET /api/attributes/:userId` - Get user attributes
- `POST /api/attributes` - Create/update attribute
- `POST /api/attributes/:userId/log` - Log attribute completion

### Mastery Metrics
- `GET /api/mastery/:userId` - Get mastery metrics
- `POST /api/mastery` - Update mastery progress
- `PUT /api/mastery/:id` - Mark as mastered

## Deployment (Render)

See deployment instructions in the main project README.

---

**Peace.** ✊🏿
