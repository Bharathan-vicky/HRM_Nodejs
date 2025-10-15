# 🧭 HRM Software – Location-based Employee Attendance Management System

## 📘 Overview

This project is a **Human Resource Management (HRM)** backend API that enables **Admins** to manage employees and **Employees** to mark attendance with real-time geolocation tracking.  
The system ensures secure, modular design and proper documentation through **Swagger UI**, deployed using **Render**.

---

## 🧩 Features

### 👤 User Authentication
- Register and Login APIs  
- Role-based Access Control (**Admin**, **Employee**)  
- **JWT Authentication** (Access & Refresh Tokens)  
- Password hashing with **bcrypt**

### 🧑‍💼 Employee Management (Admin only)
- Create, Update, Delete Employees  
- Set Office Location (latitude, longitude, radius in meters)  
- Paginated & Searchable Employee List  

### 🕒 Attendance Management
#### Employee Side:
- Check-In / Check-Out with live geolocation  
- Location validated using **Haversine Formula**  
- View attendance history with pagination  

#### Admin Side:
- View all attendance records with filters (date, employee, department)  
- Daily summary: present, absent, late entries  
- Export attendance reports in **JSON / CSV**

### ⚙️ General APIs
- Get Profile (both roles)  
- Dashboard Summary  
  - Admin → Total employees, attendance summary  
  - Employee → Personal stats  

---

## 🛠️ Tech Stack

| Component | Technology |
|------------|-------------|
| Backend Framework | Node.js + Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT (Access + Refresh Tokens) |
| Validation | Joi / express-validator |
| Password Hashing | bcrypt |
| Geolocation Validation | Haversine formula / geolib npm package |
| Deployment | Render |
| Documentation | Swagger UI |

---

## 📂 Folder Structure

```
HRM-Backend/
├── controllers/
│   ├── auth.controller.js
│   ├── employee.controller.js
│   ├── attendance.controller.js
│   └── config.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   ├── role.middleware.js
│   └── error.middleware.js
├── models/
│   ├── User.model.js
│   ├── Attendance.model.js
│   └── Config.model.js
├── routes/
│   ├── auth.routes.js
│   ├── employees.routes.js
│   ├── attendance.routes.js
│   └── config.routes.js
├── utils/
│   ├── token.util.js
│   └── geolocation.util.js
├── .env.example
├── swagger.yaml
├── server.js
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
REFRESH_SECRET=your_refresh_secret
SALT_ROUNDS=10
```

---

## 🚀 Setup & Installation

```bash
# 1️⃣ Clone the repository
git clone https://github.com/yourusername/hrm-backend.git
cd hrm-backend

# 2️⃣ Install dependencies
npm install

# 3️⃣ Configure environment
cp .env.example .env

# 4️⃣ Run the server (development)
npm run dev
```

Server runs at → `http://localhost:5000`  
Swagger docs available at → `http://localhost:5000/api-docs`

---

## 🧪 API Test Flow

### 1️⃣ Admin Registration
```bash
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "Admin@123",
  "role": "Admin"
}
```

### 2️⃣ Login (Admin)
```bash
POST /api/auth/login
```
→ Use the `accessToken` for Authorization:  
`Bearer <access_token>`

### 3️⃣ Set Office Location
```bash
POST /api/config/office
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "radius": 200
}
```

### 4️⃣ Create Employee
```bash
POST /api/employees
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "John@123",
  "role": "Employee"
}
```

### 5️⃣ Employee Login & Check-in
```bash
POST /api/attendance/checkin
```

### 6️⃣ Admin View Attendance
```bash
GET /api/attendance
```

---

## 🌍 Deployment (Render)

- Backend URL → `https://your-app-name.onrender.com/api`
- Swagger Docs → `https://your-app-name.onrender.com/api-docs`

---

## 🧾 Evaluation Highlights

✅ Modular Code Architecture  
✅ MongoDB Schema Design  
✅ Secure Auth & Token Handling  
✅ Proper Error Handling  
✅ Working Swagger & Deployment  
