# Web-Application-Fitness

This project is part of my application for a Full-Stack Developer position. It is a fitness-focused web application that allows users to create personalized workout plans, track progress, and manage their fitness goals.

---

## 🚀 Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Flask (Python)
- **Database:** PostgreSQL
- **Caching / Queues:** Redis
- **Authentication:** HTTP Secure Cookies, JWT
- **Architecture:** RESTful API

---

## 🔐 Authentication & Account Management

### 📝 Register

- Create an account with your email
- Password must meet security requirements (minimum length, uppercase/lowercase, number, special character)

### 🔑 Login

- Log in with your registered email and password
- Secure authentication using JWT + HttpOnly Secure Cookies

### 🔓 Logout

- Logout to protect against unauthorized access
- JWT is invalidated and stored in Redis with a TTL until expiration

### ❓ Forgot Password

- Request a password reset via email
- Secure token-based reset process

### 📧 Change Email

- Update your account email after password confirmation

### 🔒 Change Password

- Change your password through the account settings
- Requires current password for verification

### 🗑️ Delete Account

- Permanently delete your account and all associated data
- Requries current password for verification

---

## 📋 Features

### 🏋️ Workout Management

- Create and edit custom workout plans
- Add exercises, sets, repetitions, and weights
- Track exercise performance over time

### 👤 User Profile & Calculations

- User profile with body measurements
- Automatic calculation of calorie needs
- BMI and basic fitness metrics

### 📈 Progress Tracking

- Log exercise and training data
- View improvements and historical performance

### 🕒 Training Tools

- Integrated stopwatch for round-based and interval training

---

## 🔒 Security Highlights

- Secure authentication using JWT + HttpOnly Secure Cookies
- Password hashing (argon2) and route protection
- Clear separation of frontend and backend using a RESTful API

---

## 🧱 Architecture

- Modular backend with Flask
- Redis caching
- PostgreSQL as a robust relational database
- Clean React component structure styled with Tailwind CSS

---

## Deployment

- Render via CI/CD Github
- Frontend and Backend

---

## Screenshots

<table>
  <tr>
    <td><img src="screenshots/login.jpeg" width="300" alt="Login Page"></td>
    <td><img src="screenshots/register.jpeg" width="300" alt="Register Page"></td>
  </tr>
  <tr>
    <td><img src="screenshots/password.jpeg" width="300" alt="Password Page"></td>
    <td><img src="screenshots/dashboard.jpeg" width="300" alt="Dashboard"></td>
  </tr>
  <tr>
    <td><img src="screenshots/createetrain.jpeg" width="300" alt="Workout Creation"></td>
    <td><img src="screenshots/statistic.jpeg" width="300" alt="Statistics"></td>
  </tr>
  <tr>
    <td><img src="screenshots/profile.jpeg" width="300" alt="Profile"></td>
    <td><img src="screenshots/watch.jpeg" width="300" alt="Watch"></td>
  </tr>
</table>

Icon made by gravisio from www.flaticon.com

https://www.flaticon.com/de/kostenloses-icon/klimmzuge_17642073?term=klimmzug&page=1&position=25&origin=search&related_id=17642073

Icon made by Leremy from www.flaticon.com

https://www.flaticon.com/de/kostenloses-icon/gewichtheben_9992319?term=kniebeuge&page=1&position=4&origin=search&related_id=9992319
