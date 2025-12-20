# ICHgram Frontend

This is the frontend of **ICHgram**, a full-featured Instagram-style social media platform built with **React**. It supports user authentication, posting images, comments, likes, following users, notifications, and a real-time chat system. It is part of a fullstack application, with the backend available here: [https://github.com/thomas-marth/ichgram-backend](https://github.com/thomas-marth/ichgram-backend).

---

## 🌐 Live Deployment

- **Frontend**: [https://ichgram-front.vercel.app](https://ichgram-front.vercel.app)
- **Backend API**: [https://ichgram-backend-zq6v.onrender.com](https://ichgram-backend-zq6v.onrender.com)

---

## ⚙️ Tech Stack

- **React** — core UI framework
- **React Router v6** — routing system
- **Redux Toolkit** — global state management
- **RTK Query** — API calls with caching and invalidation
- **Axios** — HTTP client
- **CSS Modules** — scoped styling
- **Socket.IO-client** — real-time communication
- **Yup** — schema validation
- **Emoji Picker (react-emoji-picker)** — emoji selection for messages

---

## 📦 Features

- JWT-based authentication (login, signup, refresh)
- User profiles with editable data and avatars
- Create / edit / delete posts with Cloudinary-hosted images
- Feed of followed users and explore posts
- Like / unlike posts and comments
- Add / delete comments
- Real-time 1:1 chat via Socket.IO
- Live notifications (like, comment, follow)
- Responsive layout with fully modular components
- 404 fallback, protected routes, private layout

---

## 📁 Project Structure

```
src/
├── assets/                # Static assets (images, icons)
├── layouts/               # Layout components (e.g. PrivateLayout)
├── modules/               # Page-level features
├── pages/                 # React Router pages
├── redux/                 # Redux slices and store
│   └── auth/              # Auth slice and root reducer
├── shared/
│   ├── api/               # Axios base and endpoints
│   ├── components/        # Shared reusable UI components
│   ├── hooks/             # Custom React hooks
│   ├── mocks/             # Mock/test data (if any)
│   ├── styles/            # Global and module styles
│   ├── ui/                # UI primitives and helpers
│   └── utils/             # Formatters and utility functions
├── App.jsx                # Root app and routing config
├── main.jsx               # React DOM entry point
```

---

## 🔐 Authentication Flow

- On login/signup, access + refresh tokens are issued
- Tokens are saved in Redux slice (`authSlice`) and refreshed automatically
- Protected routes redirect unauthenticated users

---

## 🧠 State Management

- `authSlice` — handles login/signup/logout/token
- `userSlice` — current user data
- RTK Query auto-generates cache, refetch logic

---

## 🧪 Setup & Run

### 1. Clone repository

```bash
git clone https://github.com/thomas-marth/ichgram-frontend && cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create .env file

```
VITE_API_URL=https://ichgram-backend-zq6v.onrender.com
```

### 4. Run development server

```bash
npm run dev
```

---

## 🧹 Linting & Formatting

```bash
npm run lint      # ESLint
npm run lint:fix  # Auto fix
npm run format    # Prettier
```

---

## 📜 License

This project is for educational purposes only.
