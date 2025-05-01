# Progress Tracker Frontend

The frontend for Progress Tracker is a React application built with Vite and styled with Tailwind CSS. It provides a responsive, professional user interface for managing projects and tasks. Users can sign up, log in, create/edit/delete projects, and manage tasks with a landing page, a responsive navbar, and interactive project/task lists.

## Features
- **User Authentication**: Sign up and log in with `email`, `password`, `name`, and `country`.
- **Landing Page**: Displays a hero section with a background image and navigation to login/signup.
- **Responsive Navbar**: Standardized buttons (`bg-blue-600`, hover effects) and a hamburger menu for mobile.
- **Project Management**: Create, edit, and delete projects with hover text (“Click the project name to continue”) on desktop and a “!” button on mobile for navigation info.
- **Task Management**: Create, read, update, and delete tasks with `title`, `description`, `status` (To Do, In Progress, Done), `createdAt`, and `completedAt`.
- **Protected Routes**: Restrict access to authenticated users using `PrivateRoute`.
- **Styling**: Tailwind CSS with gradients, rounded cards, and smooth transitions (`scale-105`, `duration-300`).
- **Persistent Authentication**: Fixed refresh issue to maintain login state.

## Tech Stack
- **React**: JavaScript library for building the UI.
- **React Router DOM**: Client-side routing.
- **Tailwind CSS**: Utility-first CSS framework.
- **Vite**: Build tool with hot module replacement.
- **Axios**: HTTP client for API requests.
- **Context API**: State management for authentication.


## Prerequisites
- **Node.js** (v16 or higher): [Download](https://nodejs.org/)
- **Git**: For cloning the repository ([Download](https://git-scm.com/)).
- **Backend Server**: The backend must be running at  (see `Backend/README.md`).

## Setup Instructions

### 1. Clone the Repository
- **Clone the Progress Tracker repository to your local machine**: git clone https:(code for clonning)
- **Navigate to the Frontend directory**: cd (filename)
- **Install Dependencies**: npm install
- **Run the Frontend**: npm run dev
