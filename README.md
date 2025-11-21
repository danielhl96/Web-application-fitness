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







Icon made by gravisio from www.flaticon.com




https://www.flaticon.com/de/kostenloses-icon/klimmzuge_17642073?term=klimmzug&page=1&position=25&origin=search&related_id=17642073


Icon made by Leremy from www.flaticon.com

https://www.flaticon.com/de/kostenloses-icon/gewichtheben_9992319?term=kniebeuge&page=1&position=4&origin=search&related_id=9992319
