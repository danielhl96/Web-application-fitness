# Web-Application-Fitness

A full-stack fitness web application built as part of a Full-Stack Developer portfolio project. Users can create personalized workout plans, track their training progress, manage nutrition, and interact with an AI coach — including voice input via real-time speech-to-text.

Live demo: **https://frontend.web-fitness-app.de**

Guest credentials:

```
Email:    gast@gast.de
Password: q!w7w'nF9Gb+d_j
```

---

## 🚀 Tech Stack

| Layer                         | Technology                                          |
| ----------------------------- | --------------------------------------------------- |
| **Frontend**                  | React 19, TypeScript, Tailwind CSS, Vite 6          |
| **Backend**                   | NestJS v10 (TypeScript)                             |
| **Legacy Backend**            | Flask (Python) — replaced by NestJS                 |
| **Database**                  | PostgreSQL via Prisma ORM                           |
| **Caching / Token Blacklist** | Redis                                               |
| **Authentication**            | JWT + HttpOnly Secure Cookies                       |
| **Real-time**                 | WebSocket (socket.io) — STT streaming               |
| **AI**                        | OpenAI Whisper (STT), GPT-4o (AI Coach & Nutrition) |
| **Containerisation**          | Docker + Docker Compose                             |
| **PWA**                       | Vite PWA Plugin (installable, offline shell)        |

---

## 🏗️ Architecture

### Frontend

```
src/
├── App.tsx                  # Root router (React Router v6)
├── main.tsx                 # Entry point, PWA service worker
├── types.ts                 # Shared TypeScript types (UI_STATE<T>, WorkoutPlan, …)
├── Auth/
│   ├── AuthProvider.jsx     # React context for authentication state
│   └── ProtectedRoute.jsx   # Route guard
├── Pages/                   # One file per route (all .tsx)
│   ├── training.tsx
│   ├── aicoach.tsx
│   ├── nutrition.tsx
│   └── …
├── Components/              # Reusable UI primitives (Button, WorkoutCard, …)
├── hooks/                   # Business logic extracted from pages
│   ├── useTraining.ts       # All training state, API calls, handlers
│   ├── useAudioRecorder.ts  # WebSocket STT + VAD (hark) hook
│   ├── useNutrition.ts
│   ├── useEditTrain.ts
│   └── useCounter.ts
└── Utils/
    └── api.ts               # Axios instance with JWT refresh interceptor
```

**Key frontend patterns:**

- Pages are pure UI — all state and side effects live in custom hooks (`useTraining`, `useNutrition`, …)
- `UI_STATE<T>` discriminated union (`loading | success | error`) replaces separate loading flags
- Typed with TypeScript (`strict: false` during migration, tightened over time)
- Axios interceptor handles silent JWT refresh (401 → `/auth/refresh_token` → retry)

### Backend (NestJS)

```
backend_nestjs/src/
├── app.module.ts            # Root module
├── main.ts                  # Bootstrap: CORS, Helmet, compression, rate-limit, socket.io
├── auth/                    # JWT strategy, guards, login/register/refresh endpoints
├── users/                   # User profile, credentials management
├── workout_plans/           # CRUD for plans, exercises, training logs
├── meals/                   # Nutrition management (CRUD + OpenAI image analysis)
├── statistics/              # Progress & history queries
├── aicoach/                 # AI coach REST endpoint (GPT-4o)
├── stt/                     # WebSocket gateway (/stt namespace) — Whisper streaming
├── prisma/                  # PrismaService wrapper
├── redis.ts                 # Redis client (token blacklist, caching)
└── openai.ts                # Shared OpenAI client
```

**Key backend patterns:**

- NestJS module system — each domain (auth, workout, meals, …) is a self-contained module
- Prisma ORM with PostgreSQL — type-safe queries, schema migrations via `prisma migrate`
- `@nestjs/websockets` + `@nestjs/platform-socket.io` for the STT WebSocket gateway
- Guards: `JwtAuthGuard` protects all non-public endpoints; `WsJwtGuard` protects the WebSocket namespace
- Rate limiting via `express-rate-limit`; security headers via `helmet`; response compression via `compression`
- Redis stores invalidated JWT IDs (`jti`) until token expiry (logout / token rotation)

### STT Pipeline (Voice → Text)

