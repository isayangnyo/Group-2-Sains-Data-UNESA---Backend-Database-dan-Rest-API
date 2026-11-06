-- SKEMA DATABASE BANK SAMPAH DIGITAL DESA

DROP TABLE IF EXISTS waste_transactions;
DROP TABLE IF EXISTS waste_categories;
DROP TABLE IF EXISTS users;

-- Tabel Users (Data Warga & Pengurus Desa)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    nik VARCHAR(16) UNIQUE NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    rt_rw VARCHAR(10) NOT NULL,
    role VARCHAR(20) DEFAULT 'warga' CHECK (role IN ('warga', 'pengurus')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Waste Categories (Katalog Jenis & Harga Sampah)
CREATE TABLE waste_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    price_per_kg NUMERIC(10, 2) NOT NULL CHECK (price_per_kg >= 0),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Waste Transactions (Transaksi Setor Sampah)
CREATE TABLE waste_transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    weight_kg NUMERIC(6, 2) NOT NULL CHECK (weight_kg > 0),
    total_price NUMERIC(12, 2) NOT NULL CHECK (total_price >= 0),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES waste_categories(category_id) ON DELETE CASCADE
);

-- SAMPLE DATA 

-- Insert Sample Users
INSERT INTO users (full_name, nik, phone_number, rt_rw, role) VALUES
('Budi Santoso', '3578011203900001', '081234567890', 'RT 01/RW 02', 'warga'),
('Siti Aminah', '3578014508920002', '089876543210', 'RT 03/RW 02', 'warga'),
('Pak RT Sukirman', '3578011005850003', '085678901234', 'RT 01/RW 02', 'pengurus');

-- Insert Sample Waste Categories
INSERT INTO waste_categories (category_name, price_per_kg, description) VALUES
('Botol Plastik PET', 3000.00, 'Botol plastik bening bekas air mineral (harus bersih)'),
('Kardus Bekas', 2000.00, 'Kardus kering, tidak basah, dan sudah dilipat'),
('Besi & Logam', 5000.00, 'Potongan besi tua atau kaleng makanan');

-- Insert Sample Transactions
INSERT INTO waste_transactions (user_id, category_id, weight_kg, total_price, status) VALUES
(1, 1, 4.50, 13500.00, 'approved'),
(2, 2, 10.00, 20000.00, 'pending');