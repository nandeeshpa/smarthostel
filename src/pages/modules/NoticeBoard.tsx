import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clipboard, Plus, Pin, Calendar, User } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, updateDoc, doc } from 'firebase/firestore';

interface Notice {
  id: string;
  title: string;
  content: string;
  author: string;
  authorRole: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  pinned: boolean;
}

const NoticeBoard: React.FC = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    const q = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const list: Notice[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Notice, 'id'>),
      }));
      setNotices(list);
    });
    return () => unsub();
  }, []);

  type NewNotice = Omit<Notice, 'id'>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNotice: NewNotice = {
      title: formData.title,
      content: formData.content,
      author: user?.id || 'Unknown',
      authorRole: user?.role || 'student',
      createdAt: new Date().toISOString(),
      priority: formData.priority,
      category: formData.category,
      pinned: false
    };

    addDoc(collection(db, 'notices'), newNotice);
    setFormData({ title: '', content: '', category: 'general', priority: 'medium' });
    setShowForm(false);
  };

  const togglePin = (noticeId: string) => {
    const current = notices.find((n) => n.id === noticeId);
    if (!current) return;
    updateDoc(doc(db, 'notices', noticeId), { pinned: !current.pinned });
  };

  const sortedNotices = [...notices].sort((a, b) => {
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mess': return 'bg-orange-100 text-orange-800';
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'academic': return 'bg-purple-100 text-purple-800';
      case 'event': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Digital Notice Board</h1>
          <p className="text-gray-600 mt-2">Important announcements and updates</p>
        </div>
        {user?.role === 'warden' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Post Notice</span>
          </button>
        )}
      </div>

      {/* Notice Form */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Post New Notice</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notice Title
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
                  <option value="general">General</option>
                  <option value="mess">Mess</option>
                  <option value="technical">Technical</option>
                  <option value="academic">Academic</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value as 'low' | 'medium' | 'high'})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notice Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500"
                  rows={4}
                  required
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-violet-600 text-white py-2 rounded-lg hover:bg-violet-700"
                >
                  Post Notice
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

      {/* Notices List */}
      <div className="space-y-4">
        {sortedNotices.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            <Clipboard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No notices posted yet.</p>
          </div>
        ) : (
          sortedNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-lg shadow-lg border-l-4 ${
                notice.pinned ? 'border-violet-500 shadow-xl' : 'border-gray-300'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {notice.pinned && <Pin className="h-5 w-5 text-violet-500" />}
                      <h3 className="text-xl font-semibold text-gray-900">{notice.title}</h3>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(notice.category)}`}>
                        {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(notice.priority)}`}>
                        {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)} Priority
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-4 leading-relaxed">{notice.content}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{notice.author} ({notice.authorRole})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {user?.role === 'warden' && (
                    <button
                      onClick={() => togglePin(notice.id)}
                      className={`ml-4 p-2 rounded-lg transition-colors ${
                        notice.pinned 
                          ? 'bg-violet-100 text-violet-600 hover:bg-violet-200' 
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      <Pin className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;