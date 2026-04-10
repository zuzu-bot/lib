-- Database Schema for Library Management System

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    role VARCHAR(50) DEFAULT 'student', -- 'admin' or 'student'
    enrollment_no VARCHAR(50),
    branch VARCHAR(100),
    semester VARCHAR(50),
    batch_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    isbn VARCHAR(50) UNIQUE,
    quantity INTEGER DEFAULT 1,
    available_quantity INTEGER DEFAULT 1,
    description TEXT,
    summary TEXT,
    genre VARCHAR(100),
    loan_period_days INTEGER DEFAULT 90 CHECK (loan_period_days IN (60, 90, 180)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS issue_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS issued_books (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'issued' -- 'issued', 'returned'
);

CREATE TABLE IF NOT EXISTS fines (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    issued_book_id INTEGER REFERENCES issued_books(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'unpaid', -- 'unpaid', 'paid'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notes_pyqs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'note' or 'pyq'
    category_id INTEGER REFERENCES categories(id),
    year VARCHAR(50),
    subject VARCHAR(255),
    branch VARCHAR(255),
    semester VARCHAR(50),
    file_path TEXT NOT NULL,
    cloudinary_public_id VARCHAR(255),
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    uploader_name VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS book_comments (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS file_comments (
    id SERIAL PRIMARY KEY,
    file_id INTEGER REFERENCES notes_pyqs(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE notes_pyqs ADD COLUMN IF NOT EXISTS year VARCHAR(50);
ALTER TABLE notes_pyqs ADD COLUMN IF NOT EXISTS subject VARCHAR(255);
ALTER TABLE notes_pyqs ADD COLUMN IF NOT EXISTS branch VARCHAR(255);
ALTER TABLE notes_pyqs ADD COLUMN IF NOT EXISTS semester VARCHAR(50);
ALTER TABLE notes_pyqs ADD COLUMN IF NOT EXISTS cloudinary_public_id VARCHAR(255);
ALTER TABLE notes_pyqs ALTER COLUMN file_path TYPE TEXT;
ALTER TABLE notes_pyqs ADD COLUMN IF NOT EXISTS uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE notes_pyqs ADD COLUMN IF NOT EXISTS uploader_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'student';
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS enrollment_no VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS branch VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS semester VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS batch_year INTEGER;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE books ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL DEFAULT 'Untitled';
ALTER TABLE books ADD COLUMN IF NOT EXISTS author VARCHAR(255) NOT NULL DEFAULT 'Unknown';
ALTER TABLE books ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id);
ALTER TABLE books ADD COLUMN IF NOT EXISTS isbn VARCHAR(50);
ALTER TABLE books ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1;
ALTER TABLE books ADD COLUMN IF NOT EXISTS available_quantity INTEGER DEFAULT 1;
ALTER TABLE books ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE books ADD COLUMN IF NOT EXISTS genre VARCHAR(100);
ALTER TABLE books ADD COLUMN IF NOT EXISTS loan_period_days INTEGER DEFAULT 90;
ALTER TABLE books ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
UPDATE books SET quantity = 1 WHERE quantity IS NULL;
UPDATE books SET available_quantity = quantity WHERE available_quantity IS NULL;
UPDATE books SET loan_period_days = 90 WHERE loan_period_days IS NULL;
ALTER TABLE books DROP CONSTRAINT IF EXISTS books_loan_period_days_check;
ALTER TABLE books ADD CONSTRAINT books_loan_period_days_check CHECK (loan_period_days IN (60, 90, 180));

-- Initial data (books only; no seeded students/admins)
INSERT INTO categories (name) VALUES
    ('Computer Science'),
    ('Mechanical'),
    ('Electrical'),
    ('Civil'),
    ('Science'),
    ('Mathematics'),
    ('Literature')
ON CONFLICT DO NOTHING;
