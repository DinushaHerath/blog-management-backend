# Blog Management Platform - Backend

A RESTful API backend system for a blog management platform with user authentication, role-based access control, and automatic blog summarization.

## 🚀 Features

- **User Authentication** - JWT-based authentication system
- **Role-Based Access Control** - ADMIN and USER roles with different permissions
- **Blog Management** - CRUD operations for blog posts
- **Auto Summarization** - Automatic generation of blog summaries (first 200 characters)
- **Pagination** - Efficient pagination for blog listings
- **Secure Password Storage** - Bcrypt password hashing
- **Database ORM** - Sequelize for MySQL database management
- **Containerization** - Docker and Docker Compose support

## 🛠️ Tech Stack

- **Runtime**: Node.js (v22.20.0)
- **Framework**: Express.js
- **Database**: MySQL 8.0
- **ORM**: Sequelize
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Containerization**: Docker & Docker Compose
- **Development**: Nodemon

## 📋 Prerequisites

### For Local Development:
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### For Docker:
- Docker Desktop
- Docker Compose

## 🔧 Installation & Setup

### Option 1: Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/DinushaHerath/blog-management-backend.git
cd blog-management-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup MySQL Database**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE blog_db;
```

4. **Configure Environment Variables**
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your configuration
# Update database credentials if needed
```

5. **Run the application**
```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000`

### Option 2: Docker Setup (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/DinushaHerath/blog-management-backend.git
cd blog-management-backend
```

2. **Start with Docker Compose**
```bash
# Build and start all services (MySQL + App)
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

3. **Verify containers are running**
```bash
docker ps
```

4. **View logs**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mysql
```

5. **Stop services**
```bash
# Stop containers
docker-compose down

# Stop and remove volumes (clean database)
docker-compose down -v
```

The API will be available at:
- **App**: `http://localhost:3000`
- **MySQL**: `localhost:3307` (mapped from container port 3306)

## 📊 Database Schema

**Complete SQL Schema:** See [`schema.sql`](schema.sql) for the full database schema file.

**Setup Guide:** See [`DATABASE_SETUP.md`](DATABASE_SETUP.md) for detailed setup instructions.

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('ADMIN', 'USER') DEFAULT 'USER',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id`: Auto-incremented primary key
- `name`: User's full name
- `email`: Unique email address (used for login)
- `password`: Bcrypt hashed password
- `role`: User role (ADMIN or USER)
- `created_at`: Account creation timestamp

### Blogs Table
```sql
CREATE TABLE blogs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  user_id INT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Fields:**
- `id`: Auto-incremented primary key
- `title`: Blog post title
- `content`: Full blog content
- `summary`: Auto-generated summary (first 200 characters)
- `user_id`: Foreign key referencing the author
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

**Relationships:**
- One User can have Many Blogs (One-to-Many)
- Cascade delete: When a user is deleted, all their blogs are deleted

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=blog_db
JWT_SECRET=your_super_secret_jwt_key_here
```

**Variables:**
- `PORT`: Server port (default: 3000)
- `DB_HOST`: MySQL host (use `mysql` for Docker, `localhost` for local)
- `DB_USER`: MySQL username
- `DB_PASSWORD`: MySQL password
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret key for JWT token signing

## 📚 API Documentation

Base URL: `http://localhost:3000`

### Authentication Endpoints

#### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

**Notes:**
- `role` is optional (defaults to "USER")
- Valid roles: "ADMIN", "USER"
- Password is automatically hashed

---

#### 2. Login
**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

**Notes:**
- Token expires in 1 day
- Use token in Authorization header: `Bearer <token>`

---

### User Endpoints

#### 3. Get All Users
**GET** `/users`

Get list of all users (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "created_at": "2026-02-07T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN",
    "created_at": "2026-02-07T09:00:00.000Z"
  }
]
```

**Access:** Admin only

**Errors:**
- `401`: No token provided / Invalid token
- `403`: Access denied (not admin)

---

#### 4. Get User by ID
**GET** `/users/:id`

Get specific user details (Protected - Admin or self only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "created_at": "2026-02-07T10:30:00.000Z"
}
```