```
Browser mic
  └─ MediaRecorder (100 ms chunks)
       └─ socket.io WebSocket  →  NestJS /stt gateway
                                       └─ buffers chunks
                                            ├─ stt:partial → Whisper (live)
                                            └─ stt:stop    → Whisper (final)
                                                 └─ stt:transcript → frontend
```

- VAD (Voice Activity Detection) via **hark** — auto-stops after 2 s of silence
- Partial transcription every 2 s while speaking (live preview)
- Flow-controlled: MediaRecorder only starts after server emits `stt:started`

---

## 🔐 Authentication & Account Management

### Register / Login

- Email + password registration with strength validation
- JWT (HS256) in HttpOnly Secure Cookie — claims: `sub`, `iss`, `aud`, `exp`, `iat`, `nbf`, `jti`
- Short-lived access token + refresh token rotation

### Security

- Password hashing: **argon2** with salting
- Logout: `jti` written to Redis with TTL = remaining token lifetime
- Silent refresh: Axios interceptor catches 401, calls `/auth/refresh_token`, retries original request
- All routes protected via `JwtAuthGuard`; WebSocket namespace via `WsJwtGuard`

### Account Management

- Change email (requires password confirmation)
- Change password (requires current password)
- Forgot password (secure token via email)
- Delete account (requires password confirmation, cascades all data)

---

## 📋 Features

### 🏋️ Workout Management

- Create and edit custom workout plans with exercises, sets, reps, and weights
- Live training view: set/rep tracking, weight picker, break timer, exercise navigator
- Previous session data shown per exercise for progressive overload reference
- 1RM estimation panel

### 🤖 AI Coach

- Chat with GPT-4o about training, nutrition, and recovery

### 🍕 Nutrition

- Upload meal photos → GPT-4o estimates macros and calories (vision)
- Date-based meal history (breakfast, lunch, dinner, snacks)
- Edit estimated macros manually
- Voice input via WebSocket STT (OpenAI Whisper) with live partial transcriptions
- VAD-based auto-stop — no button needed to end recording

### 📈 Statistics

- Training history and progress charts
- Per-exercise performance over time

### 👤 Profile

- Body measurements, BMI, calorie needs calculation

### 🕒 Training Tools

- Integrated stopwatch / interval timer

### 📱 PWA

- Installable on mobile (Add to Home Screen)
- Offline shell via service worker

---

## 🧱 Component Library

| Component                      | Purpose                                              |
| ------------------------------ | ---------------------------------------------------- |
| `Button`                       | Styled action button with customisable border colour |
| `WorkoutCard`                  | Workout plan selection card                          |
| `ExerciseCard`                 | Exercise display with icon                           |
| `TemplatePage`                 | Consistent page layout wrapper                       |
| `TemplateModal`                | Backdrop modal wrapper                               |
| `Notify`                       | Success / error toast with configurable duration     |
| `Header` / `HeaderLogout`      | Navigation bar variants                              |
| `EmailInput` / `PasswordInput` | Validated input primitives                           |

---

## 🔒 Security Highlights

- JWT with full claim validation (`sub`, `iss`, `aud`, `exp`, `iat`, `nbf`, `jti`)
- HttpOnly Secure Cookies (not accessible via JavaScript)
- Token blacklisting via Redis on logout
- argon2 password hashing
- Helmet security headers
- Rate limiting on all endpoints
- CORS allow-list configured per environment
- Route and WebSocket guards

---

## 🐳 Docker

The stack runs in multiple containers orchestrated via Docker Compose:

| Container  | Description                        |
| ---------- | ---------------------------------- |
| `frontend` | Nginx serving the Vite/React build |
| `backend`  | NestJS application                 |
| `db`       | PostgreSQL                         |
| `redis`    | Redis                              |

```bash
# NestJS stack
docker-compose -f docker-compose.nestjs.yml up --build

# Legacy Flask stack
docker-compose up --build
```

**Example `.env` (NestJS):**

```env
DATABASE_URL=postgresql://user:password@db:5432/fitness_app
REDIS_URL=redis://redis:6379
JWT_SECRET=your-secret
JWT_ALGORITHM=HS256
JWT_AUDIENCE=user
JWT_ISSUER=fitness_app
ALLOWED_ORIGINS=http://localhost:5173
OPENAI_API_KEY=sk-...
VITE_API_URL=http://localhost:3000
```

---

## 📸 Screenshots v1.2 (iPhone 11 Pro)

