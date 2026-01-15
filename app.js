require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const { errors } = require("celebrate");

const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const rateLimiter = require("./middlewares/rateLimiter");
const app = express();
const { PORT = 3001 } = process.env;

// MongoDB URL
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wtwr_db";

// ---------- CORS ----------
const allowedOrigins = [
  "http://localhost:3000",
  "http://uffywtwr.twilightparadox.com",
  "https://uffywtwr.twilightparadox.com",
];

app.use(
  cors({
    origin(origin, callback) {
      // allow non-browser tools like Postman/curl (no Origin header)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ---------- Standard Middleware ----------
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "img-src": ["'self'", "data:", "https:"],
      },
    },
  })
);

app.use(express.json());
app.use(rateLimiter);

// Prevent favicon 401
app.get("/favicon.ico", (_req, res) => res.sendStatus(204));

// Simple health check (optional)
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// ---------- DB CONNECTION ----------
mongoose
  .connect(MONGO_URI)
  .then(() => console.warn("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// ---------- LOGGING: request FIRST ----------
app.use(requestLogger);

// ---------- Crash Test (required for review) ----------
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// ---------- ROUTES ----------
app.use(routes);

// ---------- LOGGING: errors AFTER routes ----------
app.use(errorLogger);

// ---------- CELEBRATE VALIDATION ERRORS ----------
app.use(errors());

// ---------- CUSTOM ERROR HANDLER ----------
app.use(errorHandler);

// ---------- START SERVER ----------
app.listen(PORT, "127.0.0.1", () => {
  console.warn(`🚀 Backend running at http://127.0.0.1:${PORT}`);
});

module.exports = app;

