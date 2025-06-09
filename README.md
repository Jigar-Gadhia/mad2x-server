# Mad2x - Backend API

This is the **backend API** for the Mad2x mobile app. Built with **Node.js**, **Express**, and **MongoDB**, it provides endpoints for user authentication, profile management, doctor listing, and profile picture upload.

👉 **Frontend Repo:** [Mad2x React Native App](https://github.com/Jigar-Gadhia/mad2x)

---

## 📦 Features

- 🔐 JWT-based user authentication (signup & signin)
- 👤 User profile get & update
- 🖼️ Profile picture upload (stored as binary in MongoDB)
- 🏥 Paginated doctor list endpoint
- 📄 RESTful Express API with proper middleware & error handling

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Multer (image upload)
- Bcryptjs (password hashing)
- Jsonwebtoken (JWT)
- CORS

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/mad2x-backend.git
cd mad2x-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure `.env`

Create a `.env` file in the root with the following:

```env
MONGO_URI=mongodb://localhost:27017/mad2x
JWT_SECRET=your_jwt_secret
```

### 4. Start the Server

```bash
node server.js
```

The server will run at:  
**`http://<your-ip>:5000/api`**

---

## 📑 API Endpoints

### 🔐 Auth

| Method | Endpoint                     | Description                     |
|--------|------------------------------|---------------------------------|
| POST   | `/auth/signup`               | Register a new user             |
| POST   | `/auth/signin`               | Authenticate user               |
| POST   | `/auth/forgot-password`      | Send reset link to email        |
| POST   | `/auth/reset-password`       | Reset password using token      |

---

### 👤 Profile

| Method | Endpoint                     | Description                  |
|--------|------------------------------|------------------------------|
| GET    | `/auth/profile`              | Fetch user profile           |
| POST   | `/auth/profile/update`       | Update profile + photo       |

> Accepts `multipart/form-data` for profile image upload  
> Image is stored as Buffer in MongoDB

---

### 🏥 Doctors

| Method | Endpoint                | Description                        |
|--------|-------------------------|------------------------------------|
| GET    | `/doctors`              | Get list of doctors (paginated)   |

> Supports query parameters:  
> `pageNumber` (default: 1), `pageSize` (default: 10)

📌 **Example request:**
```
GET /api/doctors?pageNumber=2&pageSize=5
```

📌 **Sample response:**
```json
{
  "pageNumber": 2,
  "pageSize": 5,
  "totalPages": 10,
  "totalDoctors": 50,
  "data": [
    {
      "_id": "...",
      "doctorName": "Dr. Aanya Patel",
      "specialityName": "Cardiologist",
      ...
    }
  ]
}
```

---

## 🧪 Sample `.env` File

```env
MONGO_URI=mongodb://localhost:27017/mad2x
JWT_SECRET=mySuperSecretKey123
```

---

## 🧑‍💻 Author

**Jigar Gadhia**  
React Native + Full Stack Developer  
email: jiggsgadhia@gmail.com

---

## 📜 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

> Feel free to star ⭐ the repo, fork 🍴 it, or open issues 🐞 for bugs and suggestions!
