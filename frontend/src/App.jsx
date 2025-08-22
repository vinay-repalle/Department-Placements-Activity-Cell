import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import StudentPage from './pages/StudentPage';
import AlumniPage from './pages/AlumniPage';
import FacultyPage from './pages/FacultyPage';
import Departments from './pages/Departments';
import AboutUs from './pages/AboutUs';
import PlacementsPage from './pages/PlacementsPage';
import Sessions from './pages/Sessions';
import AdminProfile from './pages/Adminprofile';
import FacultyProfile from './pages/FacultyProfile';
import StudentProfile from './pages/StudentProfile';
import AlumniProfile from './pages/AlumniProfile';
import Statistics from './pages/Statistics';
import SessionUpload from './components/SessionUpload';
import Notifications from './pages/Notifications';
import AdminSessionRequests from './pages/AdminSessionRequests';
import AdminNOCSubmissions from './pages/AdminNOCSubmissions';
import AdminPlacementDrives from './pages/AdminPlacementDrives';

// Components
import StudentSignUp from './components/StudentSignUp';
import AlumniSignUp from './components/AlumniSignUp';
import FacultySignUp from './components/FacultySignUp';
import AdminSignUp from './components/AdminSignUp';
import SignIn from './components/SignIn';
import RoleSelection from './components/RoleSelection';
import ForgotPassword from './components/ForgotPassword';
import SessionForm from './components/SessionForm';
import AdminNotifications from './components/AdminNotifications';
import Chatbot from './components/Chatbot';
import HomeRedirector from './components/HomeRedirector';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <NavigationProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomeRedirector />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/select-role" element={<RoleSelection />} />
                <Route path="/studentsignup" element={<StudentSignUp />} />
                <Route path="/alumnisignup" element={<AlumniSignUp />} />
                <Route path="/facultysignup" element={<FacultySignUp />} />
                <Route path="/adminsignup" element={<AdminSignUp />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/placements" element={<PlacementsPage />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/admin/session-requests" element={<AdminSessionRequests />} />
                <Route path="/admin/noc-submissions" element={<AdminNOCSubmissions />} />
                <Route path="/admin/placement-drives" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPlacementDrives />
                  </ProtectedRoute>
                } />

                {/* Protected Routes with Role-based Access */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPage />
                  </ProtectedRoute>
                } />
                <Route path="/student" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentPage />
                  </ProtectedRoute>
                } />
                <Route path="/alumni" element={
                  <ProtectedRoute allowedRoles={['alumni']}>
                    <AlumniPage />
                  </ProtectedRoute>
                } />
                <Route path="/faculty" element={
                  <ProtectedRoute allowedRoles={['faculty']}>
                    <FacultyPage />
                  </ProtectedRoute>
                } />
                <Route path="/adminprofile" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminProfile />
                  </ProtectedRoute>
                } />
                <Route path="/statistics" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Statistics />
                  </ProtectedRoute>
                } />
                <Route path="/sessionupload" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SessionUpload />
                  </ProtectedRoute>
                } />
                <Route path="/adminnotifications" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminNotifications />
                  </ProtectedRoute>
                } />
                <Route path="/studentprofile" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentProfile />
                  </ProtectedRoute>
                } />
                <Route path="/alumniprofile" element={
                  <ProtectedRoute allowedRoles={['alumni']}>
                    <AlumniProfile />
                  </ProtectedRoute>
                } />
                <Route path="/facultyprofile" element={
                  <ProtectedRoute allowedRoles={['faculty']}>
                    <FacultyProfile />
                  </ProtectedRoute>
                } />
                <Route path="/sessionform" element={
                  <ProtectedRoute allowedRoles={['admin', 'faculty', 'alumni']}>
                    <SessionForm />
                  </ProtectedRoute>
                } />
                
                {/* Notifications Route - Accessible to all authenticated users */}
                <Route path="/notifications" element={
                  <ProtectedRoute allowedRoles={['admin', 'student', 'alumni', 'faculty']}>
                    <Notifications />
                  </ProtectedRoute>
                } />
              </Routes>
              <Chatbot />
            </div>
          </Router>
        </NavigationProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;