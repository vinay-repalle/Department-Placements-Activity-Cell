import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Profile from '../components/Profile';
import { useAuth } from '../context/AuthContext';
import { placementService } from '../services/api';

const StudentProfile = () => {
  const { user } = useAuth();
  const [nocSubmissions, setNocSubmissions] = useState([]);
  const [loadingNoc, setLoadingNoc] = useState(true);

  useEffect(() => {
    const fetchNocSubmissions = async () => {
      setLoadingNoc(true);
      try {
        if (user?._id) {
          const response = await placementService.getAllPlacements();
          // Filter for this student
          const all = response.data?.placements || [];
          const mine = all.filter(p => String(p.student) === String(user._id));
          setNocSubmissions(mine);
        }
      } catch (err) {
        setNocSubmissions([]);
      } finally {
        setLoadingNoc(false);
      }
    };
    fetchNocSubmissions();
  }, [user?._id]);

  // Map user fields to the expected profile fields
  const studentData = user ? {
    profileImage: user.profilePhoto || '/src/assets/profile1.jpg',
    fullName: user.fullName,
    id: user.studentId || user.id,
    mailId: user.email,
    phoneNumber: user.phoneNumber,
    department: user.department,
    yearOfStudy: user.yearOfStudy,
  } : {};

  const overviewFields = [
    { name: 'fullName', label: 'Full Name', type: 'text' },
    { name: 'id', label: 'ID', type: 'text' },
    { name: 'mailId', label: 'Mail ID', type: 'email' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel' },
    {
      name: 'department',
      label: 'Department',
      type: 'select',
      options: ['CSE', 'ECE', 'EEE', 'CIVIL', 'MECH', 'CHEM', 'MME'],
    },
    {
      name: 'yearOfStudy',
      label: 'Year of Study',
      type: 'select',
      options: ['E1', 'E2', 'E3', 'E4'],
    },
  ];

  const handleSave = (updatedData) => {
    // Implement save logic if needed
    console.log('Updated Student Data:', updatedData);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 pb-24">
      <Header />
      <Profile
        profileData={studentData}
        overviewFields={overviewFields}
        onSave={handleSave}
      />
      {/* Removed NOC/Placement Submissions Table */}
      <Footer />
    </div>
  );
};

export default StudentProfile;