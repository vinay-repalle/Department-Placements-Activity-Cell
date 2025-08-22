# Alumni Interactive Website - Server

This is the backend server for the Alumni Interactive Website. It is built with Node.js, Express, and MongoDB.

## Prerequisites
- Node.js (v14 or above)
- npm (v6 or above)
- MongoDB (local or cloud instance)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Create a `.env` file in the `server/` directory with your MongoDB URI and any other secrets.
3. **Run the server:**
   ```bash
   npm start
   ```
   The server will run on [http://localhost:5000](http://localhost:5000) by default.

## Project Structure
```
server/
  ├── controllers/   # Route controllers
  ├── jobs/          # Scheduled/background jobs
  ├── middleware/    # Express middleware
  ├── models/        # Mongoose models
  ├── routes/        # API route definitions
  ├── utils/         # Utility functions (email, excel, etc.)
  ├── server.js      # Main server entry point
  └── package.json   # Project metadata and scripts
```

## API Endpoints
- Auth: `/api/auth` (login, signup, etc.)
- Users: `/api/users`
- Notifications: `/api/notifications`
- Sessions: `/api/sessions`
- Placements: `/api/placements`
- Statistics: `/api/statistics`

## Available Scripts
- `npm start` - Start the server
- `npm run dev` - Start with nodemon (if configured)

## Notes
- Ensure MongoDB is running and accessible.
- Update configuration and secrets in `.env` as needed. 