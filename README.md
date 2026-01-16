# 🧥 WTWR Express Backend

This is the **backend API** for the *What to Wear (WTWR)* application — a Node.js and Express server that manages user data and clothing items.  
It provides endpoints for creating, reading, updating (likes), and deleting clothing items, as well as managing user profiles.

---

## 🌐 Live Deployment

**Frontend:**
https://uffywtwr.twilightparadox.com 

**Backend API:** 
https://api.uffywtwr.twilightparadox.com









## ⚙️ Tech Stack

- **Node.js** + **Express.js** — Server framewok 
- **MongoDB** + **Mongoose** — Database and ODM
- **ESLint (Airbnb style)** + **Prettier** — Code quality and formatting
- **Nodemon** — Auto-reload for development 
- **CORS Middleware** — Cross-origin requests 
- **Validator.js** — Data validation 
- **RESTful API Principles**

---

## 📁 Project Structure

se_project_express/
│
├── controllers/
│ ├── clothingItems.js
│ └── users.js
│
├── models/
│ ├── clothingItem.js
│ └── user.js
│
├── routes/
│ ├── clothingItems.js
│ ├── users.js
│ └── index.js
│
├── utils/
│ └── errors.js
│
├── app.js
├── .eslintrc.json
├── package.json
└── README.md


---

## 🚀 Getting Started

### 1. Clone the Repository

git clone https://github.com/UffyLane/se_project_express.git
cd se_project_express


### Install Dependencies 

npm install
npm start

server runs on : 👉 http://localhost:3001


### MongoDB Setup

mongodb://127.0.0.1:27017/wtwr_db


### API Endpoints

 👕 Clothing Items

| Method     | Endpoint           | Description                |
| ---------- | ------------------ | -------------------------- |
| **GET**    | `/items`           | Get all clothing items     |
| **POST**   | `/items`           | Create a new clothing item |
| **DELETE** | `/items/:id`       | Delete an item by ID       |
| **PUT**    | `/items/:id/likes` | Like an item               |
| **DELETE** | `/items/:id/likes` | Remove like from an item   |

🧍 Users

| Method   | Endpoint     | Description       |
| -------- | ------------ | ----------------- |
| **GET**  | `/users`     | Get all users     |
| **POST** | `/users`     | Create a new user |
| **GET**  | `/users/:id` | Get a user by ID  |





### 🧩 Example Requests & Responses

➕ Create a Clothing Item 

Request:

POST /items
Content-Type: application/json

 Body:

{
  "name": "Blue Hoodie",
  "weather": "cold",
  "imageUrl": "https://example.com/hoodie.png"
}


 Response:

{
  "_id": "6731e54f22a839dc02b4f987",
  "name": "Blue Hoodie",
  "weather": "cold",
  "imageUrl": "https://example.com/hoodie.png",
  "likes": [],
  "owner": "000000000000000000000001",
  "createdAt": "2025-11-05T08:30:00.000Z"
}

🧾 Get All Clothing Items

Request:

GET /items


Response: 

[
  {
    "_id": "6731e54f22a839dc02b4f987",
    "name": "Hoodie",
    "weather": "cold",
    "imageUrl": "https://example.com/hoodie.png",
    "likes": [],
    "owner": "000000000000000000000001",
    "createdAt": "2025-11-05T08:30:00.000Z"
  },
  {
    "_id": "6731e54f22a839dc02b4f988",
    "name": "Cap",
    "weather": "hot",
    "imageUrl": "https://example.com/cap.png",
    "likes": ["000000000000000000000001"],
    "owner": "000000000000000000000001",
    "createdAt": "2025-11-05T09:00:00.000Z"
  }
]

❤️ Like a Clothing Item

Request: 

PUT /items/6731e54f22a839dc02b4f987/likes


Response:

{
  "_id": "6731e54f22a839dc02b4f987",
  "name": "Hoodie",
  "weather": "cold",
  "likes": ["000000000000000000000001"],
  "owner": "000000000000000000000001",
  "imageUrl": "https://example.com/hoodie.png"
}


💔 Remove Like from a Clothing Item

Request:

DELETE /items/6731e54f22a839dc02b4f987/likes

Response:

{
  "_id": "6731e54f22a839dc02b4f987",
  "name": "Hoodie",
  "weather": "cold",
  "likes": [],
  "owner": "000000000000000000000001",
  "imageUrl": "https://example.com/hoodie.png"
}

➕ Create a User

Request:

POST /users
Content-Type: application/json


Body:

{
  "name": "Stuart Clark",
  "avatar": "https://example.com/avatar.jpg"
}


Response:

{
  "_id": "6731e52a22a839dc02b4f123",
  "name": "Stuart Clark",
  "avatar": "https://example.com/avatar.jpg",
  "__v": 0
}

👀 Get All Users

Request:

GET /users


Response:

[
  {
    "_id": "6731e52a22a839dc02b4f123",
    "name": "Stuart Clark",
    "avatar": "https://example.com/avatar.jpg"
  },
  {
    "_id": "6731e52a22a839dc02b4f124",
    "name": "Sarah Green",
    "avatar": "https://example.com/sarah.png"
  }
]

🔎 Get User by ID

Request:

GET /users/6731e52a22a839dc02b4f123


Response:

{
  "_id": "6731e52a22a839dc02b4f123",
  "name": "Stuart Clark",
  "avatar": "https://example.com/avatar.jpg"
}



### 🚨 Error Handling

| Status Code | Constant                | Description                    |
| ----------- | ----------------------- | ------------------------------ |
| **400**     | `BAD_REQUEST`           | Invalid input data             |
| **401**     | `UNAUTHORIZED`          | Missing or invalid credentials |
| **403**     | `FORBIDDEN`             | Access not allowed             |
| **404**     | `NOT_FOUND`             | Resource not found             |
| **500**     | `INTERNAL_SERVER_ERROR` | Server error                   |


### ✨ Linting & Code Quality

Run ESLint: npx eslint .

### Configuration Highlights

"no-console": ["warn", { "allow": ["warn", "error"] }],
"no-underscore-dangle": ["error", { "allow": ["_id"] }]


### Key Features

Organized MVC architecture

Centralized error constants

Input validation for URLs, IDs, and required fields

Uses .orFail() for Mongoose not-found safety

Ready for future integration with authentication

## Project Pitch Video
 
https://www.loom.com/share/d30f15893be24955837064d420180e12

### 👤 Author

Stuart G. Clark Jr.
📍 Developer & Creator of WTWR Express Backend
🗓️ 2025
