# Career Resilience

A full-stack career development platform that helps users evaluate their current technical skills against career requirements, identify skill gaps, and follow personalized development roadmaps.

Career Resilience combines structured career-role data, skill proficiency tracking, career-fit analysis, and progress-based roadmaps into a professional dashboard designed to help users make informed career development decisions.

## Features

### Authentication

- User registration
- Secure login
- JWT-based authentication
- Password hashing using bcrypt
- Protected frontend routes
- Protected backend API endpoints
- Persistent authentication using local storage
- Automatic redirection to login when authentication expires

### Professional Profile

Users can maintain their professional information including:

- Headline
- Professional bio
- Education
- Years of experience
- Location
- LinkedIn profile
- GitHub profile
- Portfolio URL

Profile data is stored in PostgreSQL and accessed through authenticated APIs.

### Skill Management

Users can build and maintain their technical skill profile.

Each skill can contain:

- Skill name
- Category
- Proficiency level
- Years of experience
- Last-used date

Users can:

- Add skills
- View their skills
- Update skill proficiency
- Track experience
- Remove skills

### Career Explorer

The Career Explorer allows users to browse available career paths and understand different technical roles.

Users can:

- Browse career opportunities
- Search careers
- Search by skill or industry
- Filter by industry
- Filter by growth outlook
- View career descriptions
- Analyze their suitability for a career

Example career paths include:

- Full Stack Developer
- Backend Developer
- Frontend Developer
- Data Analyst
- Data Scientist
- AI Engineer
- Cloud Engineer

### Career Fit Analysis

Career Resilience compares the user's current skill profile against the skills required for a selected career.

The analysis provides:

- Career match score
- Number of matched skills
- Number of missing skills
- Matched skill breakdown
- Missing skill breakdown
- Skill importance information

Example:

```text
Full Stack Developer Career Analysis

Match Score: 71.11%

Matched Skills: 9
Missing Skills: 0

Matched Skills
✓ Express.js
✓ Git
✓ JavaScript
✓ Node.js
✓ PostgreSQL
✓ React
✓ REST API
✓ SQL
✓ TypeScript
```

### Personalized Career Roadmaps

Users can generate development roadmaps based on their career skill gaps.

Roadmaps contain individual learning milestones with:

- Skill or milestone title
- Description
- Priority
- Estimated learning hours
- Progress status

Supported statuses include:

```text
pending
in_progress
completed
```

Users can update milestone progress and track overall roadmap completion.

### Dashboard

The application includes a professional career dashboard displaying:

- Career readiness
- Skills tracked
- Average skill proficiency
- Roadmap progress
- Active development focus
- Career readiness visualization
- Skill proficiency visualization
- Current roadmap
- Upcoming learning milestones

## Application Workflow

```text
Register / Login
       |
       v
Professional Profile
       |
       v
Add Technical Skills
       |
       v
Explore Career Paths
       |
       v
Analyze Career Fit
       |
       v
Identify Skill Gaps
       |
       v
Generate Career Roadmap
       |
       v
Complete Learning Milestones
       |
       v
Track Career Readiness
```

## System Architecture

```text
+---------------------------+
|       React Frontend      |
|                           |
| Dashboard                 |
| Career Explorer           |
| Skills                    |
| Roadmaps                  |
| Profile                   |
+-------------+-------------+
              |
              | REST API
              | JWT Authentication
              v
+---------------------------+
|    Node.js / Express API  |
|                           |
| Authentication            |
| Profile Management        |
| Skill Management          |
| Career Analysis           |
| Roadmap Management        |
+-------------+-------------+
              |
              | SQL
              v
+---------------------------+
|        PostgreSQL         |
|                           |
| Users                     |
| Profiles                  |
| Skills                    |
| User Skills               |
| Career Roles              |
| Career Requirements       |
| Roadmaps                  |
| Roadmap Items             |
+---------------------------+
```

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- React Router
- Lucide React
- CSS
- Fetch API

### Backend

- Node.js
- Express.js
- TypeScript
- REST API
- Zod
- JWT
- bcrypt
- Helmet
- Express Rate Limit
- CORS

### Database

- PostgreSQL
- `pg` Node.js PostgreSQL driver
- SQL migrations

### Development & Deployment

- Git
- GitHub
- npm
- Render
- Environment-based configuration

## Project Structure

```text
career-resilience/
|
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
|
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   └── Topbar.jsx
│   │   │   └── ui/
│   │   │       ├── ProgressBar.jsx
│   │   │       └── StatCard.jsx
│   │   ├── config/
│   │   │   └── api.js
│   │   ├── pages/
│   │   │   ├── Careers.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Roadmaps.jsx
│   │   │   └── Skills.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
|
├── .gitignore
└── README.md
```

