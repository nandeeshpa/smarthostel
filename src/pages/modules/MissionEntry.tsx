import React from 'react';
import { QrCode, Shield, Clock, CheckCircle } from 'lucide-react';

const MissionEntry: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mission Entry Monitoring</h1>
        <p className="text-gray-600 mt-2">QR Code based entry and exit monitoring system</p>
      </div>

      {/* QR Code Scanner Section */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mx-auto w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-6">
            <QrCode className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">QR Code Scanner</h2>
          <p className="text-gray-600 mb-6">Scan your QR code for entry/exit</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 text-lg font-medium">
            Open Camera Scanner
          </button>
        </div>
      </div>

      {/* Entry Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-500" />
            Recent Entries
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Entry Recorded</p>
                    <p className="text-sm text-gray-500">Today at 9:30 AM</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Approved
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-blue-500" />
            Entry Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Today's Entries</span>
              <span className="text-2xl font-bold text-blue-600">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Week</span>
              <span className="text-2xl font-bold text-green-600">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Month</span>
              <span className="text-2xl font-bold text-purple-600">347</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionEntry;