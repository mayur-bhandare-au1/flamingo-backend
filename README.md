## Flamingo Backend (Node.js + Express + MongoDB)

This is the backend API for the Flamingo social media application.  
It provides secure user authentication with JWT, email OTP verification via Gmail, and basic user CRUD with role-based access.

---

## 🔧 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT (`Authorization: Bearer <token>`)
- **Security**: `helmet`, rate limiting, `cors`, password hashing (`bcryptjs`)
- **Validation**: `express-validator`
- **Email**: `nodemailer` (SMTP / Gmail)

---

## 📁 Project Structure (Backend)

```text
src/
├── config/
│   └── db.js              # MongoDB connection
├── controllers/
│   ├── authController.js  # Register, login, OTP, email verification
│   └── userController.js  # User CRUD & profile operations
├── middleware/
│   ├── authMiddleware.js  # JWT protection & admin guard
│   └── errorMiddleware.js # 404 & error handler
├── models/
│   ├── User.js            # User schema (hashed password, roles)
│   └── OtpToken.js        # OTP verification tokens
├── routes/
│   ├── authRoutes.js      # /api/auth endpoints
│   └── userRoutes.js      # /api/users endpoints
├── utils/
│   ├── emailService.js    # Nodemailer / Gmail sender
│   └── generateOtp.js     # Numeric OTP generator
├── app.js                 # Express app configuration
└── server.js              # App entrypoint (env + DB + listener)
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root (same folder as `package.json`) and set:

```bash
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI="your-mongodb-uri-here"
MONGODB_DB_NAME=flamingo

# JWT
JWT_SECRET="change-this-to-a-long-random-secret-string"
JWT_EXPIRES_IN=1h

# CORS
CLIENT_ORIGIN=*

# SMTP / Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail_address@gmail.com
SMTP_PASS=your_gmail_app_password
MAIL_FROM="Flamingo App <your_gmail_address@gmail.com>"
```

> **Security**: Never commit `.env` to version control. Use environment variables in production.

---

## 🚀 Running the Project

From the project root:

```bash
npm install         # Install dependencies
npm run dev         # Start in development mode (nodemon)
# or
npm start           # Start in production mode (node)
```

The API will run on `http://localhost:5000` by default (or the `PORT` you configured).

Health check:

```http
GET /health
```

---

## 🔐 Authentication & User Flows (Overview)

- **Registration**
  - `POST /api/auth/register`
  - Creates a user, generates an OTP, sends it to the email using Gmail SMTP.
- **Email Verification**
  - `POST /api/auth/verify-email`
  - Verifies OTP, marks email as verified, returns a JWT.
- **Login**
  - `POST /api/auth/login`
  - Validates credentials & email verification, returns a JWT.
- **User Profile**
  - `GET /api/users/me` (protected)
  - `PUT /api/users/me` (protected)
  - `DELETE /api/users/me` (protected)
- **Admin User Management**
  - `GET /api/users` (admin)
  - `GET /api/users/:id` (admin)
  - `PUT /api/users/:id` (admin)
  - `DELETE /api/users/:id` (admin)

For full endpoint details (request/response schemas), see `docs/AUTH_AND_USER_API.md`.

---

## 📱 Using with Flutter

- Store the JWT securely on the device (e.g. `flutter_secure_storage`).
- Send the token in the `Authorization` header for protected endpoints:

```http
Authorization: Bearer <jwt-token-here>
```

- Handle 401/403 status codes in your Flutter app to redirect users to login or show appropriate error messages.

---

## 🛡️ Security Notes

- Passwords are hashed with `bcrypt` before saving.
- JWTs are signed with `JWT_SECRET` and have an expiry (`JWT_EXPIRES_IN`).
- OTPs are **never stored in plain text**; only SHA-256 hashes are saved with a TTL.
- Rate limiting is applied on `/api/auth` routes.
- `helmet` is used for secure HTTP headers.


