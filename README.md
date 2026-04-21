# 💭 Thinkofu

> *"If you miss someone, let them know"*

I build stuff i want to use so this is something i had wanted to build for such a long time.
A real-time intimate messaging app built for two. No feeds, no distractions — just a simple way to let your partner know you're thinking of them.

🔗 **Link:** [thinkofu.up.railway.app](https://ingenious-fascination-production-7b44.up.railway.app)

---

## Features

- **Real-time notifications** — messages are delivered instantly via WebSockets
- **JWT Authentication** — secure register and login with bcrypt password hashing
- **Partnership system** — link your account with one other person
- **Message history** — last 20 messages persisted in PostgreSQL
- **Auto-scroll** — chat always scrolls to the latest message
- **Protected routes** — unauthenticated users are redirected to login
- **Responsive design** — works on mobile and desktop

---

## Tech Stack

### Backend
- **Node.js** + **Express** — REST API
- **Socket.io** — real-time bidirectional communication
- **PostgreSQL** — relational database with foreign keys and constraints
- **bcrypt** — password hashing
- **JWT** — stateless authentication
- **pg** (node-postgres) — database connection pooling

### Frontend
- **React**  — component-based UI
- **React Router** — client-side routing with protected routes
- **Socket.io Client** — real-time connection to backend
- **Tailwind CSS** — utility-first styling

### Infrastructure
- **Railway** — backend, frontend, and PostgreSQL all deployed on Railway

---

## Architecture

```
client/                     # React frontend
└── src/
    ├── pages/
    │   ├── auth/
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
    │   ├── app/
    │   │   └── Home.jsx
    │   └── component/
    │       └── ProtectedRoute.jsx
    └── App.jsx

server/                     # Node.js backend
├── Routes/
│   ├── auth.js             # POST /auth/register, POST /auth/login
│   ├── messages.js         # GET /messages, POST /messages
│   └── partnerships.js     # GET /partnerships, POST /partnerships
├── middleware/
│   └── auth.js             # JWT verification middleware
├── db.js                   # PostgreSQL connection pool
└── server.js               # Express + Socket.io setup
```

---

## How It Works

### Authentication Flow
1. User registers with name, username, and password
2. Password is hashed with **bcrypt** before storing
3. On login, server verifies credentials and returns a **JWT**
4. JWT is stored in `localStorage` and sent in every request header

### Real-time Messaging
1. On `/home` mount, React connects to Socket.io passing the JWT in the handshake
2. Server verifies the token in `io.use()` middleware and maps `userId → socket`
3. When a message is sent via `POST /messages`, the server:
   - Saves it to PostgreSQL
   - Emits a `"send"` event directly to the receiver's socket if online
4. If the receiver is offline, they see the message on next load via `GET /messages`

### Partnership System
- Each user can be linked to exactly one partner
- Enforced via `UNIQUE` constraints on both `user1_id` and `user2_id` in the `partnerships` table
- The receiver is always inferred from the partnership — never trusted from the request body

---

## Database

```sql
users
  id        SERIAL PRIMARY KEY
  name      TEXT NOT NULL
  username  TEXT NOT NULL UNIQUE
  password  TEXT NOT NULL  -- bcrypt hash

messages
  id            SERIAL PRIMARY KEY
  sender        INTEGER NOT NULL REFERENCES users(id)
  receiver      INTEGER NOT NULL REFERENCES users(id)
  message_sent  TEXT NOT NULL
  time_sent     TIMESTAMPTZ NOT NULL DEFAULT NOW()

partnerships
  id          SERIAL PRIMARY KEY
  user1_id    INTEGER UNIQUE NOT NULL REFERENCES users(id)
  user2_id    INTEGER UNIQUE NOT NULL REFERENCES users(id)
  created_at  TIMESTAMPTZ DEFAULT NOW()
```

---

## Running Locally

### Prerequisites
- Node.js 
- PostgreSQL

### Backend

```bash
cd server
npm install
```

Create a `.env` file:

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=thinkingofyou
DB_PASSWORD=
DB_PORT=5432
CLIENT_URL=http://localhost:5173
PORT=3000
```

Create the database and tables:

```bash
psql -U postgres
CREATE DATABASE thinkingofyou;
\c thinkingofyou
```

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL
);
ALTER TABLE users ADD CONSTRAINT unique_username UNIQUE (username);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender INTEGER NOT NULL REFERENCES users(id),
  receiver INTEGER NOT NULL REFERENCES users(id),
  message_sent TEXT NOT NULL,
  time_sent TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE partnerships (
  id SERIAL PRIMARY KEY,
  user1_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
  user2_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Start the server:

```bash
npm start
```

### Frontend

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev
```

---

## Security Considerations

- Passwords are never stored in plain text — only bcrypt hashes
- The `sender` field is always derived from the JWT, never trusted from the request body
- Socket.io connections are authenticated via JWT handshake before the connection is established
- CORS is configured to only allow requests from the known client origin

---

## Author

Built by **Alejandro** — a software engineering student
