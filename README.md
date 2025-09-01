# Knowledge Hub

A full-stack AI-powered document management and Q&A platform.

## Features

- User authentication (register/login)
- Create, edit, delete, and version documents
- AI-powered document summarization and tag generation (Google Gemini)
- Text and semantic search for documents
- Q&A over your document knowledge base
- Activity feed for team collaboration

## Tech Stack

- **Frontend:** React (Vite, React Router)
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **AI:** Google Gemini API for summarization, tagging, and embeddings

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas or local MongoDB instance
- Google Gemini API key

### Setup

#### 1. Clone the repository

```sh
git clone <your-repo-url>
cd fullstack-development
```

#### 2. Configure Environment Variables

- Copy `server/.env.example` to `server/.env` and fill in your values:

```
MONGO_URI=your_mongodb_uri_here
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=5000
```

- (Optional) Edit `client/.env` if your API base URL is different.

#### 3. Install Dependencies

```sh
cd server
npm install

cd ../client
npm install
```

#### 4. Run the App

- Start the backend:

```sh
cd server
npm run dev
```

- Start the frontend:

```sh
cd ../client
npm run dev
```

- The frontend will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).

## Folder Structure

```
client/         # React frontend
server/         # Express backend
```

See each folder's README or code for details.

## API Overview

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT
- `GET /api/docs` — List all documents
- `POST /api/docs` — Create a document
- `PUT /api/docs/:id` — Update a document (with versioning)
- `DELETE /api/docs/:id` — Delete a document
- `GET /api/docs/search/text` — Text search (with optional tag filter)
- `GET /api/docs/search/semantic` — Semantic search
- `POST /api/docs/qa` — Ask a question (Q&A)
- `GET /api/docs/activity/feed` — Recent activity
- `GET /api/docs/:id/versions` — Document version history

## License

MIT

---

**Note:** This project uses the Google Gemini API. Make sure you comply with their terms of service and usage limits.
