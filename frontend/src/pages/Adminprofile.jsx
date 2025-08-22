import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Profile from '../components/Profile';
import { useAuth } from '../context/AuthContext';

const AdminProfile = () => {
  const { user } = useAuth();

  // Map user fields to the expected profile fields
  const adminData = user ? {
    profileImage: user.profilePhoto || '/src/assets/profile1.jpg',
    fullName: user.fullName,
    collegeId: user.collegeId,
    mailId: user.email,
    phoneNumber: user.phoneNumber,
    designation: user.designation,
    role: user.role,
    department: user.department,
  } : {};

  const overviewFields = [
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'collegeId', label: 'College ID', type: 'text' },
    { name: 'mailId', label: 'Email ID', type: 'email' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
    { name: 'designation', label: 'Designation', type: 'text' },
    { name: 'role', label: 'Role', type: 'text' },
    { name: 'department', label: 'Department', type: 'text' },
  ];

  const handleSave = (updatedData) => {
    // Implement save logic if needed
    console.log('Updated Admin Data:', updatedData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <Profile
        profileData={adminData}
        overviewFields={overviewFields}
        onSave={handleSave}
      />
      <Footer />
    </div>
  );
};

export default AdminProfile;