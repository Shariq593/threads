# Threads Clone

A full-stack social media app inspired by Meta Threads — built with the MERN stack, Cloudinary for media, and JWT auth via httpOnly cookies.

**Live demo →** [threads-v0oe.onrender.com](https://threads-v0oe.onrender.com)

> **Test account**
> `username: demo123` · `password: demo123456`

---

## Features

| Feature | Details |
|---|---|
| Auth | Signup / Login / Logout with JWT (httpOnly cookie) |
| Posts | Create, delete, edit posts with optional image upload |
| Feed | Home feed (following + own posts), suggested posts when following nobody |
| Explore | Browse all posts with pagination |
| Search | Find users by username or name, follow inline |
| Notifications | Likes, replies, follows, reposts — with unread badge |
| Bookmarks | Save posts and view them later |
| Repost | One-click repost with count tracking |
| Suggested Users | Top unfollowed accounts shown on home feed |
| Follow / Unfollow | Follow users to populate your feed |
| Like / Unlike | Optimistic UI update |
| Reply | Threaded replies on posts |
| Dark / Light mode | Toggle via the logo |
| Responsive | Works across all screen sizes |

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Chakra UI
- Recoil (global state)
- React Router v6

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT auth (httpOnly cookies)
- Cloudinary (image uploads)
- bcryptjs

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account

### Clone & install

```bash
git clone https://github.com/Shariq593/threads.git
cd threads

# Install backend deps
cd BackEnd && npm install

# Install frontend deps
cd ../FrontEnd && npm install
```

### Environment variables

Create `BackEnd/.env`:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000   # or your Vercel URL in production
```

### Run locally

```bash
# Terminal 1 — backend (runs on :8000)
cd BackEnd && npm run dev

# Terminal 2 — frontend (runs on :3000)
cd FrontEnd && npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

| Service | Purpose |
|---|---|
| [Render](https://render.com) | Node.js backend — set Root Directory to `BackEnd` |
| [Vercel](https://vercel.com) | React frontend — set Root Directory to `FrontEnd` |

After deploying, set `FRONTEND_URL` on Render to your Vercel URL so CORS works correctly.

---

## Project Structure

```
threads/
├── BackEnd/
│   ├── Controller/       # Route handlers
│   ├── Routes/           # Express routers
│   ├── model/            # Mongoose schemas
│   ├── middlewares/      # JWT auth guard
│   └── server.js
└── FrontEnd/
    └── src/
        ├── components/   # Reusable UI
        ├── pages/        # Route-level pages
        ├── hooks/        # Custom hooks
        └── atoms/        # Recoil state
```
