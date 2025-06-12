# User Management System

A comprehensive user management system with a Spring Boot backend and React frontend, featuring JWT authentication, role-based authorization, and a responsive UI.

## Project Structure

The project is organized into two main directories:

- **`/backend`**: Spring Boot application with JWT authentication and RESTful APIs
- **`/frontend`**: React application with Tailwind CSS for the user interface

## Technologies Used

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **H2 Database** (can be switched to PostgreSQL)
- **Maven** for dependency management
- **Lombok** for reducing boilerplate code

### Frontend
- **React** with functional components and hooks
- **React Router** for navigation
- **Axios** for API requests
- **Tailwind CSS** for styling
- **JWT** for authentication

## Features

- User registration and login with JWT authentication
- Role-based authorization with Spring Security
- Protected routes for authenticated users
- User profile management
- Admin dashboard for user management
- Responsive UI with Tailwind CSS
- JWT token validation and automatic logout on expiration

## Getting Started

### Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- Node.js 14 or higher
- npm 6 or higher

### Backend Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the project:
   ```bash
   mvn clean install
   ```

3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`.

### Frontend Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:3000`.

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
