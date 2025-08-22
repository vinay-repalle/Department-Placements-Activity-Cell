import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Profile from '../components/Profile';
import { useAuth } from '../context/AuthContext';

const FacultyProfile = () => {
  const { user } = useAuth();

  // Map user fields to the expected profile fields
  const facultyData = user ? {
    profileImage: user.profilePhoto || '/src/assets/profile1.jpg',
    fullName: user.fullName,
    collegeId: user.collegeId || user.facultyId,
    mailId: user.email,
    phoneNumber: user.phoneNumber,
    designation: user.designation,
    department: user.department,
  } : {};

  const overviewFields = [
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'collegeId', label: 'College ID', type: 'text' },
    { name: 'mailId', label: 'Email ID', type: 'email' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
    { name: 'designation', label: 'Designation', type: 'text' },
    { name: 'department', label: 'Department', type: 'text' },
  ];

  const handleSave = (updatedData) => {
    // Implement save logic if needed
    console.log('Updated Faculty Data:', updatedData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <Profile
        profileData={facultyData}
        overviewFields={overviewFields}
        onSave={handleSave}
      />
      <Footer />
    </div>
  );
};

export default FacultyProfile;