# Alumni Interactive Website - Frontend

This is the frontend application for the Alumni Interactive Website. It is built with React and uses Tailwind CSS for styling.

## Prerequisites
- Node.js (v14 or above)
- npm (v6 or above)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

3. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready files will be in the `dist/` folder.

## Project Structure
```
frontend/
  ├── public/           # Static assets
  ├── src/
  │   ├── assets/       # Images and media
  │   ├── components/   # Reusable React components
  │   ├── context/      # React context providers
  │   ├── pages/        # Page components
  │   ├── services/     # API and validation services
  │   ├── UsersData/    # Sample user data
  │   ├── App.jsx       # Main app component
  │   └── main.jsx      # Entry point
  ├── package.json      # Project metadata and scripts
  └── tailwind.config.js# Tailwind CSS configuration
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Notes
- Make sure the backend server is running for full functionality.
- Update API endpoints in `src/services/api.js` as needed. 