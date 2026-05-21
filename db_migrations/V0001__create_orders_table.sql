CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    product TEXT,
    message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);