-- Users table
-- DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default superadmin if not exists
-- Password 'Admin@123' hashed with bcrypt (cost 10): $2a$10$7R9.8X/R8x5L2R25H6.H6.6H6.6H6.6H6.6H6.6H6.6H6.6H6.6H6.
-- Actually I should use a real hash. $2a$10$7R9.8X/R8x5L2R25H6.H6.6H6.6H6.6H6.6H6.6H6.6H6.6H6.6H6. is dummy.
-- Let's use a known hash for 'Admin@123'
-- $2a$10$vI8A7as/3tS7D6U6.T8.G.D.y.x.y.x.y.x.y.x.y.x.y.x.y.x. is also dummy.
-- I'll use the initializeDatabase logic in JS to insert it properly with bcrypt if I can't put a valid hash here.
-- But wait, I can just use a real hash if I calculate it.
-- For now, I'll let JS handle the insertion of superadmin to ensure valid bcrypt hashing, but I'll fix the table schema here.

