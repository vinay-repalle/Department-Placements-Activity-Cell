# Alumni Interactive Website

A comprehensive full-stack web application for alumni interaction, built with React frontend and Node.js backend.

## 🚀 Features

- **User Authentication**: Multi-role authentication (Admin, Faculty, Alumni, Student)
- **Session Management**: Request and manage interactive sessions
- **Notifications**: Real-time notification system
- **Statistics**: Comprehensive analytics and reporting
- **Profile Management**: User profile management with role-based access
- **Placements**: Placement tracking and progress monitoring
- **Blogs**: Content management system for department blogs

## 🏗️ Project Structure

This project is organized as a monorepo with two main parts:

- **frontend/**: React + Vite application (client)
- **server/**: Node.js/Express backend (API server)

```
alumni_interactive_website/
├── frontend/          # React app (Vite, Tailwind, etc.)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   └── services/      # API services
│   └── public/            # Static assets
├── server/            # Node.js/Express backend
│   ├── controllers/   # Route controllers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── middleware/    # Custom middleware
│   └── utils/         # Utility functions
└── vercel.json        # Vercel deployment configuration
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Multer** - File upload handling

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev   # Starts the React app on localhost:5173
```

### Backend Setup
```bash
cd server
npm install
# Create .env file with your configuration
npm run dev   # Starts the backend server
```

### Environment Variables

Create `.env` files in both `frontend/` and `server/` directories:

**server/.env:**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

**frontend/.env:**
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### GitHub Deployment
1. Initialize Git repository (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub and push your code:
   ```bash
   git remote add origin https://github.com/yourusername/alumni-interactive-website.git
   git branch -M main
   git push -u origin main
   ```

### Vercel Deployment
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

3. Follow the prompts to configure your deployment:
   - Link to your GitHub repository
   - Set environment variables in Vercel dashboard
   - Configure build settings

### Environment Variables for Production
Set these in your Vercel dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `NODE_ENV=production`

## 📱 Usage

1. **Registration**: Users can register with different roles (Admin, Faculty, Alumni, Student)
2. **Authentication**: Secure login with JWT tokens
3. **Dashboard**: Role-based dashboards with relevant features
4. **Sessions**: Request and manage interactive sessions
5. **Notifications**: Real-time notification system
6. **Profile**: Update personal information and preferences

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@alumni-website.com or create an issue in the GitHub repository.

---

**Note**: Make sure to update the environment variables and configuration according to your specific deployment requirements.
