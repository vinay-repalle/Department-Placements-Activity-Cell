const mongoose = require('mongoose');

const placementDriveSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  package: { type: String, required: true },
  role: { type: String, required: true },
  requirements: { type: String, required: true },
  dateOfDrive: { type: Date, required: true },
  bond: { type: String },
  stipend: { type: String },
  description: { type: String },
  targetDepartments: { 
    type: [String], 
    default: ['ALL'],
    enum: ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'CHE']
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlacementDrive', placementDriveSchema); 