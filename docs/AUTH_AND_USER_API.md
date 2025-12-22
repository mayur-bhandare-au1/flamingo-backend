## Flamingo Backend – Auth & User API Documentation

This document describes the authentication and user-related REST APIs provided by the Flamingo backend.

Base URL (default):

- `http://localhost:5000`

All responses are JSON.

---

## 1. Authentication

### 1.1 Register User

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Auth required**: No

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

#### Validation

- `name`: string, 2–100 characters
- `email`: valid email
- `password`: minimum 8 characters

#### Success Response

- **Status**: `201 Created`

```json
{
  "message": "User registered, verification OTP sent to email",
  "user": {
    "id": "665f8c2...",
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": false
  }
}
```

> An OTP (6 digits) is emailed to the user and is valid for 10 minutes.

---

### 1.2 Verify Email with OTP

- **URL**: `/api/auth/verify-email`
- **Method**: `POST`
- **Auth required**: No

#### Request Body

```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Success Response

- **Status**: `200 OK`

```json
{
  "message": "Email verified successfully",
  "token": "<jwt-token>",
  "user": {
    "id": "665f8c2...",
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": true
  }
}
```

#### Error Cases

- Invalid email or user not found
- OTP expired or not found
- OTP does not match

All return `400 Bad Request` with a message.

---

### 1.3 Resend OTP

- **URL**: `/api/auth/resend-otp`
- **Method**: `POST`
- **Auth required**: No

#### Request Body

```json
{
  "email": "john@example.com"
}
```

#### Success Response

- **Status**: `200 OK`

```json
{
  "message": "OTP resent to email"
}
```

#### Error Cases

- User not found
- Email already verified

---

### 1.4 Login

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Auth required**: No

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

#### Success Response

- **Status**: `200 OK`

```json
{
  "message": "Logged in successfully",
  "token": "<jwt-token>",
  "user": {
    "id": "665f8c2...",
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": true
  }
}
```

#### Error Cases

- Invalid credentials → `400 Bad Request`
- Email not verified → `403 Forbidden`

---

## 2. Authentication – Client Usage (Flutter)

For all **protected** endpoints:

- Add header:

```http
Authorization: Bearer <jwt-token>
```

Store the token securely on the device (for example `flutter_secure_storage`).

---

## 3. Current User Endpoints

### 3.1 Get Current User Profile

- **URL**: `/api/users/me`
- **Method**: `GET`
- **Auth required**: Yes (Bearer token)

#### Success Response

- **Status**: `200 OK`

```json
{
  "user": {
    "id": "665f8c2...",
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": true,
    "role": "user"
  }
}
```

---

### 3.2 Update Current User Profile

- **URL**: `/api/users/me`
- **Method**: `PUT`
- **Auth required**: Yes

#### Request Body

```json
{
  "name": "New Name"
}
```

- `name`: optional, 2–100 characters

#### Success Response

- **Status**: `200 OK`

```json
{
  "message": "Profile updated",
  "user": {
    "id": "665f8c2...",
    "name": "New Name",
    "email": "john@example.com",
    "isEmailVerified": true,
    "role": "user"
  }
}
```

---

### 3.3 Delete Current User

- **URL**: `/api/users/me`
- **Method**: `DELETE`
- **Auth required**: Yes

#### Success Response

- **Status**: `204 No Content`

No body.

---

## 4. Admin User Management

> All admin endpoints require:
>
> - Valid JWT (`Authorization: Bearer <token>`)
> - User role `admin`

### 4.1 List Users

- **URL**: `/api/users`
- **Method**: `GET`
- **Auth required**: Yes (admin)

#### Success Response

- **Status**: `200 OK`

```json
{
  "users": [
    {
      "id": "665f8c2...",
      "name": "John Doe",
      "email": "john@example.com",
      "isEmailVerified": true,
      "role": "user"
    }
  ]
}
```

---

### 4.2 Get User by ID

- **URL**: `/api/users/:id`
- **Method**: `GET`
- **Auth required**: Yes (admin)

#### Success Response

- **Status**: `200 OK`

```json
{
  "user": {
    "id": "665f8c2...",
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": true,
    "role": "user"
  }
}
```

#### Error

- `404 Not Found` if user does not exist.

---

### 4.3 Update User by ID

- **URL**: `/api/users/:id`
- **Method**: `PUT`
- **Auth required**: Yes (admin)

#### Request Body

Any combination of:

```json
{
  "name": "Updated Name",
  "role": "admin",
  "isEmailVerified": true
}
```

Validation:

- `name`: optional, 2–100 characters
- `role`: optional, one of `"user"` or `"admin"`
- `isEmailVerified`: optional, boolean

#### Success Response

- **Status**: `200 OK`

```json
{
  "message": "User updated",
  "user": {
    "id": "665f8c2...",
    "name": "Updated Name",
    "email": "john@example.com",
    "isEmailVerified": true,
    "role": "admin"
  }
}
```

---

### 4.4 Delete User by ID

- **URL**: `/api/users/:id`
- **Method**: `DELETE`
- **Auth required**: Yes (admin)

#### Success Response

- **Status**: `204 No Content`

No body.

---

## 5. Error Format

Most error responses follow one of these formats:

### 5.1 Validation Errors

```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 5.2 General Errors

```json
{
  "message": "Invalid credentials"
}
```

### 5.3 Authentication / Authorization Errors

- **401 Unauthorized** – Missing or invalid token.
- **403 Forbidden** – Not enough permissions (e.g. non-admin accessing admin route).

```json
{
  "message": "Not authorized, token missing"
}
```

or

```json
{
  "message": "Admin access required"
}
```


