# Job Portal API

An employment platform API connecting employers with job seekers. It features role-based access, JWT authentication, and a structured application workflow.

## Tech Stack
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Auth:** JWT, bcrypt

## Actors & Roles
- **Seeker:** Can view jobs, apply to jobs, track applications.
- **Employer:** Can create companies, post jobs, manage applications.
- **Recruiter:** Can post jobs on behalf of an employer and manage applications.
- **Admin:** Has full access to all resources.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory (one is provided for local dev).
```
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/jobportal
JWT_SECRET=supersecretjwtkey_replace_me_in_production
```

### 3. Run the Server
```bash
# Start server
# Or start with nodemon for development
npm run dev
```
The server will run at `http://localhost:8080`.

## Interactive API Documentation (Swagger)
You can test all endpoints directly from your browser! Once the server is running, navigate to:
👉 **`http://localhost:8080/api-docs`**

## Key Endpoints

- `POST /api/auth/register`: Register user
- `POST /api/auth/login`: Login user
- `GET /api/companies`: View companies
- `POST /api/companies`: Create company (Employer/Admin)
- `GET /api/jobs`: View jobs
- `POST /api/jobs`: Post a job (Employer/Recruiter/Admin)
- `GET /api/applications`: Get applications for jobs (Seeker views theirs, Employer views applications for their jobs)
- `POST /api/applications`: Apply for a job (Seeker)

## Postman / API Testing
All protected endpoints require an `Authorization` header formatted as:
`Authorization: Bearer <your_token>`
