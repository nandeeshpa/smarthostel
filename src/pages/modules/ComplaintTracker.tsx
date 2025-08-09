import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  submittedBy: string;
  submittedAt: string;
  resolvedAt?: string;
}

const ComplaintTracker: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'maintenance',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    const storedComplaints = localStorage.getItem('hostelComplaints');
    if (storedComplaints) {
      setComplaints(JSON.parse(storedComplaints));
    }
  }, []);

  const saveComplaints = (updatedComplaints: Complaint[]) => {
    setComplaints(updatedComplaints);
    localStorage.setItem('hostelComplaints', JSON.stringify(updatedComplaints));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newComplaint: Complaint = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      status: 'open',
      submittedBy: user?.id || '',
      submittedAt: new Date().toISOString()
    };

    const updatedComplaints = [...complaints, newComplaint];
    saveComplaints(updatedComplaints);
    setFormData({ title: '', description: '', category: 'maintenance', priority: 'medium' });
    setShowForm(false);
  };

  const updateComplaintStatus = (complaintId: string, status: Complaint['status']) => {
    const updatedComplaints = complaints.map(complaint =>
      complaint.id === complaintId
        ? { 
            ...complaint, 
            status,
            ...(status === 'resolved' && { resolvedAt: new Date().toISOString() })
          }
        : complaint
    );
    saveComplaints(updatedComplaints);
  };

  const filteredComplaints = user?.role === 'student' 
    ? complaints.filter(complaint => complaint.submittedBy === user.id)
    : complaints;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'closed': return <XCircle className="h-5 w-5 text-gray-500" />;
      case 'in-progress': return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Complaint Tracker</h1>
          <p className="text-gray-600 mt-2">Submit and track maintenance requests and complaints</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Complaint Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Submit New Complaint</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="maintenance">Maintenance</option>
                  <option value="electrical">Electrical</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="security">Security</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Submit Complaint
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {user?.role === 'student' ? 'My Complaints' : 'All Complaints'}
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredComplaints.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No complaints found.
            </div>
          ) : (
            filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-gray-900">{complaint.title}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                            {complaint.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 capitalize">
                          {complaint.category} • Submitted by {complaint.submittedBy}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{complaint.description}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Submitted: {new Date(complaint.submittedAt).toLocaleDateString()}
                          {complaint.resolvedAt && (
                            <span className="ml-2">
                              • Resolved: {new Date(complaint.resolvedAt).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(complaint.status)}
                        <span className="capitalize">{complaint.status.replace('-', ' ')}</span>
                      </div>
                    </span>
                    {user?.role === 'warden' && complaint.status !== 'resolved' && complaint.status !== 'closed' && (
                      <div className="flex space-x-2">
                        {complaint.status === 'open' && (
                          <button
                            onClick={() => updateComplaintStatus(complaint.id, 'in-progress')}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            Start Work
                          </button>
                        )}
                        <button
                          onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintTracker;