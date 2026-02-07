# Database Setup Guide

## Using schema.sql

The `schema.sql` file contains the complete database schema for the Blog Management Platform.

### Method 1: MySQL Command Line

```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source schema.sql

# Or use this command directly
mysql -u root -p < schema.sql
```

### Method 2: MySQL Workbench

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to **File → Open SQL Script**
4. Select `schema.sql`
5. Click the **Execute** button (lightning icon)

### Method 3: Command Line (Single Command)

```bash
# Windows
mysql -u root -p blog_db < schema.sql

# Linux/Mac
mysql -u root -p blog_db < schema.sql
```

### Method 4: Using Docker

If you're using Docker Compose, the database is automatically created when you start the containers:

```bash
docker-compose up -d

# To manually run the schema:
docker exec -i blog_mysql mysql -uroot -proot < schema.sql
```

## Database Schema Overview

### Tables Created:

1. **users** - Stores user accounts
   - Primary Key: `id`
   - Unique: `email`
   - Indexed: `email`, `role`
   - Default role: `USER`

2. **blogs** - Stores blog posts
   - Primary Key: `id`
   - Foreign Key: `user_id` → `users(id)` (CASCADE DELETE)
   - Indexed: `user_id`, `created_at`
   - Auto-generated: `summary`, `created_at`, `updated_at`

### Features:

- ✅ UTF-8 MB4 charset (supports emojis and special characters)
- ✅ InnoDB engine (ACID compliance, foreign keys)
- ✅ Cascade delete (deleting user removes their blogs)
- ✅ Indexes for performance (email, user_id, created_at, role)
- ✅ Auto-timestamps (created_at, updated_at)
- ✅ Sample data included (optional)

### Relationships:

```
users (1) ──────< (Many) blogs
  │
  └── One user can have multiple blogs
      Deleting a user deletes all their blogs (CASCADE)
```

## Sample Data

The schema includes sample data for testing:

### Admin User:
- **Email**: admin@example.com
- **Password**: admin123 (you'll need to hash this)
- **Role**: ADMIN

### Regular User:
- **Email**: john@example.com
- **Password**: user123 (you'll need to hash this)
- **Role**: USER

### Sample Blogs:
- 3 blog posts with realistic content
- Demonstrates auto-generated summaries
- Shows user-blog relationship

**Note:** Passwords in the schema are placeholders. Use the API `/auth/register` endpoint to create users with properly hashed passwords.

## Verification

After running the schema, verify the setup:

```sql
-- Check database
SHOW DATABASES;
USE blog_db;

-- Check tables
SHOW TABLES;

-- Check users table structure
DESCRIBE users;

-- Check blogs table structure
DESCRIBE blogs;

-- View sample data
SELECT * FROM users;
SELECT * FROM blogs;

-- Check relationships
SELECT 
    b.id,
    b.title,
    u.name as author
FROM blogs b
JOIN users u ON b.user_id = u.id;
```

## Troubleshooting

### Error: Database already exists
```sql
-- Drop existing database
DROP DATABASE IF EXISTS blog_db;

-- Then run schema.sql again
```

### Error: Table already exists
The schema includes `DROP TABLE IF EXISTS` statements, so this shouldn't happen.

### Error: Foreign key constraint fails
Make sure you're running the full schema file in order. Users table must be created before blogs table.

### Sequelize Auto-Sync vs Manual Schema

**Option 1: Use schema.sql (Recommended for production)**
- Run schema.sql manually
- Comment out `sequelize.sync()` in app.js
- Use migrations for schema changes

**Option 2: Let Sequelize create tables (Development)**
- Don't run schema.sql
- Keep `sequelize.sync({ alter: true })` in app.js
- Tables auto-created on app startup

## Production Recommendations

For production deployments:

1. **Remove sample data** from schema.sql
2. **Use migrations** instead of `sequelize.sync()`
3. **Backup database** before running schema changes
4. **Use strong passwords** for MySQL root user
5. **Create separate MySQL user** with limited permissions:

```sql
CREATE USER 'blog_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON blog_db.* TO 'blog_user'@'localhost';
FLUSH PRIVILEGES;
```

## Schema Updates

If you need to modify the schema after initial setup:

```sql
-- Add new column
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Add index
CREATE INDEX idx_title ON blogs(title);

-- Modify column
ALTER TABLE blogs MODIFY summary VARCHAR(500);
```

**Better approach:** Use Sequelize migrations for version-controlled schema changes.
