Library Management System (LMS)
A full-stack library management application built with Next.js, React, and MongoDB Atlas. This project was developed as part of the Web Application Development Final Examination (Semester 2-2025)

.🚀 Project Overview
This system provides a dual-role interface for managing library resources:
Admin Role: Full CRUD operations on books (including soft delete) and management of user borrowing requests.
User Role: Browsing available books with filter/search functionality and submitting borrowing requests.

Key Technical Features
Next.js Migration: Successfully migrated from a Vite-based environment to Next.js to support robust Backend API routes (/api/*).
Strict Type Safety: 100% any-free implementation. All data models and API responses are governed by strict TypeScript interfaces.
Authentication: Secure login/logout system using JSON Web Tokens (JWT).
Soft Deletion: Implemented book deletion logic that preserves data integrity while hiding "deleted" items from regular users.
Configuration: The system is pre-configured to connect to a MongoDB Atlas cluster and utilizes a secure JWT secret for token signing.

🛠️ Setup & Installation
Follow these steps to run the project locally:
1. Prerequisites
Node.js (v18 or higher recommended)
NPM or Yarn
A MongoDB Atlas cluster with Network Access set to 0.0.0.0/0.
2. Clone and Install: Extract the project folder and navigate to the root directory:  npm install
3. Start the Application: Start the development server:  npm run dev
The application will be available at http://localhost:3000.

🧪 Grading CredentialsUse the following accounts to test role-based features:
ADMIN: admin@test.com. admin123
USER:  user@test.com. user123
📁 API Endpoints
The backend exposes the following paths as required by the examination:
Authentication: POST /api/user/login, POST /api/user/logout 
Book Management: GET, POST, PATCH, DELETE on /api/books 
Borrowing: POST /api/borrow (Create request), PATCH /api/borrow (Admin status update) 
Developed by: Taian Chen (ID: 6630027)