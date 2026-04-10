# SATI Library Management System

[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=111827)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

Production-style full-stack library system for managing books, issue/return workflow, notes/PYQ uploads, fines, and role-based dashboards for Admin and Student users.

## Key Features

- Role-based authentication (`admin` and `student`) with JWT.
- Admin workflows:
	- User management
	- Book management
	- Transaction management (issue requests, issue/return)
	- Fine reports
	- Notes/PYQ management
- Student workflows:
	- Browse/request books
	- View issued books/history
	- Profile management (name, enrollment no., branch, semester, batch year)
	- Upload and access notes/PYQs
- Fine calculation policy in INR.
- Google sign-in support (env-driven).

## Tech Stack

### Backend

- Node.js
- Express
- PostgreSQL (`pg`)
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- File upload (`multer`)

### Frontend

- React + Vite
- React Router
- Axios
- Tailwind CSS
- Lucide Icons
- Google OAuth (`@react-oauth/google`)

## Project Structure

```text
library-main/
	backend/
		src/
			config/
			controllers/
			middleware/
			routes/
			index.js
		scripts/
			db_setup.js
		database.sql
		package.json

	frontend/
		src/
			components/
			pages/
			api.js
			App.jsx
			main.jsx
		package.json

	README.md
```

## Architecture Overview

- Frontend calls backend REST APIs under `/api/*`.
- Backend handles auth, business logic, and PostgreSQL access.
- Notes/PYQ PDFs are uploaded to Cloudinary and stored as secure URLs.
- Frontend uses `VITE_API_URL` for API/file base URL handling.

## Prerequisites

- Node.js `>= 18` (recommended `20+`)
- npm `>= 9`
- PostgreSQL database (Neon or local)

## Environment Configuration

### Backend environment (`backend/.env`)

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_FOLDER=sati-library
```

### Frontend environment (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

## Local Development Setup

### 1) Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Initialize/upgrade database schema

```bash
cd backend
npm run db:setup
```

This command applies `backend/database.sql` in an idempotent way and is safe to re-run.

### 3) Start backend and frontend

Backend:

```bash
cd backend
npm start
```

Frontend:

```bash
cd frontend
npm run dev
```

## NPM Scripts

### Backend (`backend/package.json`)

- `npm start` - run backend server
- `npm run dev` - run backend with nodemon
- `npm test` - run backend logic tests
- `npm run db:setup` - apply database schema/migrations

### Frontend (`frontend/package.json`)

- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`

### Books

- `GET /api/books`
- `GET /api/books/categories`
- `POST /api/books/categories` (admin)
- `POST /api/books` (admin)
- `PUT /api/books/:id` (admin)
- `DELETE /api/books/:id` (admin)

### Admin

- `GET /api/admin/students`
- `PUT /api/admin/students/:id`
- `DELETE /api/admin/students/:id`
- `GET /api/admin/stats`
- `GET /api/admin/reports/fines`

### Transactions

- `GET /api/transactions/requests` (admin)
- `GET /api/transactions/issued` (admin)
- `POST /api/transactions/issue` (admin)
- `POST /api/transactions/return` (admin)

### Student

- `GET /api/student/dashboard`
- `GET /api/student/my-books`
- `GET /api/student/history`
- `GET /api/student/profile`
- `PUT /api/student/profile`
- `POST /api/student/change-password`
- `POST /api/student/request-issue`

## Deployment Notes

### Backend deployment checklist

- Set production env vars (`DATABASE_URL`, `JWT_SECRET`, `PORT`, `GOOGLE_CLIENT_ID`).
- Set Cloudinary env vars (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`).
- Run:

```bash
npm ci
npm run db:setup
npm start
```

- Ensure CORS policy matches frontend domain.
- Ensure `DATABASE_URL` uses SSL for hosted PostgreSQL.
- Ensure Cloudinary account allows raw file upload and credentials are valid.

### Frontend deployment checklist

- Set `VITE_API_URL` to deployed backend URL.
- Set `VITE_GOOGLE_CLIENT_ID` if Google sign-in is enabled.
- Build and deploy static assets:

```bash
npm ci
npm run build
```

### Recommended production concerns

- Add reverse proxy (Nginx, Azure App Service, etc.)
- Enable HTTPS only
- Add request logging and centralized monitoring
- Add rate limiting and secure headers
- Add automated backups for PostgreSQL

## Troubleshooting

- Error: missing DB columns (legacy schema)
	- Run `cd backend && npm run db:setup`
- Error: `Cloudinary is not configured on the server`
	- Add Cloudinary vars in `backend/.env` and restart backend
- Google button not visible
	- Verify `VITE_GOOGLE_CLIENT_ID` and restart frontend dev server
- 401 on protected APIs
	- Ensure valid JWT token in `Authorization: Bearer <token>`
- File links not opening
	- Verify Cloudinary upload succeeded and `file_path` contains a valid URL

## License

This project is currently unlicensed. Add a LICENSE file if you want open-source distribution terms.

