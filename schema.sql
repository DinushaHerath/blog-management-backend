-- ================================================
-- Blog Management Platform - Database Schema
-- ================================================
-- Author: Dinusha Herath
-- Date: February 7, 2026
-- Description: MySQL database schema for blog management system
-- ================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS blog_db;
USE blog_db;

-- ================================================
-- Table: users
-- Description: Stores user account information
-- ================================================

DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'USER') DEFAULT 'USER' NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Table: blogs
-- Description: Stores blog posts with auto-summary
-- ================================================

CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- Sample Data (Optional - for testing)
-- ================================================

-- Insert sample admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2a$10$YourHashedPasswordHere', 'ADMIN');

-- Insert sample regular user
-- Password: user123 (hashed with bcrypt)
INSERT INTO users (name, email, password, role) VALUES
('John Doe', 'john@example.com', '$2a$10$YourHashedPasswordHere', 'USER');

-- Insert sample blog posts
INSERT INTO blogs (title, content, summary, user_id) VALUES
(
    'Getting Started with Node.js',
    'Node.js is a powerful JavaScript runtime built on Chrome''s V8 JavaScript engine. It allows developers to build scalable network applications using JavaScript on the server side. In this blog post, we will explore the basics of Node.js and how to get started with building your first application.',
    'Node.js is a powerful JavaScript runtime built on Chrome''s V8 JavaScript engine. It allows developers to build scalable network applications using JavaScript on the server side. In this blog post...',
    2
),
(
    'Introduction to Express.js',
    'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies the process of building RESTful APIs and web applications with Node.js.',
    'Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It simplifies the process of building RESTful APIs...',
    2
),
(
    'Database Design Best Practices',
    'Designing a good database schema is crucial for application performance and maintainability. In this post, we discuss normalization, indexing strategies, foreign key constraints, and other best practices that every developer should know when working with relational databases.',
    'Designing a good database schema is crucial for application performance and maintainability. In this post, we discuss normalization, indexing strategies, foreign key constraints, and other best...',
    1
);

-- ================================================
-- Verification Queries
-- ================================================

-- View all tables
SHOW TABLES;

-- Describe users table
DESCRIBE users;

-- Describe blogs table
DESCRIBE blogs;

-- Count users
SELECT COUNT(*) as total_users FROM users;

-- Count blogs
SELECT COUNT(*) as total_blogs FROM blogs;

-- ================================================
-- Useful Queries for Development
-- ================================================

-- Get all blogs with author information
-- SELECT 
--     b.id,
--     b.title,
--     b.summary,
--     b.created_at,
--     u.name as author_name,
--     u.email as author_email
-- FROM blogs b
-- INNER JOIN users u ON b.user_id = u.id
-- ORDER BY b.created_at DESC;

-- Get user with blog count
-- SELECT 
--     u.id,
--     u.name,
--     u.email,
--     u.role,
--     COUNT(b.id) as blog_count
-- FROM users u
-- LEFT JOIN blogs b ON u.id = b.user_id
-- GROUP BY u.id;

-- ================================================
-- Cleanup Queries (Use with caution!)
-- ================================================

-- Delete all blogs
-- DELETE FROM blogs;

-- Delete all users (this will cascade delete all blogs)
-- DELETE FROM users;

-- Reset auto increment
-- ALTER TABLE users AUTO_INCREMENT = 1;
-- ALTER TABLE blogs AUTO_INCREMENT = 1;

-- Drop all tables
-- DROP TABLE IF EXISTS blogs;
-- DROP TABLE IF EXISTS users;

-- Drop database
-- DROP DATABASE IF EXISTS blog_db;
