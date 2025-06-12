# User Management System

A comprehensive user management system built with Spring Boot, featuring JWT authentication, role-based authorization, and RESTful APIs.

## Technologies Used

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **H2 Database** (can be switched to PostgreSQL)
- **Maven** for dependency management
- **Lombok** for reducing boilerplate code

## Features

- User registration and login with JWT authentication
- Role-based authorization with Spring Security
- User profile management
- Admin dashboard for user management
- RESTful API endpoints for user operations

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/user-management-system.git
   cd user-management-system
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`.

### H2 Database Console

The H2 console is available at `http://localhost:8080/h2-console` with the following default credentials:
- JDBC URL: `jdbc:h2:mem:userdb`
- Username: `sa`
- Password: `password`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/signin` - Authenticate a user and get JWT token

### User Management

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/{id}` - Get user by ID (Admin or self)
- `PUT /api/users/{id}` - Update user (Admin or self)
- `DELETE /api/users/{id}` - Delete user (Admin only)

### Test Endpoints

- `GET /api/test/all` - Public access
- `GET /api/test/user` - For authenticated users
- `GET /api/test/mod` - For moderator users
- `GET /api/test/admin` - For admin users

## Default Admin User

The system creates a default admin user on startup:
- Username: `admin`
- Password: `admin123`
- Roles: `ROLE_ADMIN`