## API Overview

The backend REST API is available under:

```text
/api/v1
```

### Health

```text
GET /api/v1/health
```

### Authentication

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

### Profile

```text
GET /api/v1/profile
PUT /api/v1/profile
```

### Skills

```text
GET    /api/v1/skills
GET    /api/v1/profile/skills
POST   /api/v1/profile/skills
PUT    /api/v1/profile/skills/:skillId
DELETE /api/v1/profile/skills/:skillId
```

### Careers

```text
GET /api/v1/careers
GET /api/v1/careers/:careerRoleId/analyze
```

### Roadmaps

```text
POST  /api/v1/roadmaps/generate
GET   /api/v1/roadmaps
GET   /api/v1/roadmaps/:roadmapId
PATCH /api/v1/roadmaps/items/:itemId/status
```

## Security

The backend implements several security measures.

### JWT Authentication

Protected endpoints require:

```text
Authorization: Bearer <token>
```

### Password Security

Passwords are hashed using bcrypt before being stored in the database.

### API Protection

The backend uses:

- Helmet for HTTP security headers
- CORS configuration
- Request body size limits
- API rate limiting
- Zod request validation
- JWT authentication middleware
- Environment-based secrets

Sensitive environment variables are excluded from version control.

## Environment Variables

### Backend

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL=postgresql://username@localhost:5432/career_resilience
PORT=8000
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Never commit the real `.env` file or production secrets to GitHub.

### Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

The frontend reads the API URL from the environment, allowing the same application to work in development and production without changing source code.

## Local Development

### Prerequisites

Install:

- Node.js
- npm
- PostgreSQL
- Git

### Clone Repository

```bash
git clone <repository-url>
cd career-resilience
```

### Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Configure the backend environment:

```bash
cp .env.example .env
```

Update the environment values according to your PostgreSQL configuration.

Run database migrations:

```bash
npm run db:migrate
```

Start the development server:

```bash
npm run dev
```

The backend runs by default on:

```text
http://localhost:8000
```

Health check:

```text
http://localhost:8000/api/v1/health
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure:

```text
frontend/.env
```

with:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Start Vite:

```bash
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

## Production Build

### Backend

```bash
cd backend
npm install
npm run build
npm start
```

The TypeScript backend is compiled into the `dist` directory and executed using Node.js.

### Frontend

```bash
cd frontend
npm install
npm run build
```

Vite generates the production frontend inside:

```text
frontend/dist
```

## Deployment Architecture

The production architecture is designed as:

```text
Browser
   |
   v
React / Vite Frontend
   |
   | HTTPS REST API
   v
Node.js + Express Backend
   |
   | Secure Database Connection
   v
PostgreSQL
```

Production configuration uses environment variables so credentials and deployment URLs are not hard-coded into the application.

## Current Development Status

Core application functionality implemented:

- [x] Backend architecture
- [x] PostgreSQL integration
- [x] Database migrations
- [x] User registration
- [x] User login
- [x] JWT authentication
- [x] Protected API routes
- [x] Professional profile
- [x] Skill catalog
- [x] User skill management
- [x] Career-role data
- [x] Career search and filtering
- [x] Career-fit analysis
- [x] Skill-gap identification
- [x] Career roadmap generation
- [x] Roadmap milestone tracking
- [x] Dashboard
- [x] Career Explorer UI
- [x] Skills UI
- [x] Roadmaps UI
- [x] Profile UI
- [x] Login and registration UI
- [x] Responsive application layout
- [x] Environment-based frontend API configuration
- [x] Backend CORS configuration
- [x] API security middleware
- [ ] Production deployment
- [ ] Production database configuration
- [ ] Automated testing
- [ ] CI/CD pipeline

## Future Improvements

Potential improvements include:

- Automated testing
- CI/CD with GitHub Actions
- Password reset workflow
- Email verification
- Advanced career recommendations
- Skill recommendations
- Career comparison
- Learning resource recommendations
- Resume-based skill extraction
- Career progress history
- Analytics and reporting
- Notification system
- Administrative career and skill management

## Project Goal

Career Resilience demonstrates the development of a complete full-stack product rather than an isolated frontend or API.

The project covers:

- REST API architecture
- Authentication and authorization
- Relational database design
- Data validation
- Business logic
- Career-fit calculations
- Skill-gap analysis
- Progress tracking
- Responsive frontend development
- Security configuration
- Production environment management

## License

This project is intended for educational, portfolio, and career-development purposes.