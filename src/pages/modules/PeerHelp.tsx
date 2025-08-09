import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HelpCircle, Plus, Phone, Mail, User, CheckCircle2, Clock } from 'lucide-react';
import { readJsonFromStorage, writeJsonToStorage, STORAGE_KEYS } from '../../utils/storage';

interface HelpRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterPhone: string;
  helperId?: string;
  helperName?: string;
  status: 'open' | 'helping' | 'solved';
  createdAt: string;
}

const PeerHelp: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'academic',
    phone: ''
  });

  useEffect(() => {
    const stored = readJsonFromStorage<HelpRequest[] | null>(STORAGE_KEYS.helpRequests, null);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      setRequests(stored);
      return;
    }
    // Seed with some dummy requests
    const defaults: HelpRequest[] = [
      {
        id: 'h1',
        title: 'Need help with Math Assignment',
        description: 'Struggling with calculus problems due tomorrow. Anyone good at integrals?',
        category: 'academic',
        requesterId: 'student_01',
        requesterName: 'student_01',
        requesterEmail: 'student_01@hostel.edu',
        requesterPhone: '99999-11111',
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      },
      {
        id: 'h2',
        title: 'Looking for a laptop charger (Type-C)',
        description: 'Forgot my charger at home. Need to borrow for a few hours this evening.',
        category: 'personal',
        requesterId: 'student_02',
        requesterName: 'student_02',
        requesterEmail: 'student_02@hostel.edu',
        requesterPhone: '99999-22222',
        status: 'open',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      },
    ];
    setRequests(defaults);
    writeJsonToStorage(STORAGE_KEYS.helpRequests, defaults);
  }, []);

  const saveRequests = (updatedRequests: HelpRequest[]) => {
    setRequests(updatedRequests);
    writeJsonToStorage(STORAGE_KEYS.helpRequests, updatedRequests);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRequest: HelpRequest = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      requesterId: user?.id || '',
      requesterName: user?.id || '',
      requesterEmail: user?.email || '',
      requesterPhone: formData.phone,
      status: 'open',
      createdAt: new Date().toISOString()
    };

    const updatedRequests = [...requests, newRequest];
    saveRequests(updatedRequests);
    setFormData({ title: '', description: '', category: 'academic', phone: '' });
    setShowForm(false);
  };

  const offerHelp = (requestId: string) => {
    const updatedRequests = requests.map(req =>
      req.id === requestId
        ? { ...req, status: 'helping' as const, helperId: user?.id, helperName: user?.id }
        : req
    );
    saveRequests(updatedRequests);
  };

  const markSolved = (requestId: string) => {
    const updatedRequests = requests.map(req =>
      req.id === requestId ? { ...req, status: 'solved' as const } : req
    );
    saveRequests(updatedRequests);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'helping': return 'bg-blue-100 text-blue-800';
      case 'solved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <HelpCircle className="h-4 w-4" />;
      case 'helping': return <Clock className="h-4 w-4" />;
      case 'solved': return <CheckCircle2 className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Peer Help</h1>
          <p className="text-gray-600 mt-2">Ask for help or offer assistance to fellow students</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Ask for Help</span>
        </button>
      </div>

      {/* Help Request Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Ask for Help</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Help Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                >
                  <option value="academic">Academic</option>
                  <option value="technical">Technical</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  rows={3}
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700"
                >
                  Submit Request
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

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{selectedRequest.title}</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Category:</p>
                <p className="text-gray-900 capitalize">{selectedRequest.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Description:</p>
                <p className="text-gray-900">{selectedRequest.description}</p>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Contact Information:</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedRequest.requesterName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedRequest.requesterEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedRequest.requesterPhone}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 pt-6">
              {selectedRequest.requesterId !== user?.id && selectedRequest.status === 'open' && (
                <button
                  onClick={() => {
                    offerHelp(selectedRequest.id);
                    setSelectedRequest(null);
                  }}
                  className="flex-1 bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700"
                >
                  I Can Help
                </button>
              )}
              {(selectedRequest.requesterId === user?.id || selectedRequest.helperId === user?.id) && 
               selectedRequest.status === 'helping' && (
                <button
                  onClick={() => {
                    markSolved(selectedRequest.id);
                    setSelectedRequest(null);
                  }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  Mark as Solved
                </button>
              )}
              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Requests List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Help Requests</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {requests.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No help requests found.
            </div>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="h-5 w-5 text-violet-600" />
                      <div>
                        <p className="font-medium text-gray-900">{request.title}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {request.category} • By {request.requesterName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {request.description}
                        </p>
                        {request.helperId && (
                          <p className="text-xs text-blue-600 mt-1">
                            Being helped by {request.helperName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </div>
                    </span>
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="text-violet-600 hover:text-violet-800 text-sm font-medium"
                    >
                      View Details
                    </button>
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

export default PeerHelp;