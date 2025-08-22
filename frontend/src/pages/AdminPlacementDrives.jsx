import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = '/api/placementdrives';

const AdminPlacementDrives = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    companyName: '',
    package: '',
    role: '',
    requirements: '',
    dateOfDrive: '',
    bond: '',
    stipend: '',
    description: '',
    targetDepartments: ['ALL']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.post(API_URL, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess('Placement drive added!');
      setForm({ companyName: '', package: '', role: '', requirements: '', dateOfDrive: '', bond: '', stipend: '', description: '', targetDepartments: ['ALL'] });
    } catch (err) {
      setError('Failed to add drive');
    }
    setLoading(false);
  };

  if (!user || user.role !== 'admin') return <div>Access denied</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-extrabold text-blue-900 mb-8 drop-shadow">Add Placement Drive</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white/90 p-8 rounded-2xl shadow-lg border border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company Name" required className="w-full p-2 border rounded" />
          <input name="package" value={form.package} onChange={handleChange} placeholder="Package" required className="w-full p-2 border rounded" />
          <input name="role" value={form.role} onChange={handleChange} placeholder="Role" required className="w-full p-2 border rounded" />
          <input name="requirements" value={form.requirements} onChange={handleChange} placeholder="Requirements" required className="w-full p-2 border rounded" />
          <input name="dateOfDrive" value={form.dateOfDrive} onChange={handleChange} type="date" required className="w-full p-2 border rounded" />
          <input name="bond" value={form.bond} onChange={handleChange} placeholder="Bond (if any)" className="w-full p-2 border rounded" />
          <input name="stipend" value={form.stipend} onChange={handleChange} placeholder="Stipend (if any)" className="w-full p-2 border rounded" />
          <select 
            name="targetDepartments" 
            value={form.targetDepartments[0]} 
            onChange={(e) => setForm({ ...form, targetDepartments: [e.target.value] })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="ALL">All Departments</option>
            <option value="CSE">Computer Science Engineering</option>
            <option value="ECE">Electronics & Communication Engineering</option>
            <option value="ME">Mechanical Engineering</option>
            <option value="CE">Civil Engineering</option>
            <option value="CHE">Chemical Engineering</option>
          </select>
        </div>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition">{loading ? 'Adding...' : 'Add Drive'}</button>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
      </form>
    </div>
  );
};

export default AdminPlacementDrives; 