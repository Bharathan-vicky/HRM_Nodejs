# HRM Location Backend

Backend API for HRM: location-based attendance with Admin & Employee roles.

## Features
- Register / Login (Admin/Employee)
- Access & Refresh JWT tokens
- Employee CRUD (Admin)
- Set office location (lat, lon, radius)
- Check-in / Check-out with geolocation validation (Haversine via geolib)
- Attendance history, paginated
- Admin reports (filter, CSV/JSON download)
- Swagger UI at `/api-docs`

## Requirements
- Node 18+ recommended
- MongoDB Atlas
- npm

## Setup (local)
1. Clone project and `cd` into it.
2. Copy `.env.example` to `.env` and fill in `MONGO_URI`, `JWT_*` secrets.
3. Install:
   ```bash
   npm install
