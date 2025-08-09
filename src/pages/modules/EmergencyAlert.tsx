import React, { useState } from 'react';
import { AlertCircle, Phone, Shield, Clock, MapPin } from 'lucide-react';

const EmergencyAlert: React.FC = () => {
  const [alertSent, setAlertSent] = useState(false);

  const handleEmergencyAlert = () => {
    setAlertSent(true);
    // In a real app, this would send notifications to wardens, security, etc.
    setTimeout(() => setAlertSent(false), 5000);
  };

  const emergencyContacts = [
    { name: 'Warden', number: '+91 9876543210', available: true },
    { name: 'Security', number: '+91 9876543211', available: true },
    { name: 'Medical', number: '+91 9876543212', available: true },
    { name: 'Fire Department', number: '101', available: true },
    { name: 'Police', number: '100', available: true },
    { name: 'Ambulance', number: '108', available: true }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Emergency Alert System</h1>
        <p className="text-gray-600 mt-2">Quick access to emergency services and alerts</p>
      </div>

      {/* Emergency Alert Button */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg shadow-lg p-8 text-center">
        <AlertCircle className="h-16 w-16 text-white mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Emergency Alert</h2>
        <p className="text-red-100 mb-6">
          Press this button only in case of real emergencies. This will immediately notify the warden, security, and relevant authorities.
        </p>
        <button
          onClick={handleEmergencyAlert}
          disabled={alertSent}
          className={`${
            alertSent 
              ? 'bg-green-600 cursor-not-allowed' 
              : 'bg-white hover:bg-gray-100'
          } text-red-600 font-bold py-4 px-8 rounded-lg text-xl transition-all duration-200 transform hover:scale-105`}
        >
          {alertSent ? (
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6" />
              <span>ALERT SENT!</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-6 w-6" />
              <span>EMERGENCY ALERT</span>
            </div>
          )}
        </button>
        {alertSent && (
          <p className="text-white mt-4 font-medium">
            Emergency services have been notified. Help is on the way!
          </p>
        )}
      </div>

      {/* Emergency Contacts */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center">
            <Phone className="h-6 w-6 mr-2 text-blue-500" />
            Emergency Contacts
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
          {emergencyContacts.map((contact) => (
            <div key={contact.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                <div className={`w-3 h-3 rounded-full ${contact.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <p className="text-lg font-mono text-gray-700 mb-3">{contact.number}</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Call Now</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold flex items-center">
            <Clock className="h-6 w-6 mr-2 text-orange-500" />
            Recent Emergency Activities
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Fire Drill Completed</p>
                <p className="text-sm text-gray-500">All residents evacuated successfully</p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>2 days ago</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>All Blocks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Medical Emergency Resolved</p>
                <p className="text-sm text-gray-500">Student transported to hospital, condition stable</p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>1 week ago</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>Block A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Security Check Completed</p>
                <p className="text-sm text-gray-500">Routine security inspection of all premises</p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>2 weeks ago</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>All Areas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Guidelines */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-yellow-800 mb-4">Emergency Safety Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
          <div>
            <h3 className="font-medium mb-2">🔥 Fire Emergency</h3>
            <ul className="space-y-1 text-xs">
              <li>• Stay low and move to nearest exit</li>
              <li>• Do not use elevators</li>
              <li>• Call fire department immediately</li>
              <li>• Gather at assembly point</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">🏥 Medical Emergency</h3>
            <ul className="space-y-1 text-xs">
              <li>• Call emergency number immediately</li>
              <li>• Do not move injured person</li>
              <li>• Apply first aid if trained</li>
              <li>• Wait for medical help to arrive</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;