<table>
<tr>
    <td><img src="screenshots/login1.2.png" width="300" alt="Login Page"></td>
    <td><img src="screenshots/register1.2.png" width="300" alt="Register Page"></td>
    <td><img src="screenshots/passwordforget1.2.png" width="300" alt="Password Page"></td>
</tr>
<tr>
   <td><img src="screenshots/dashboard1.2.png" width="300" alt="Dashboard"></td>
    <td><img src="screenshots/createworkout1.2.png" width="300" alt="Workout Creation"></td>
    <td><img src="screenshots/editworkoutcards.png" width="300" alt="Edit Workouts"></td>
    <td><img src="screenshots/editworkout1.2.png" width="300" alt="Edit Workout"></td>
    <td><img src="screenshots/notify.png" width="300" alt="Notification"></td>
</tr>
<tr>
    <td><img src="screenshots/selectworkout1.2.png" width="300" alt="Select Workout"></td>
    <td><img src="screenshots/workout1.2.png" width="300" alt="Workout"></td>
    <td><img src="screenshots/breaktimer.png" width="300" alt="Break Timer"></td>
    <td><img src="screenshots/lastworkout.png" width="300" alt="Last Workout"></td>
    <td><img src="screenshots/list1.2.png" width="300" alt="Exercise List"></td>
</tr>
<tr>
    <td><img src="screenshots/nutrition.png" width="300" alt="Nutrition"></td>
    <td><img src="screenshots/nutritiondate.png" width="300" alt="Nutrition Date"></td>
    <td><img src="screenshots/mealedit.png" width="300" alt="Meal Edit"></td>
    <td><img src="screenshots/mealupload.png" width="300" alt="Meal Upload"></td>
</tr>
<tr>
    <td><img src="screenshots/profile1.2.png" width="300" alt="Profile"></td>
    <td><img src="screenshots/profileedit1.2.png" width="300" alt="Profile Edit"></td>
    <td><img src="screenshots/stopwatch1.2.png" width="300" alt="Stopwatch"></td>
    <td><img src="screenshots/stat1.2.png" width="300" alt="Statistics"></td>
    <td><img src="screenshots/diagram1.2.png" width="300" alt="Diagram"></td>
</tr>
<tr>
    <td><img src="screenshots/cred.png" width="300" alt="Credentials"></td>
    <td><img src="screenshots/emailchange.png" width="300" alt="Email Change"></td>
    <td><img src="screenshots/passwordchange.png" width="300" alt="Password Change"></td>
    <td><img src="screenshots/deleteaccount.png" width="300" alt="Delete Account"></td>
</tr>
</table>

---

## 📸 Screenshots v1.1 (iPhone 11 Pro)

<table>
  <tr>
    <td><img src="screenshots/login.png" width="300" alt="Login Page"></td>
    <td><img src="screenshots/register.png" width="300" alt="Register Page"></td>
    <td><img src="screenshots/passwordforget.png" width="300" alt="Password Page"></td>
    <td><img src="screenshots/passwordforget2.png" width="300" alt="Password Page"></td>
  </tr>
  <tr>
   <td><img src="screenshots/dashboard.png" width="300" alt="Dashboard"></td>
    <td><img src="screenshots/createworkout.png" width="300" alt="Workout Creation"></td>
    <td><img src="screenshots/editworkoutplans.png" width="300" alt="Workout Editing"></td>
    <td><img src="screenshots/editworkoutplans2.png" width="300" alt="Make a workout"></td>
  </tr>
  <tr>
   <td><img src="screenshots/selectworkout.png" width="300" alt="Workout selection"></td>
    <td><img src="screenshots/workout.png" width="300" alt="Workout start"></td>
    <td><img src="screenshots/list.png" width="300" alt="Exercise list"></td>
  </tr>
  <tr>
   <td><img src="screenshots/statistic.png" width="300" alt="Statistics"></td>
   <td><img src="screenshots/statistic2.png" width="300" alt="Profile"></td>
    <td><img src="screenshots/profile.png" width="300" alt="Profile"></td>
    <td><img src="screenshots/stopwatch.png" width="300" alt="Watch"></td>
  </tr>
</table>

---

## Icon Attributions

