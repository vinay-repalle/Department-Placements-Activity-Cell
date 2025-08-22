import { dummyStudents, dummyAlumni } from '../UsersData/dummyData';

// Validate student data
export const validateStudentData = async (email, studentId) => {
  try {
    const student = dummyStudents.find(s => s.Email === email && s.Id === studentId);
    
    if (!student) {
      throw new Error('Invalid student credentials. Please check your email and student ID.');
    }
    
    return { isValid: true, data: student };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
};

// Validate alumni data
export const validateAlumniData = async (email) => {
  try {
    const alumnus = dummyAlumni.find(a => a.Email === email);
    
    if (!alumnus) {
      throw new Error('Invalid alumni email. Please use your registered alumni email.');
    }
    
    return { isValid: true, data: alumnus };
  } catch (error) {
    return { isValid: false, error: error.message };
  }
}; 