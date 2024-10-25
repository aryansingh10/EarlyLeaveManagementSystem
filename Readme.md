

```bash
 Leave Management System

A web application for managing student leave requests with role-based access for students, coordinators, and HODs. This project enables students to submit leave requests, coordinators to review them, and HODs to approve or reject leave requests.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Installation

Follow these steps to install and run the Leave Management System.

### Prerequisites

Ensure you have Node.js, npm, and MongoDB installed.

**Clone the Repository**:

```bash
git clone https://github.com/yourusername/leave-management-system.git
cd leave-management-system
```

**Backend Setup**:

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

**Environment Variables**:

Create a `.env` file in the backend directory and add the following:

```plaintext
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```

**Run the Backend Server**:

```bash
npm start
```

## Usage

1. **User Roles**:
   - **Student**: Can apply for leave and view the leave status.
   - **Coordinator**: Can review leave requests and update leave status.
   - **HOD**: Has final approval/rejection rights over leave requests.

2. **Authentication**:
   The system uses JWT-based authentication for secure access.

3. **Email Notifications**:
   Configured to send email notifications to users upon leave request updates.

## Features

- Role-based access control (student, coordinator, HOD).
- Leave request application, review, and approval process.
- Email notifications for leave request status updates.
- JWT authentication for secure access.

## API Endpoints

| Method | Endpoint                | Description                                 |
|--------|--------------------------|---------------------------------------------|
| POST   | `/api/auth/register`     | Register a new user                         |
| POST   | `/api/auth/login`        | Login and receive a JWT token               |
| POST   | `/api/leaves/apply`      | Student applies for leave                   |
| PATCH  | `/api/leaves/:id/status` | Coordinator or HOD updates leave status     |
| GET    | `/api/leaves`            | View all leave requests (role-based access) |

### Example Requests

- **Register**:
  
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "password123",
    "role": "student"
  }
  ```

- **Login**:

  ```json
  {
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.