Icons from [www.flaticon.com](https://www.flaticon.com)

<a href="https://www.flaticon.com/free-icons/pull-ups" title="pull ups icons">Pull ups icons created by gravisio - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/bench-press" title="bench press icons">Bench press icons created by PIXARTIST - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/barbell" title="barbell icons">Barbell icons created by Leremy - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/incline-hammer-curl" title="incline hammer curl icons">Incline hammer curl icons created by Leremy - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/exercise" title="exercise icons">Exercise icons created by Pixel perfect - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/ab-crunch-machine" title="ab crunch machine icons">Ab crunch machine icons created by Leremy - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/deadlift" title="deadlift icons">Deadlift icons created by Leremy - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/workout" title="workout icons">Workout icons created by Leremy - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/standing-dumbbell-triceps-extension" title="standing dumbbell triceps extension icons">Standing dumbbell triceps extension icons created by Leremy - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/dumbbell-incline-row" title="dumbbell incline row icons">Dumbbell incline row icons created by Leremy - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/incline-barbell-bench-press" title="incline barbell bench press icons">Incline barbell bench press icons created by Leremy - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/kettlebell" title="kettlebell icons">Kettlebell icons created by gravisio - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/leg-curl" title="leg curl icons">Leg curl icons created by faizgrafis - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/leg-press" title="leg press icons">Leg press icons created by Leremy - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/workout" title="workout icons">Workout icons created by Smashicons - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/plank" title="plank icons">Plank icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/pushup" title="pushup icons">Pushup icons created by Freepik - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/sit-up" title="sit up icons">Sit up icons created by surang - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/gym" title="gym icons">Gym icons created by Leremy - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/leverage-shoulder-press" title="leverage shoulder press icons">Leverage shoulder press icons created by Leremy - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/triceps-pushdown" title="triceps pushdown icons">Triceps pushdown icons created by Leremy - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/standing-barbell-calf-raise" title="standing barbell calf raise icons">Standing barbell calf raise icons created by Leremy - Flaticon</a>
<a href="https://www.flaticon.com/free-icons/barbell-glute-bridge" title="barbell glute bridge icons">Barbell glute bridge icons created by Leremy - Flaticon</a>

- **Database:** PostgreSQL
- **Caching / Queues:** Redis
- **Authentication:** HTTP Secure Cookies, JWT
- **Architecture:** Clear separation of REST API (backend), dynamic template pages, and modular workout and exercise components (frontend)

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

### 🍕 Nutrition Estimation

- A nutrition estimation feature powered by OpenAI LLMs
- Nutrition will be estimated from uploaded meal pictures
- Date selection for history and future food plans
- Meal management for breakfast, lunch, dinner, and snacks
- Meal editing to change the macros and calories

### 📈 Progress Tracking

- Log exercise and training data
- View improvements and historical performance

### 🕒 Training Tools

- Integrated stopwatch for round-based and interval training

---

## 🔒 Security Highlights

- Secure authentication using JWT + HttpOnly Secure Cookies
- A JWT contains the following security-relevant claims:
- `sub` (user ID),
- `iss` (issuer),
- `aud` (audience),
- `exp` (expiration),
- `iat` (issued at),
- `nbf` (not before),
- `jti` (JWT ID).
- The backend application validates these claims to ensure the authenticity and integrity of each JWT.
- Password hashing (argon2) with salting
- Route protection to protect the UI
- Clear separation of frontend and backend using a RESTful API

---

## 🧱 Architecture

- Modular backend with Flask
- Redis caching
- PostgreSQL as a relational database
- Clean React component structure styled with Tailwind CSS
- Template page modules ensure a consistent user experience and make it easy to update frontend components
- Exercise cards include an exercise description and icon. They also feature table logic for selecting sets and repetitions.
- The workout card is a template component that ensures consistent workout selection and editing style.
- Template modules for input fields, such as password and email, provide reusable and consistent input components throughout the frontend.
- Notification module for success and error cases. The component displays a headline and a description for each case, with configurable display duration.

---

## 📱 PWA (Progressive Web App)

- You can install the web application on your smartphone for a native app-like experience.
- Simply open the app in your mobile browser and use "Add to Home Screen" to save it.
- An internet connection is required to save and retrieve data from the backend.

## Deployment

- Render via CI/CD Github
- Frontend and Backend
- Set up Custom DNS to point to web-fitness-application

---

## Docker

- The application runs in multiple Docker containers: frontend, backend, Redis, and PostgreSQL database.
- Separate Dockerfiles are provided for both frontend and backend services.
- Docker Compose orchestrates and connects all containers, enabling setup and management of the entire stack.

---

## Usage

- Bulid a docker compose container
- Do you need an env file like the example
- docker-compose up --build
- Please set up a test user once the Docker build is complete.

**Example `.env` file:**

```env
SECRET_KEY=dein-geheimer-schluessel
JWT_ALGORITHM=HS256
FLASK_ENV=development
DATABASE_URL=postgresql+psycopg2://web_fitness_app_user:mysecretpassword@db:5432/web_fitness_app
REDIS_HOST=redis://redis:6379/0
ALLOWED_ORIGINS=http://localhost:5173
JWT_AUDIENCE=user
JWT_ISSUER=fitness_app
SMTP_USER=
SMTP_PASSWORD=
VITE_API_URL=http://localhost:5001/api
```

---

## Screnshots 1.2 of UI (Mobile Device iPhone 11 Pro)

<table>
<tr>
    <td><img src="screenshots/login1.2.png" width="300" alt="Login Page"></td>
    <td><img src="screenshots/register1.2.png" width="300" alt="Register Page"></td>
     <td><img src="screenshots/passwordforget1.2.png" width="300" alt="Password Page"></td>
       
  </tr>

<tr>
   <td><img src="screenshots/dashboard1.2.png" width="300" alt="Dashboard"></td>
    <td><img src="screenshots/createworkout1.2.png" width="300" alt="Workout Creation"></td>
    <td><img src="screenshots/editworkoutcards.png" width="300" alt="Make a workout"></td>
    <td><img src="screenshots/editworkout1.2.png" width="300" alt="Make a workout"></td>
     <td><img src="screenshots/notify.png" width="300" alt="Make a workout"></td>
  </tr>

<tr>
    <td><img src="screenshots/selectworkout1.2.png" width="300" alt="Login Page"></td>
    <td><img src="screenshots/workout1.2.png" width="300" alt="Register Page"></td>
     <td><img src="screenshots/breaktimer.png" width="300" alt="Password Page"></td>
        <td><img src="screenshots/lastworkout.png" width="300" alt="Password Page"></td>
         <td><img src="screenshots/list1.2.png" width="300" alt="Password Page"></td>
  </tr>

  <tr>
    <td><img src="screenshots/nutrition.png" width="300" alt="Login Page"></td>
    <td><img src="screenshots/nutritiondate.png" width="300" alt="Register Page"></td>
     <td><img src="screenshots/mealedit.png" width="300" alt="Password Page"></td>
        <td><img src="screenshots/lastworkout.png" width="300" alt="Password Page"></td>
         <td><img src="screenshots/mealupload.png" width="300" alt="Password Page"></td>
  </tr>

   <tr>
    <td><img src="screenshots/profile1.2.png" width="300" alt="Login Page"></td>
    <td><img src="screenshots/profileedit1.2.png" width="300" alt="Register Page"></td>
     <td><img src="screenshots/stopwatch1.2.png" width="300" alt="Password Page"></td>
        <td><img src="screenshots/stat1.2.png" width="300" alt="Password Page"></td>
         <td><img src="screenshots/diagram1.2.png" width="300" alt="Password Page"></td>
  </tr>

  <tr>
    <td><img src="screenshots/cred.png" width="300" alt="Login Page"></td>
    <td><img src="screenshots/emailchange.png" width="300" alt="Register Page"></td>
     <td><img src="screenshots/passwordchange.png" width="300" alt="Password Page"></td>
     <td><img src="screenshots/deleteaccount.png" width="300" alt="Password Page"></td>
        
  </tr>

  </table>

## Screenshots 1.1 of UI (Mobile Device iPhone 11 Pro)

<table>
  <tr>
    <td><img src="screenshots/login.png" width="300" alt="Login Page"></td>
    <td><img src="screenshots/register.png" width="300" alt="Register Page"></td>
     <td><img src="screenshots/passwordforget.png" width="300" alt="Password Page"></td>
         <td><img src="screenshots/passwordforget2.png" width="300" alt="Password Page"></td>
  </tr>
 
  <tr>
   <td><img src="screenshots/dashboard.png" width="300" alt="Dashboard"></td>
    <td><img src="screenshots/createworkout.png" width="300" alt="Workout Creation"></td>
    <td><img src="screenshots/editworkoutplans.png" width="300" alt="Workout Editing"></td>
    <td><img src="screenshots/editworkoutplans2.png" width="300" alt="Make a workout"></td>
  </tr>
  <tr>
   <td><img src="screenshots/selectworkout.png" width="300" alt="Workout selection"></td>
    <td><img src="screenshots/workout.png" width="300" alt="Workout start"></td>
    <td><img src="screenshots/list.png" width="300" alt="Exercise list"></td>
  </tr>
  <tr>
   <td><img src="screenshots/statistic.png" width="300" alt="Statistics"></td>
   <td><img src="screenshots/statistic2.png" width="300" alt="Profile"></td>
    <td><img src="screenshots/profile.png" width="300" alt="Profile"></td>
    <td><img src="screenshots/stopwatch.png" width="300" alt="Watch"></td>
  </tr>
</table>

## Screenshots 1.0 of UI (Mobile Devices iPhone 11 Pro)

<table>
  <tr>
    <td><img src="screenshots/register.jpeg" width="300" alt="Register Page"></td>
     <td><img src="screenshots/password.jpeg" width="300" alt="Password Page"></td>
  </tr>
  <tr>
   <td><img src="screenshots/hamburgermenue.jpeg" width="300" alt="Menue"></td>
    <td><img src="screenshots/dashboard.jpeg" width="300" alt="Dashboard"></td>
  </tr>
  <tr>
    <td><img src="screenshots/createetrain.jpeg" width="300" alt="Workout Creation"></td>
    <td><img src="screenshots/edittraining.jpeg" width="300" alt="Workout Editing"></td>
    <td><img src="screenshots/training.jpeg" width="300" alt="Make a workout"></td>
   
  </tr>
  <tr>
   <td><img src="screenshots/statistic.jpeg" width="300" alt="Statistics"></td>
    <td><img src="screenshots/profile.jpeg" width="300" alt="Profile"></td>
    <td><img src="screenshots/watch.jpeg" width="300" alt="Watch"></td>
  </tr>
</table>

## Icon Attributions

- Icons from www.flaticon.com

<a href="https://www.flaticon.com/free-icons/pull-ups" title="pull ups icons">Pull ups icons created by gravisio - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/bench-press" title="bench press icons">Bench press icons created by PIXARTIST - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/barbell" title="barbell icons">Barbell icons created by Leremy - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/incline-hammer-curl" title="incline hammer curl icons">Incline hammer curl icons created by Leremy - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/exercise" title="exercise icons">Exercise icons created by Pixel perfect - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/ab-crunch-machine" title="ab crunch machine icons">Ab crunch machine icons created by Leremy - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/deadlift" title="deadlift icons">Deadlift icons created by Leremy - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/workout" title="workout icons">Workout icons created by Leremy - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/standing-dumbbell-triceps-extension" title="standing dumbbell triceps extension icons">Standing dumbbell triceps extension icons created by Leremy - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/dumbbell-incline-row" title="dumbbell incline row icons">Dumbbell incline row icons created by Leremy - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/incline-barbell-bench-press" title="incline barbell bench press icons">Incline barbell bench press icons created by Leremy - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/kettlebell" title="kettlebell icons">Kettlebell icons created by gravisio - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/leg-curl" title="leg curl icons">Leg curl icons created by faizgrafis - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/leg-press" title="leg press icons">Leg press icons created by Leremy - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/workout" title="workout icons">Workout icons created by Smashicons - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/plank" title="plank icons">Plank icons created by Freepik - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/pushup" title="pushup icons">Pushup icons created by Freepik - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/sit-up" title="sit up icons">Sit up icons created by surang - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/gym" title="gym icons">Gym icons created by Leremy - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/leverage-shoulder-press" title="leverage shoulder press icons">Leverage shoulder press icons created by Leremy - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/workout" title="workout icons">Workout icons created by Leremy - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/workout" title="workout icons">Workout icons created by juicy_fish - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/triceps-pushdown" title="triceps pushdown icons">Triceps pushdown icons created by Leremy - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/standing-barbell-calf-raise" title="standing barbell calf raise icons">Standing barbell calf raise icons created by Leremy - Flaticon</a>

<a href="https://www.flaticon.com/free-icons/barbell-glute-bridge" title="barbell glute bridge icons">Barbell glute bridge icons created by Leremy - Flaticon</a>
