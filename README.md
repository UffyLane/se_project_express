# WTWR Express Backend

> **REST API for the What to Wear (WTWR) application.**

⚙️ **[Live API](https://wtwr-api-y96m.onrender.com)** | 🌤️ **[Frontend App](https://uffywtwr.vercel.app)**

---

## About

This is the backend API for WTWR — a weather-based clothing recommendation app. It handles user authentication, clothing item management, and profile data. Built with Node.js, Express, and MongoDB following MVC architecture.

---

## Live Deployment

- **Frontend:** https://uffywtwr.vercel.app
- **Backend API:** https://wtwr-api-y96m.onrender.com

> Note: Hosted on Render's free tier — first request may take ~50 seconds to wake up.

---

## Test Credentials

Use these to test authenticated endpoints:

- **Email:** test@wtwr.com
- **Password:** Test1234!

Or create your own account via `POST /signup`.

---

## Tech Stack

- Node.js + Express.js
- MongoDB + Mongoose
- JWT authentication
- bcrypt password hashing
- Celebrate / Joi input validation
- Winston logging
- Helmet security headers
- Rate limiting
- ESLint (Airbnb style)

---

## Project Structure

```
se_project_express/
│
├── controllers/
│   ├── clothingItems.js   # Item CRUD logic
│   └── users.js           # User auth and profile logic
│
├── models/
│   ├── clothingItem.js    # Mongoose schema for items
│   └── user.js            # Mongoose schema for users
│
├── routes/
│   ├── clothingItems.js
│   ├── users.js
│   └── index.js
│
├── middlewares/
│   ├── auth.js            # JWT verification
│   └── errorHandler.js    # Centralized error handling
│
├── utils/
│   └── errors.js          # Custom error constants
│
└── app.js
```

---

## Running Locally

```bash
git clone https://github.com/UffyLane/se_project_express.git
cd se_project_express
npm install
```

Create `.env`:
```
PORT=3001
MONGO_URI=mongodb://127.0.0.1:27017/wtwr_db
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

```bash
npm run dev
# server runs at http://localhost:3001
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | No | Create account |
| POST | `/signin` | No | Log in, receive JWT |

### Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/me` | Yes | Get current user |
| PATCH | `/users/me` | Yes | Update name and avatar |

### Clothing Items

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/items` | No | Get all clothing items |
| POST | `/items` | Yes | Add a clothing item |
| DELETE | `/items/:id` | Yes | Delete an item (owner only) |
| PUT | `/items/:id/likes` | Yes | Like an item |
| DELETE | `/items/:id/likes` | Yes | Remove like |

---

## Error Handling

| Status | Description |
|--------|-------------|
| 400 | Bad request — invalid input |
| 401 | Unauthorized — missing or invalid JWT |
| 403 | Forbidden — not the item owner |
| 404 | Not found |
| 409 | Conflict — email already exists |
| 500 | Internal server error |

---

## Security

- Passwords hashed with bcrypt
- JWT tokens for session management
- Helmet security headers
- Rate limiting on all routes
- Input validation with Celebrate/Joi
- `.orFail()` on Mongoose queries to prevent silent failures

---

## Author

**Stuart G. Clark Jr.**
[GitHub](https://github.com/UffyLane)

---

## License

MIT
