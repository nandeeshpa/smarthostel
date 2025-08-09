import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, onSnapshot, query, where, updateDoc, doc, orderBy } from 'firebase/firestore';

interface Leave {
  id: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  studentId: string;
  studentName: string;
}

const LeaveManagement: React.FC = () => {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    // Wardens see all leaves; students see own
    const baseQuery = user?.role === 'student'
      ? query(collection(db, 'leaves'), where('studentId', '==', user.id), orderBy('createdAt', 'desc'))
      : query(collection(db, 'leaves'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(baseQuery, (snapshot) => {
      const list: Leave[] = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Leave, 'id'>) }));
      setLeaves(list);
    });
    return () => unsub();
  }, [user?.id, user?.role]);

  type NewLeave = Omit<Leave, 'id' | 'appliedDate'> & { createdAt: string; appliedDate: string };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLeave: NewLeave = {
      reason: formData.reason,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      studentId: user?.id || '',
      studentName: user?.id || '',
      createdAt: new Date().toISOString()
    };
    addDoc(collection(db, 'leaves'), newLeave);
    setFormData({ reason: '', startDate: '', endDate: '' });
    setShowForm(false);
  };

  const updateLeaveStatus = (leaveId: string, status: 'approved' | 'rejected') => {
    updateDoc(doc(db, 'leaves', leaveId), { status });
  };

  const filteredLeaves = leaves;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-600 mt-2">Manage leave applications and approvals</p>
        </div>
        {user?.role === 'student' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Apply for Leave</span>
          </button>
        )}
      </div>

      {/* Leave Application Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Apply for Leave</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Leave
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700"
                >
                  Submit Application
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

      {/* Leave Applications List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {user?.role === 'student' ? 'My Leave Applications' : 'All Leave Applications'}
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredLeaves.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No leave applications found.
            </div>
          ) : (
            filteredLeaves.map((leave) => (
              <div key={leave.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {user?.role !== 'student' && `${leave.studentName} - `}
                          {leave.reason}
                        </p>
                        <p className="text-sm text-gray-500">
                          {leave.startDate} to {leave.endDate}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>Applied: {leave.appliedDate}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(leave.status)}`}>
                      {getStatusIcon(leave.status)}
                      <span className="ml-1 capitalize">{leave.status}</span>
                    </span>
                    {user?.role === 'warden' && leave.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateLeaveStatus(leave.id, 'approved')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateLeaveStatus(leave.id, 'rejected')}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Reject
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

export default LeaveManagement;