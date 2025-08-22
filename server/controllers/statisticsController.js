const User = require('../models/User');

exports.getFilteredStudents = async (req, res) => {
  try {
    const { branch, year } = req.query;
    
    // Build query based on filters
    let query = { role: 'student' };
    
    if (branch && branch !== 'ALL') {
      query.branch = branch;
    }
    
    if (year && year !== 'ALL') {
      query.year = year;
    }

    const students = await User.find(query)
      .select('studentId fullName email branch year phone')
      .sort('studentId');

    res.status(200).json({
      status: 'success',
      data: {
        students
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error fetching student data'
    });
  }
}; 