# 📖 BookNest — Server

The backend API for **BookNest**, a free reading platform where users share books and readers bookmark their favorites.

**Live client:** https://book-nest-server-qsw9.vercel.app
**Repository:** https://github.com/almamuncodes/BookNest-server

---

## 📌 Overview

This is the REST API powering BookNest. It handles books (create, read, update, delete), user-specific listings, and a toggle-based bookmarking system, backed by MongoDB.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB (native driver)
- **Other:** CORS, dotenv

---

## 🔌 API Endpoints

### Books

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/items` | Get all books |
| `GET` | `/api/items/:id` | Get a single book by ID |
| `POST` | `/api/items` | Add a new book |
| `PATCH` | `/api/items/:id` | Update a book *(owner only — requires `requesterEmail`)* |
| `DELETE` | `/api/items/:id` | Delete a book *(owner only — requires `requesterEmail`)* |
| `GET` | `/api/items/user/:email` | Get all books posted by a specific user |

### Bookmarks

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/bookmarks` | Toggle a bookmark on/off for a `userId` + `bookId` pair |
| `GET` | `/api/bookmarks/:userId` | Get all bookmarks for a user |

---

## 📦 Request / Response Examples

**Add a book**
```http
POST /api/items
Content-Type: application/json

{
  "title": "The Midnight Cartographer",
  "author": "Elena Voss",
  "description": "A fantasy novel about...",
  "content": "Full text of the book...",
  "coverUrl": "https://example.com/cover.jpg",
  "createdBy": "user@example.com"
}
```

**Toggle a bookmark**
```http
POST /api/bookmarks
Content-Type: application/json

{
  "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
  "bookId": "64f1a2b3c4d5e6f7a8b9c0d2"
}
```
Response:
```json
{ "bookmarked": true }
```

**Update a book (owner only)**
```http
PATCH /api/items/:id
Content-Type: application/json

{
  "requesterEmail": "user@example.com",
  "title": "Updated Title"
}
```

**Delete a book (owner only)**
```http
DELETE /api/items/:id
Content-Type: application/json

{
  "requesterEmail": "user@example.com"
}
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- A MongoDB connection string (Atlas or local)

### 1. Clone the repository

```bash
git clone https://github.com/almamuncodes/BookNest-server.git
cd BookNest-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### 4. Run the server

```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

---

## 🗄️ Database

**Database:** `booknest`

| Collection | Description |
|---|---|
| `book` | All books posted by users |
| `bookmark` | `userId` + `bookId` pairs representing saved books |

---

## 📬 Contact

- **Email:** almamun2026islam@gmail.com
- **Phone:** +880 1994810914
- **Location:** Mymensingh, Bangladesh