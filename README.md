# Intern Offers Platform – README

This project is a web application designed to support students of vocational schools, technical schools, and universities in finding internships and apprenticeship opportunities. The platform addresses the problem of inefficient and time-consuming search processes by providing a centralized, map-based system tailored specifically to early-career users.

The application enables users to:
- Browse and filter internship and apprenticeship offers
- Search for companies based on industry and location
- Track submitted applications
- Apply directly through the platform

At the same time, companies, institutions, and organizations can:
- Create verified company profiles
- Publish internship offers
- Manage candidate applications

The system also includes an administrative panel for verifying companies and managing users.

---

## Key Features

### For Candidates
- Account registration and authentication
- Profile management
- Browsing and filtering offers
- Applying for internships (with CV upload)
- Tracking submitted applications

### For Employers
- Company profile creation and management
- Branch (location) management
- Publishing and managing offers
- Access to candidate applications
- Downloading candidate CVs

### For Administrators
- Company verification system
- User management (blocking/unblocking)
- Removing inactive accounts and outdated offers

### General Features
- Advanced filtering (location, category, employment type, etc.)
- Map-based search using geolocation
- Responsive and intuitive UI
- Secure authentication and authorization (JWT-based)

---

## System Architecture

The application follows a **three-tier architecture**:
1. **Presentation Layer (Frontend)** – User interface
2. **Application Layer (Backend)** – Business logic
3. **Data Layer** – Database and storage

## Data structure

ERD diagram
![ERD diagram](./docs/erd.PNG)

---

## Backend

[Backend README](backend/README.md)

### Technologies
- **Node.js**
- **NestJS**
- **TypeScript**
- **TypeORM**
- **PostgreSQL**
- **PostGIS** (geospatial queries)
- **Redis** (caching)
- **AWS S3** (file storage)
- **Mapbox API** (geocoding & maps)

### Key Backend Features

- REST API built with NestJS
- JWT-based authentication (access & refresh tokens)
- Role-based authorization (Candidate, Employer, Admin)
- File upload validation (PDF CVs)
- Geolocation-based search (PostGIS)
- External API integration (Mapbox)
- Email verification system
- Data caching with Redis

### Security

- Password hashing
- Token-based authentication
- Role guards for protected endpoints
- Secure file access via backend only
- Input validation on both client and server

### Testing

- Unit and integration tests using **Jest**
- Database integration tests (PostgreSQL & Redis)
- Code coverage: **~86.6%**

![Tests coverage](./docs/be_test.PNG)

---

## Frontend

[Frontend README](frontend/README.md)

### Technologies
- **React**
- **TypeScript**
- **HTML5**
- **CSS3**
- **React Testing Library**
- **Vitest**
- **Leaflet**
- 
### Key Frontend Features

- Component-based architecture (React)
- Reusable UI components
- Form validation (client-side)
- API communication layer
- Route protection based on user roles
- Light and dark mode support
- Interactive map integration (Mapbox)

### UI/UX

- Designed using **Figma**
- Design tokens (colors, spacing, typography)

Design tokens

![Design Tokens](./docs/design_system.PNG)

Design system

![Components](./docs/ds_components.PNG)

Over 40 views

![Views](./docs/ds_views.PNG)

Search view

![Search view](./docs/search_view.PNG)

Offer view

![Offer view](./docs/offer_view.PNG)

### Testing

- Unit tests for components
- Integration tests for forms and user flows
- Tools: **Vitest + React Testing Library**

---

