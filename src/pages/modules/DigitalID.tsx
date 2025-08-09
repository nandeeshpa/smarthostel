import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, QrCode, Download, Shield } from 'lucide-react';

const DigitalID: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Digital ID & Gate Pass</h1>
        <p className="text-gray-600 mt-2">Your digital identification and access pass</p>
      </div>

      {/* Digital ID Card */}
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Digital ID Card</h2>
            <Shield className="h-6 w-6" />
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">{user?.id?.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">{user?.id}</h3>
              <p className="text-blue-100 capitalize">{user?.role}</p>
              {user?.block && (
                <p className="text-blue-100">Block {user.block}{user.roomNumber && `, Room ${user.roomNumber}`}</p>
              )}
            </div>
          </div>

          <div className="border-t border-blue-400 pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-200">Student ID</p>
                <p className="font-medium">{user?.registeredNumber || user?.id}</p>
              </div>
              <div>
                <p className="text-blue-200">Email</p>
                <p className="font-medium text-xs">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
              <QrCode className="h-16 w-16 text-gray-800" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center space-x-2">
          <Download className="h-5 w-5" />
          <span>Download ID</span>
        </button>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
          <QrCode className="h-5 w-5" />
          <span>Show QR Code</span>
        </button>
      </div>

      {/* Gate Pass Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <CreditCard className="h-6 w-6 mr-2 text-purple-500" />
          Gate Pass Management
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Request Gate Pass</h3>
            <form className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <select className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500">
                  <option>Medical Emergency</option>
                  <option>Personal Work</option>
                  <option>Family Event</option>
                  <option>Official Work</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Return
                </label>
                <input 
                  type="datetime-local" 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
              >
                Request Gate Pass
              </button>
            </form>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Active Pass</h3>
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-2" />
              <p>No active gate pass</p>
              <p className="text-sm">Request a pass when needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pass History */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Gate Pass History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {[1, 2, 3].map((pass) => (
            <div key={pass} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Medical Emergency</p>
                  <p className="text-sm text-gray-500">
                    Out: Today 2:00 PM • Expected: Today 6:00 PM
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Returned
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DigitalID;