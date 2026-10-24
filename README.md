# Web-Application-Fitness

A full-stack fitness web application built as part of a Full-Stack Developer portfolio project. Users can create personalized workout plans, track their training progress, manage nutrition, and interact with an AI coach — including voice input via real-time speech-to-text.

Live demo: **https://frontend.web-fitness-app.de**

Guest credentials:

```
Email:    test@test.de
Password: Test1234@
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
| **Hosting**                   | Self-hosted on Raspberry Pi via Cloudflare Tunnel   |
| **PWA**                       | Vite PWA Plugin (installable, offline shell)        |

---

## 🏗️ Architecture

### Frontend

```
src/
├── main.tsx                 # Entry point + router bootstrapping
├── App.tsx                  # Route mapping
├── features/                # Domain-based feature modules
│   ├── auth/                # Login/register/protected route/auth provider
│   ├── training/            # Workout execution UI + hooks
│   ├── createworkout/       # Create plan UI + DnD ordering
│   ├── editworkout/         # Edit plan UI + DnD ordering
│   ├── meal/                # Nutrition UI + hooks/services
│   ├── aicoach/             # AI chat + voice integration
│   └── ...
├── shared/
│   ├── Components/          # Reusable UI components
│   └── Utils/api.ts         # Axios instance with cookie-based auth
└── services/                # Feature-agnostic API services
```

**Frontend architecture in detail:**

1. **Feature-first structure**

- Each business domain lives in `src/features/*` (auth, training, meal, aicoach, profile, ...)
- UI, hooks, and service code stay close together to reduce cross-folder coupling

2. **Container + hook pattern**

- Route components (`training.tsx`, `nutrition.tsx`, `aicoach.tsx`, ...) mostly compose UI
- Business logic lives in hooks (`useTraining`, `useNutrition`, `useAiCoach`, `useProfile`)

3. **Shared design system layer**

- Generic UI primitives are in `src/shared/Components`
- Feature screens compose these primitives and pass behavior via props
- Repeated UX (modals, cards, input controls, toasts, loaders) is centralized

4. **Network/auth flow**

- `shared/Utils/api.ts` configures Axios with cookies
- On `401`, the user is redirected to login — no silent refresh
- Public auth endpoints (`/auth/login`, `/auth/register`, password reset routes) bypass the auth guard

5. **Interaction architecture**

- Drag & drop ordering in create/edit workout is implemented via `@dnd-kit`
- Voice/STT flow is split across `useAudioRecorder`, socket service, and presentation components (`RecorderControls`, `TranscriptBox`)

**Key frontend patterns:**

- Pages are UI-focused; side effects and domain state stay in hooks
- Shared components are stateless where possible and controlled via props
- TypeScript is used across features and services for safer refactors
- Axios interceptor redirects to login on `401` (token expired)

### Backend (NestJS)

```
backend_nestjs/src/
├── app.module.ts            # Root module
├── main.ts                  # Bootstrap: CORS, Helmet, compression, rate-limit, socket.io
├── auth/                    # JWT strategy, guards, login/register endpoints
├── users/                   # User profile, credentials management
├── workout_plans/           # CRUD for plans, exercises, training logs
├── meals/                   # Nutrition management (CRUD + OpenAI image analysis)
├── statistics/              # Progress & history queries
├── aicoach/                 # AI coach REST endpoint (GPT-4o)
├── stt/                     # WebSocket gateway (/stt namespace) — Whisper streaming
├── prisma/                  # PrismaService wrapper
├── redis.ts                 # Redis client (token blacklist, caching)
└── openai/                  # OpenAI module + injectable service
  ├── openai.module.ts
  └── openai.service.ts
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
- Token expires after a fixed duration; re-login required on expiry

### Security

- Password hashing: **argon2** with salting
- Logout: `jti` written to Redis with TTL = remaining token lifetime
- Expired tokens result in `401` — user is redirected to login
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
- Drag & drop reordering of exercises in create/edit workout views (`@dnd-kit`)
- Live training view: set/rep tracking, weight picker, break timer, exercise navigator
- Previous session data shown per exercise for progressive overload reference
- 1RM estimation panel

### 🏃 Cardio

- Log and edit running sessions with full metric support
- Tracks duration, distance, pace (auto-calculated), average & max heart rate, power, cadence, calories, and notes
- Session history with detail view and inline editing

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

## ✅ Testing

### Backend (Jest)

- Unit and integration tests for `meals` and `workout_plans`
- OpenAI calls are mocked via `OpenaiService` provider overrides

### Frontend (Vitest)

- `vitest` + `@testing-library/react` + `@testing-library/jest-dom`
- Test setup file: `src/test-setup.ts`

### E2E (Cypress)

- Auth E2E tests in `cypress/e2e/auth.cy.ts`
- Custom command `cy.login()` in `cypress/support/commands.ts`
- Credentials loaded from `cypress.env.json`
- `allowCypressEnv: false` is enabled; use `cy.env()` in tests

---

## 🧱 Component Library

| Component                 | Purpose                                                           |
| ------------------------- | ----------------------------------------------------------------- |
| `Button`                  | Styled action button with loading/disabled states                 |
| `Input`                   | Base text input primitive                                         |
| `EmailInput`              | Email input with validation and error handling                    |
| `PasswordInput`           | Password input with visibility toggle and strength validation     |
| `TemplatePage`            | Shared page shell/layout with mobile dock and orientation overlay |
| `TemplateModal`           | Backdrop modal wrapper with dismiss handling                      |
| `Notify`                  | Success/error toast with configurable duration                    |
| `Loading`                 | Reusable loading indicator                                        |
| `WorkoutCard`             | Workout plan selection/overview card                              |
| `ExerciseCard`            | Exercise card (desktop inline + mobile modal behavior)            |
| `ExerciseSearchDropdown`  | Search + select exercises in workout forms                        |
| `Table`                   | Reusable tabular data rendering                                   |
| `ProfileCard`             | Profile summary card container                                    |
| `HumanSilhouette`         | Body/measurement visual helper                                    |
| `Header` / `HeaderLogout` | Navigation bars for authenticated and auth pages                  |
| `AudioRecorder`           | Voice recording wrapper component                                 |
| `RecorderControls`        | Start/stop controls for audio capture                             |
| `TranscriptBox`           | Live/final speech transcript display                              |
| `ChatBubble`              | Message bubble for AI coach chat UI                               |
| `BreakTimeModal`          | Rest timer modal during workouts                                  |
| `WeightModal`             | Weight input modal during training                                |
| `ExerciseListModal`       | Exercise list modal during active workout                         |
| `LastTrainingModal`       | Last-session reference modal for progression                      |
| `RepsEstimationPanel`     | 1RM/reps estimation helper panel                                  |
| `HealthMetrics`           | Profile metrics section (BMI/body stats)                          |

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
| `testdb`   | PostgreSQL (NestJS test/dev DB)    |
| `redis`    | Redis                              |

```bash
# NestJS stack
docker-compose -f docker-compose.nestjs.yml up --build

# Legacy Flask stack
docker-compose up --build
```

**Example `.env` (NestJS):**

```env
USER_DATABASE_URL=postgresql://testuser:testpassword@testdb:5432/fitness_test?sslmode=disable
REDIS_URL=redis://redis:6379
JWT_SECRET=your-secret
JWT_ALGORITHM=HS256
JWT_AUDIENCE=user
JWT_ISSUER=fitness_app
ALLOWED_ORIGINS=http://localhost:5173
OPENAI_API_KEY=sk-...
VITE_API_URL=http://localhost:3000
```

> Note: In the NestJS compose stack, backend startup runs Prisma schema sync automatically (`prisma db push`).

---

## 🌐 Static Serving with Nginx

The frontend is **not** served by the Vite dev server in production. Instead, the React app is compiled to static assets and served by **Nginx** inside a minimal container.

### Why a static build + Nginx?

A Single Page Application is, after the build, just a set of static files (`index.html`, hashed JS/CSS bundles, images, the service worker). These don't need a running Node.js process — they only need to be delivered efficiently. Nginx is the industry-standard choice for this because it is tiny, fast, battle-tested, and gives fine-grained control over caching and routing headers.

Running `npm run dev` in production is an anti-pattern: the Vite dev server transpiles modules on the fly, serves them unbundled (`/src/main.tsx`, `/@vite/client`), and never produces the real PWA artifacts (`sw.js`, precache manifest) — those only exist after `vite build`.

### Multi-stage Docker build

The [Dockerfile](Dockerfile) uses a two-stage build to keep the final image small (no Node.js or source in the runtime image):

```dockerfile
# 1) Build stage — compile the app with Vite
FROM node:20-alpine AS build
WORKDIR /app
ARG VITE_API_URL              # Vite bakes env vars in at BUILD time
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build             # -> /app/dist (static assets)

# 2) Serve stage — tiny Nginx image with only the built assets
FROM nginx:alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html
COPY src/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
```

> **Important:** `VITE_API_URL` is baked in at **build time**, not runtime. If the API URL changes, the frontend image must be **rebuilt** (`--build`), not just restarted.

### Nginx configuration

The config in [src/nginx.conf](src/nginx.conf) handles three concerns specific to a PWA-enabled SPA:

```nginx
server {
  listen 5173;
  root /usr/share/nginx/html;
  index index.html;

  # 1) SPA fallback — client-side routing (React Router)
  location / {
    try_files $uri $uri/ /index.html;
  }

  # 2) Service worker & manifest must never be stale-cached
  location = /sw.js {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    expires off;
  }
  location = /manifest.webmanifest {
    types { } default_type "application/manifest+json";
    add_header Cache-Control "no-cache";
  }

  # 3) Hashed build assets — cache aggressively (filename changes on update)
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

**Why these rules matter in practice:**

1. **SPA fallback** — Routes like `/cardio` or `/login` have no matching file on disk. Without `try_files … /index.html`, a page reload on a sub-route would return a 404. The fallback always serves `index.html` so React Router can resolve the route on the client.
2. **No-cache for `sw.js` / manifest** — If the service worker is cached, the browser keeps running an outdated version and precaches stale pages (a common PWA pitfall). Forcing revalidation guarantees users pick up new deployments immediately.
3. **Immutable caching for `/assets/`** — Vite fingerprints bundle filenames with a content hash. Because a changed file gets a new name, the old one can be cached for a year safely — maximising cache hits and minimising bandwidth.

### Port & reverse proxy

Nginx listens on **5173** so the existing Cloudflare Tunnel ingress rule (`app.* -> http://frontend:5173`) resolves without dashboard changes. In production, TLS termination and public routing are handled by **Cloudflare Tunnel** (see the `cloudflared` service in the compose file) — Nginx only serves plain HTTP on the internal Docker network.

---

## ☁️ Deployment — Self-hosted on a Raspberry Pi via Cloudflare Tunnel

The application is **self-hosted on a Raspberry Pi** at home and made publicly reachable through a **Cloudflare Tunnel** — no cloud provider, no public IP, and no open inbound ports on the router.

### Why this approach?

- **Zero exposed ports** — The Raspberry Pi has **no port forwarding** and no inbound firewall holes. The `cloudflared` daemon opens an **outbound** connection to Cloudflare's edge, and all traffic flows back through that established tunnel. This dramatically reduces the attack surface.
- **Free global reach + TLS** — Cloudflare terminates HTTPS at the edge and serves valid certificates for the subdomains automatically. No manual Let's Encrypt setup, no dynamic-DNS juggling for a changing home IP.
- **Full control & zero cost** — Running the whole stack (frontend, NestJS backend, PostgreSQL, Redis) locally on ARM hardware avoids recurring hosting fees and keeps data on-premise.

### How it works

```
  Browser
     │  https://frontend.web-fitness-app.de     (app subdomain)
     │  https://api.web-fitness-app.de          (api subdomain)
     ▼
┌──────────────────────┐
│  Cloudflare Edge      │  TLS termination + routing
└──────────┬───────────┘
           │  outbound tunnel (initiated from the Pi)
           ▼
┌───────────────────────────── Raspberry Pi (Docker Compose) ─────────────────────────────┐
│   cloudflared ──► frontend (Nginx :5173)  ──► static React/PWA build                      │
│              └──► backend  (NestJS :3000)  ──► PostgreSQL + Redis                          │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

A single named tunnel exposes **two public hostnames**, configured in the Cloudflare Zero Trust dashboard:

| Public hostname               | Internal service       |
| ----------------------------- | ---------------------- |
| `frontend.web-fitness-app.de` | `http://frontend:5173` |
| `api.web-fitness-app.de`      | `http://backend:3000`  |

The `cloudflared` container only needs the tunnel token:

```yaml
cloudflared:
  image: cloudflare/cloudflared:latest
  restart: unless-stopped
  command: tunnel --no-autoupdate run
  environment:
    - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
```

### Deploying / updating on the Pi

```bash
# On the Raspberry Pi
git pull
docker compose -f docker-compose.nestjs.yml up -d --build
```

> **Note:** `VITE_API_URL` must point to the public API subdomain (`https://api.web-fitness-app.de`) and is baked in at **build time** — changing it requires rebuilding the frontend image.

---

## 📸 Screenshots v1.3 (iPhone 11 Pro)s

<table>
<tr>
    <td><img src="screenshots/login1.3.png" width="300" alt="Login Page"></td>
    <td><img src="screenshots/register1.3.png" width="300" alt="Register Page"></td>
    <td><img src="screenshots/passwordforget1.3.png" width="300" alt="Password Page"></td>
</tr>
<tr>
   <td><img src="screenshots/home1.3.png" width="300" alt="Dashboard"></td>
    <td><img src="screenshots/editworkoutcards1.3.png" width="300" alt="Edit Workouts"></td>
     <td><img src="screenshots/editworkoutmax1.3.png" width="300" alt="Edit Workouts"></td>
    <td><img src="screenshots/editworkout1.3.png" width="300" alt="Edit Workout"></td>
</tr>
<tr>
    <td><img src="screenshots/selectworkout1.3.png" width="300" alt="Select Workout"></td>
    <td><img src="screenshots/workout1.3.png" width="300" alt="Workout"></td>
     <td><img src="screenshots/workout1.3rm.png" width="300" alt="Workout"></td>
</tr>

<tr>
<td><img src="screenshots/cardioinput.png" width="300" alt="Select Workout"></td>
<td><img src="screenshots/cardiohistory.png" width="300" alt="Select Workout"></td>
</tr>
<tr>
    <td><img src="screenshots/nutrition1.3.png" width="300" alt="Nutrition"></td>
    <td><img src="screenshots/mealdate.1.3.png" width="300" alt="Nutrition Date"></td>
    <td><img src="screenshots/mealedit.png" width="300" alt="Meal Edit"></td>
    <td><img src="screenshots/meal1.3select.png" width="300" alt="Meal Upload"></td>
</tr>
<tr>
    <td><img src="screenshots/profile1.3.png" width="300" alt="Profile"></td>
    <td><img src="screenshots/profileedit1.3.png" width="300" alt="Profile Edit"></td>
    <td><img src="screenshots/stopwatch1.3.png" width="300" alt="Stopwatch"></td>
     <td><img src="screenshots/stopwatchsettings1.3.png" width="300" alt="Stopwatch"></td>
    <td><img src="screenshots/stat1.3.png" width="300" alt="Statistics"></td>
    <td><img src="screenshots/diagram1.3.png" width="300" alt="Diagram"></td>
</tr>
<tr>
    <td><img src="screenshots/cred1.3.png" width="300" alt="Credentials"></td>

</tr>
</table>

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
