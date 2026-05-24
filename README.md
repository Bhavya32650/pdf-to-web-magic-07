# Zepnest Service Request Application

A full-stack Service Request Management Application developed as part of the Zepnest Software Developer Internship Assignment.

The application allows users to create and manage home service requests such as plumbing, cleaning, electrical work, and more through a responsive and user-friendly interface.

---

# GitHub Repository

🔗 https://github.com/Bhavya32650/pdf-to-web-magic-07

---

# Demo Video

🎥 Project Demo Video  
(Add your YouTube video link here)
https://youtu.be/OIGiJcjOMec
---

# Features

## Authentication
- User Signup
- User Login
- Session Management using Supabase Authentication

## Service Request Management
- Create Service Requests
- View Service Requests
- Update Request Status
- Delete Requests

## Request Information
- Service Title
- Description
- Category
- Address
- Preferred Service Time

## Additional Features
- Image Upload Support
- Responsive Design
- Modern UI
- Real-Time Backend Integration

---

# Tech Stack

## Frontend
- React
- Vite
- TypeScript
- Tailwind CSS

## Backend & Database
- Supabase
- PostgreSQL Database
- Supabase Authentication
- Supabase Storage

## Deployment
- GitHub
---

# Project Structure

```bash
src/
 ├── components/
 ├── pages/
 ├── hooks/
 ├── integrations/
 ├── services/
 └── App.tsx
```

---

# Database Schema

## Table: service_requests

| Column Name | Type |
|---|---|
| id | bigint |
| title | text |
| description | text |
| category | text |
| address | text |
| preferred_time | text |
| status | text |
| image_url | text |
| user_id | uuid |
| created_at | timestamp |

---

# Installation & Setup

## Clone Repository

```bash
git clone https://github.com/Bhavya32650/pdf-to-web-magic-07.git
```

## Navigate to Project Folder

```bash
cd pdf-to-web-magic-07
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file and configure the required environment variables.

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Note: Actual API keys and credentials are not included for security reasons.

---

# Run Development Server

```bash
npm run dev
```

---

# Assignment Objectives Covered

✅ User Authentication  
✅ CRUD Operations  
✅ Database Integration  
✅ Image Upload  
✅ Responsive UI  
✅ Cloud Deployment  
✅ Modern Frontend Architecture  

---

# Author

## Bhavya Sree

B.Tech - CSE (AI & ML)

---

# Notes

This project was developed for the Zepnest Software Developer Internship Assignment.

The application focuses on full-stack development concepts including authentication, CRUD functionality, database integration, responsive UI design, and cloud deployment.
