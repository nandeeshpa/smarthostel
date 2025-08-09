import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, Phone, Mail, User, MapPin, Calendar } from 'lucide-react';
import { readJsonFromStorage, writeJsonToStorage, STORAGE_KEYS } from '../../utils/storage';

interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  category: 'lost' | 'found';
  location: string;
  posterId: string;
  posterName: string;
  posterEmail: string;
  posterPhone: string;
  status: 'active' | 'claimed' | 'returned';
  createdAt: string;
}

const LostFound: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LostFoundItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'lost' as 'lost' | 'found',
    location: '',
    phone: ''
  });

  useEffect(() => {
    const stored = readJsonFromStorage<LostFoundItem[] | null>(STORAGE_KEYS.lostFoundItems, null);
    if (stored && Array.isArray(stored) && stored.length > 0) {
      setItems(stored);
      return;
    }
    // Seed with some dummy items
    const defaults: LostFoundItem[] = [
      {
        id: 'lf1',
        title: 'Lost: Black Wallet',
        description: 'Black leather wallet with college ID and some cash. Lost near mess hall.',
        category: 'lost',
        location: 'Mess Hall',
        posterId: 'student_03',
        posterName: 'student_03',
        posterEmail: 'student_03@hostel.edu',
        posterPhone: '99999-33333',
        status: 'active',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
      },
      {
        id: 'lf2',
        title: 'Found: USB Drive 32GB',
        description: 'Sandisk 32GB pendrive found in library computer area. Describe contents to claim.',
        category: 'found',
        location: 'Library',
        posterId: 'student_04',
        posterName: 'student_04',
        posterEmail: 'student_04@hostel.edu',
        posterPhone: '99999-44444',
        status: 'active',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
      },
    ];
    setItems(defaults);
    writeJsonToStorage(STORAGE_KEYS.lostFoundItems, defaults);
  }, []);

  const saveItems = (updatedItems: LostFoundItem[]) => {
    setItems(updatedItems);
    writeJsonToStorage(STORAGE_KEYS.lostFoundItems, updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: LostFoundItem = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      location: formData.location,
      posterId: user?.id || '',
      posterName: user?.id || '',
      posterEmail: user?.email || '',
      posterPhone: formData.phone,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    const updatedItems = [...items, newItem];
    saveItems(updatedItems);
    setFormData({ title: '', description: '', category: 'lost', location: '', phone: '' });
    setShowForm(false);
  };

  const markAsFound = (itemId: string) => {
    const updatedItems = items.map(item =>
      item.id === itemId
        ? { ...item, status: item.category === 'lost' ? 'returned' as const : 'claimed' as const }
        : item
    );
    saveItems(updatedItems);
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-yellow-100 text-yellow-800';
      case 'claimed': return 'bg-green-100 text-green-800';
      case 'returned': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (item: LostFoundItem) => {
    if (item.status === 'active') return 'Active';
    if (item.category === 'lost' && item.status === 'returned') return 'Found';
    if (item.category === 'found' && item.status === 'claimed') return 'Claimed';
    return item.status;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lost & Found</h1>
          <p className="text-gray-600 mt-2">Report lost items or help others find their belongings</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Report Item</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'All Items' },
          { key: 'lost', label: 'Lost Items' },
          { key: 'found', label: 'Found Items' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as 'all' | 'lost' | 'found')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Item Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Report Lost/Found Item</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Title
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
                  onChange={(e) => setFormData({...formData, category: e.target.value as 'lost' | 'found'})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                >
                  <option value="lost">Lost Item</option>
                  <option value="found">Found Item</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  placeholder="Where was it lost/found?"
                  required
                />
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
                  placeholder="Detailed description of the item"
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700"
                >
                  Submit Report
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

      {/* Item Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{selectedItem.title}</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Type:</p>
                <p className="text-gray-900 capitalize">{selectedItem.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Description:</p>
                <p className="text-gray-900">{selectedItem.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Location:</p>
                <p className="text-gray-900">{selectedItem.location}</p>
              </div>
              <div className="border-t pt-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Contact Information:</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedItem.posterName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedItem.posterEmail}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedItem.posterPhone}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 pt-6">
              {selectedItem.posterId !== user?.id && selectedItem.status === 'active' && (
                <button
                  onClick={() => {
                    markAsFound(selectedItem.id);
                    setSelectedItem(null);
                  }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                  {selectedItem.category === 'lost' ? 'I Found This' : 'This is Mine'}
                </button>
              )}
              <button
                onClick={() => setSelectedItem(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {filter === 'all' ? 'All Items' : filter === 'lost' ? 'Lost Items' : 'Found Items'}
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredItems.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No items found in this category.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <Search className="h-5 w-5 text-violet-600" />
                      <div>
                        <p className="font-medium text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {item.category} • By {item.posterName}
                        </p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                      {getStatusText(item)}
                    </span>
                    <button
                      onClick={() => setSelectedItem(item)}
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

export default LostFound;