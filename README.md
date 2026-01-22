📦 Simple Billing, Customer, Invoice & Dashboard System (MERN)
📌 Project Overview

This project is a Simple Billing & Invoicing System built using the MERN stack (MongoDB, Express.js, React, Node.js).

The application simulates a real-world small business billing workflow, where an authenticated user can manage customers, items/products, generate invoices, download invoices as PDF, and view basic sales metrics through a dashboard.

The main focus of this project is clean business logic, proper database design, secure APIs, and clear separation of frontend and backend, rather than complex UI design.

🛠 Tech Stack Used
Backend

Node.js

Express.js

MongoDB & Mongoose

JWT Authentication

PDFKit (Invoice PDF generation)

bcryptjs (Password hashing)

uuid (Invoice number generation)

Security middlewares

Helmet

Rate Limiting

Mongo Sanitize

Frontend

React (Vite)

React Router DOM

Axios

Zustand (State management)

React Hook Form + Zod (Form validation)

Tailwind CSS

Chart.js (Dashboard charts)

📂 Project Structure
billing-system-mern/
│
├── client/        → React frontend
│
├── server/        → Node.js backend
│   ├── models/
│   ├── controllers/
|   ├── constants/
│   ├── routes/
│   ├── middleware/
│   └── utils/
│
├── README.md
└── .gitignore

🔐 1. Authentication Module
Features

User Registration

User Login

JWT-based Authentication

Protected Routes (Backend & Frontend)

Logic

Passwords are hashed using bcrypt

JWT token is generated on login

Token is stored on the frontend and attached to API requests

Protected routes are secured using JWT middleware

This ensures only authenticated users can access billing-related features.

👥 2. Customer Management
Features

Create Customer (Name, Phone, Email, Address)

View Customer List

View Customer Details

Edit Customer

Delete Customer

Logic

Each customer is linked to a specific user

Full CRUD operations using RESTful APIs

Ensures proper user–customer relationship in the database

📦 3. Item / Product Management
Features

Add Item (Name, Price, Stock)

Edit Item

Delete Item

View Item List

Logic

Items are stored per user

Stock value is maintained and updated during invoice creation

Prevents selling items when stock is insufficient

🧾 4. Sales & Invoice Creation
Features

Create invoice for a selected customer

Select multiple items with quantity

Automatic calculation of:

Item total

Invoice subtotal

Grand total

Reduce item stock after successful invoice creation

Link invoice to customer

Logic

Item totals are calculated as price × quantity

Subtotal is calculated by summing all item totals

Stock is reduced only after successful validation

Invoice is stored with full snapshot of item data

📄 5. Invoice PDF Generation
Features

Generate invoice as a PDF

Download invoice PDF

Invoice Includes

Invoice Number

Invoice Date

Customer Details

Item List (Name, Quantity, Price)

Total Amount

Logic

PDF is generated dynamically using PDFKit

No file is stored on the server

PDF is streamed directly to the client for download

📊 6. Dashboard
Displays

Total number of customers

Total number of items

Total number of invoices

Total sales amount

Today’s sales amount

Last 5 invoices

Logic

Dashboard data is calculated using MongoDB aggregation

Charts are rendered using Chart.js

Helps visualize business performance at a glance

📈 7. Simple Reports
Features

Customer-wise invoice list

Date-wise invoice list

Total sales for selected date or date range

Purpose

Demonstrates filtering, querying, and reporting logic

Useful for business analysis

⚙️ Setup Instructions
1️⃣ Backend Setup
cd server
npm install
npm run dev


Create .env file:

PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

2️⃣ Frontend Setup
cd client
npm install
npm run dev

🔐 Environment Variables

Only .env.example is included in the repository.
Actual .env files are excluded for security reasons.

🎥 Demo Video

The demo video explains:

Application flow

Authentication

Invoice creation logic

Stock management

Dashboard calculations

PDF generation

✅ Evaluation Focus

This project focuses on:

Clean code structure

Secure APIs

Proper MongoDB schema design

Correct business logic

Clear explanation of approach

UI design is kept minimal to prioritize logic and correctness.

👨‍💻 Author

Mohammed Faisal
Full-Stack Developer (MERN
