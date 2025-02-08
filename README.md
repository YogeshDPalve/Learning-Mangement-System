# Learning Management System 

This project is a full-stack Learning Management System (LMS) built with React, Redux, and Node.js. It allows users to create, manage, and enroll in courses, track progress, and handle user authentication.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
 
## Features

- User Authentication (Register, Login, Logout)
- Course Creation and Management
- Lecture Creation and Management
- Course Enrollment
- Progress Tracking
- Dark Mode Support

## Project Structure

### Root Directory

    .
    ├── .gitignore
    ├── client
    ├── package.json
    ├── README.md
    ├── server

### Client Directory

    client/
    ├── .gitignore
    ├── components.json
    ├── eslint.config.js
    ├── index.html
    ├── jsconfig.json
    ├── package.json
    ├── postcss.config.js
    ├── public/
    ├── README.md
    ├── src/
    │   ├── app/
    │   ├── App.css
    │   ├── App.jsx
    │   ├── assets/
    │   ├── components/
    │   ├── DarkMode.jsx
    │   ├── features/
    │   ├── index.css
    │   ├── layout/
    │   ├── lib/
    │   ├── main.jsx
    │   ├── pages/
    │   │   ├── admin/
    │   │   │   ├── course/
    │   │   │   │   ├── AddCourse.jsx
    │   │   │   │   ├── CourseTab.jsx
    │   │   │   │   ├── CourseTable.jsx
    │   │   │   │   ├── CreateLecture.jsx
    │   │   │   │   ├── LectureTab.jsx
    │   │   │   ├── createLecture/
    │   │   │   │   ├── CreateLecture.jsx
    │   │   │   ├── lecture/
    │   │   │   │   ├── Lecture.jsx
    │   │   ├── student/
    │   │   │   ├── Course.jsx
    │   │   │   ├── CourseDetail.jsx
    │   │   │   ├── CourseProgress.jsx
    │   │   │   ├── Courses.jsx
    │   │   │   ├── HeroSection.jsx
    │   │   │   ├── MyLearning.jsx
    │   │   │   ├── Profile.jsx
    │   ├── components/
    │   │   ├── RichTextEditor.jsx
    │   │   ├── ui/
    │   │   │   ├── avatar.jsx
    │   │   │   ├── badge.jsx
    │   │   │   ├── button.jsx
    │   │   │   ├── card.jsx
    │   │   │   ├── dialog.jsx
    │   │   │   ├── dropdown-menu.jsx
    │   │   │   ├── input.jsx
    │   │   │   ├── label.jsx
    │   │   │   ├── select.jsx
    │   │   │   ├── sheet.jsx
    │   │   │   ├── skeleton.jsx
    │   │   │   ├── table.jsx
    │   │   │   ├── tooltip.jsx
    ├── tailwind.config.js
    ├── vite.config.js

### Server Directory

    server/
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── controllers/
    ├── database/
    │   ├── db.js
    ├── index.js
    ├── middlewares/
    ├── models/
    │   ├── courseProgress.model.js
    ├── package.json
    ├── routes/
    ├── uploads/
    ├── utils/

## Installation

### Prerequisites

- Node.js
- npm or yarn
- MongoDB

### Client

1. Navigate to the `client` directory:

   ```sh
   cd client
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

### Server

1. Navigate to the `server` directory:

   ```sh
   cd server
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file based on `.env.example` and configure your environment variables.

4. Start the development server:
   ```sh
   npm run dev
   ```

## Usage

### Client

- The client application is built with React and Vite.
- The main entry point is `main.jsx`.
- The application uses Redux for state management and React Router for routing.

### Server

- The server application is built with Node.js and Express.
- The main entry point is `index.js`.
- The application uses MongoDB for the database.

## API Endpoints

### User

- `POST /api/v1/user/register` - Register a new user
- `POST /api/v1/user/login` - Login a user
- `GET /api/v1/user/logout` - Logout a user
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile/update` - Update user profile

### Course

- `POST /api/v1/course` - Create a new course
- `GET /api/v1/course/published-courses` - Get all published courses
- `GET /api/v1/course` - Get all courses created by the user
- `PUT /api/v1/course/:courseId` - Edit a course
- `GET /api/v1/course/:courseId` - Get course details by ID
- `POST /api/v1/course/:courseId/lectures` - Create a new lecture
- `GET /api/v1/course/:courseId/lectures` - Get all lectures for a course
- `POST /api/v1/course/:courseId/lectures/:lectureId` - Edit a lecture
- `DELETE /api/v1/course/lectures/:lectureId` - Remove a lecture
- `GET /api/v1/course/lectures/:lectureId` - Get lecture details by ID
- `PATCH /api/v1/course/:courseId` - Toggle course publish status

### Progress

- `GET /api/v1/progress/:courseId` - Get course progress
- `POST /api/v1/progress/:courseId/lecture/:lectureId/view` - Update lecture progress
- `POST /api/v1/progress/:courseId/complete` - Mark course as completed
- `POST /api/v1/progress/:courseId/incomplete` - Mark course as incomplete

### Purchase

- `POST /api/v1/purchase/checkout/create-checkout-session` - Create a checkout session
- `POST /api/v1/purchase/webhook` - Stripe webhook
- `GET /api/v1/purchase/course/:courseId/details-with-status` - Get course details with purchase status
- `GET /api/v1/purchase` - Get all purchased courses

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