**Access:** Admin or the user themselves

**Errors:**
- `401`: No token provided / Invalid token
- `403`: Access denied (not admin and not self)
- `404`: User not found

---

### Blog Endpoints

#### 5. Create Blog
**POST** `/blogs`

Create a new blog post (Authenticated users only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My First Blog Post",
  "content": "This is the full content of my blog post. It can be very long and contain multiple paragraphs. The system will automatically generate a summary from this content."
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "My First Blog Post",
  "content": "This is the full content of my blog post...",
  "summary": "This is the full content of my blog post. It can be very long and contain multiple paragraphs. The system will automatically generate a summary from this content...",
  "user_id": 1,
  "created_at": "2026-02-07T11:00:00.000Z",
  "updated_at": "2026-02-07T11:00:00.000Z"
}
```

**Notes:**
- Summary is auto-generated (first 200 characters + "...")
- user_id is taken from JWT token

---

#### 6. Get All Blogs
**GET** `/blogs`

Get paginated list of all blogs (Public).

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Example:** `/blogs?page=2&limit=5`

**Response (200):**
```json
{
  "total": 25,
  "page": 2,
  "totalPages": 5,
  "blogs": [
    {
      "id": 6,
      "title": "Blog Post Title",
      "content": "Full blog content...",
      "summary": "Auto-generated summary...",
      "user_id": 1,
      "created_at": "2026-02-07T11:00:00.000Z",
      "updated_at": "2026-02-07T11:00:00.000Z",
      "User": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

**Notes:**
- Results are ordered by created_at (newest first)
- Includes author information

---

#### 7. Get Blog by ID
**GET** `/blogs/:id`

Get specific blog post details (Public).

**Response (200):**
```json
{
  "id": 1,
  "title": "My First Blog Post",
  "content": "This is the full content...",
  "summary": "This is the full content...",
  "user_id": 1,
  "created_at": "2026-02-07T11:00:00.000Z",
  "updated_at": "2026-02-07T11:00:00.000Z",
  "User": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- `404`: Blog not found

---

#### 8. Update Blog
**PUT** `/blogs/:id`

Update existing blog post (Owner or Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Blog Title",
  "content": "Updated content..."
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Updated Blog Title",
  "content": "Updated content...",
  "summary": "Updated content...",
  "user_id": 1,
  "created_at": "2026-02-07T11:00:00.000Z",
  "updated_at": "2026-02-07T12:00:00.000Z"
}
```

**Access:** Blog owner or Admin

**Notes:**
- Summary is auto-regenerated if content changes
- Can update title and/or content

**Errors:**
- `401`: No token provided / Invalid token
- `403`: Access denied (not owner and not admin)
- `404`: Blog not found

---

#### 9. Delete Blog
**DELETE** `/blogs/:id`

Delete a blog post (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Blog deleted successfully"
}
```

**Access:** Admin only

**Errors:**
- `401`: No token provided / Invalid token
- `403`: Access denied (not admin)
- `404`: Blog not found

---

### Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "message": "Email already registered"
}
```

**401 Unauthorized:**
```json
{
  "message": "No token provided"
}
```

**403 Forbidden:**
```json
{
  "message": "Access denied"
}
```

**404 Not Found:**
```json
{
  "message": "Blog not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Server error"
}
```

## 🗂️ Project Structure

```
blog-management-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Sequelize database configuration
│   ├── models/
│   │   ├── User.js              # User model
│   │   └── Blog.js              # Blog model
│   ├── routes/
│   │   ├── auth.routes.js       # Authentication routes
│   │   ├── user.routes.js       # User routes
│   │   └── blog.routes.js       # Blog routes
│   ├── controllers/
│   │   ├── auth.controller.js   # Auth business logic
│   │   ├── user.controller.js   # User business logic
│   │   └── blog.controller.js   # Blog business logic
│   ├── middleware/
│   │   ├── auth.middleware.js   # JWT verification
│   │   └── role.middleware.js   # Role-based access control
│   ├── utils/
│   │   └── summary.util.js      # Blog summary generator
│   └── app.js                   # Express app setup & entry point
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── .dockerignore                # Docker ignore rules
├── Dockerfile                   # Docker container configuration
├── docker-compose.yml           # Multi-container orchestration
├── schema.sql                   # Database schema (SQL file)
├── DATABASE_SETUP.md            # Database setup guide
├── DOCKER_SETUP.md              # Docker setup guide
├── DOCKER_TROUBLESHOOTING.md    # Docker troubleshooting
├── POSTMAN_GUIDE.md             # Postman collection usage guide
├── Blog_Management_API.postman_collection.json      # Postman collection
├── Blog_Management_Local.postman_environment.json   # Postman environment
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## 🧪 Testing the API

### Using cURL:

**Register a user:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "USER"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Create a blog (use token from login):**
```bash
curl -X POST http://localhost:3000/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My Blog Post",
    "content": "This is the content of my blog post..."
  }'
```

**Get all blogs with pagination:**
```bash
curl http://localhost:3000/blogs?page=1&limit=10
```

### Using Postman (Recommended):

**Import the Collection:**

1. Open Postman
2. Click **Import** button
3. Import these files:
   - `Blog_Management_API.postman_collection.json`
   - `Blog_Management_Local.postman_environment.json`
4. Select **"Blog Management - Local"** environment (top right)
5. Start testing!

**Features:**
- ✅ All 9 API endpoints pre-configured
- ✅ Automatic token management (auto-saves after login)
- ✅ Automated test scripts for validation
- ✅ Environment variables for easy switching
- ✅ Organized into folders (Auth, Users, Blogs)
- ✅ Sample requests with realistic data

**Quick Start:**
1. Run **"Register User"** or **"Login"** → Token auto-saved
2. Run **"Create Blog"** → Blog ID auto-saved
3. All other protected endpoints work automatically!

**Documentation:** See [`POSTMAN_GUIDE.md`](POSTMAN_GUIDE.md) for detailed usage instructions.

## 🐛 Troubleshooting

### Docker Issues

If you encounter Docker errors:

1. **Restart Docker Desktop**
```bash
# Stop services
docker-compose down

# Restart Docker Desktop from system tray
# Wait for Docker to fully start

# Try again
docker-compose up --build
```

2. **Port conflicts**
```bash
# Check if port is in use
netstat -ano | findstr :3000
netstat -ano | findstr :3307

# Change port in docker-compose.yml if needed
```

3. **Database connection errors**
```bash
# Check MySQL health
docker-compose ps

# View logs
docker-compose logs mysql
```

### Local Development Issues

**MySQL connection failed:**
- Verify MySQL is running
- Check credentials in `.env`
- Ensure `blog_db` database exists

**Module not found errors:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

**Port already in use:**
```bash
# Change PORT in .env
PORT=3001
```

## 📝 Development Notes

### Auto-Summarization Logic

The system automatically generates summaries when:
- Creating a new blog post
- Updating blog content

Summary rules:
- Takes first 200 characters of content
- Adds "..." if content is longer
- Stored in database for performance

### Security Features

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire after 1 day
- Role-based access control
- SQL injection prevention (Sequelize ORM)
- Environment variables for sensitive data

### Database Synchronization

The app automatically syncs database schema on startup:
```javascript
sequelize.sync({ alter: true })
```

This creates tables if they don't exist and updates columns if schema changes.

**Note:** Use migrations in production!

## 📦 Deployment

### Production Checklist:

1. ✅ Set strong `JWT_SECRET`
2. ✅ Use strong MySQL password
3. ✅ Set `NODE_ENV=production`
4. ✅ Use environment variables (not .env file)
5. ✅ Enable HTTPS/SSL
6. ✅ Set up proper logging
7. ✅ Configure CORS if needed
8. ✅ Use database migrations instead of sync
9. ✅ Set up automated backups
10. ✅ Configure rate limiting

## 👨‍💻 Author

**Dinusha Herath**
- GitHub: [@DinushaHerath](https://github.com/DinushaHerath)

## 📄 License

ISC

## 🙏 Acknowledgments

Technical Assignment for Decryptogen - Blog Management Platform Backend System
