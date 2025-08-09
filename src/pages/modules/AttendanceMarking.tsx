import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Calendar, Clock, CheckCircle } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  time: string;
  status: 'present' | 'absent';
}

const AttendanceMarking: React.FC = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [todayMarked, setTodayMarked] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    // Load attendance from localStorage
    const storedAttendance = localStorage.getItem('hostelAttendance');
    if (storedAttendance) {
      const records = JSON.parse(storedAttendance);
      setAttendance(records);
      
      // Check if today's attendance is already marked
      const todayRecord = records.find(
        (record: AttendanceRecord) => 
          record.studentId === user?.id && record.date === today
      );
      setTodayMarked(!!todayRecord);
    }
  }, [user?.id, today]);

  const markAttendance = () => {
    if (todayMarked || !user) return;

    const newRecord: AttendanceRecord = {
      id: Date.now().toString(),
      studentId: user.id,
      date: today,
      time: new Date().toLocaleTimeString(),
      status: 'present'
    };

    const updatedAttendance = [...attendance, newRecord];
    setAttendance(updatedAttendance);
    localStorage.setItem('hostelAttendance', JSON.stringify(updatedAttendance));
    setTodayMarked(true);
  };

  const myAttendance = attendance.filter(record => record.studentId === user?.id);
  const thisMonthAttendance = myAttendance.filter(record => {
    const recordDate = new Date(record.date);
    const now = new Date();
    return recordDate.getMonth() === now.getMonth() && recordDate.getFullYear() === now.getFullYear();
  });

  const attendancePercentage = thisMonthAttendance.length > 0 
    ? Math.round((thisMonthAttendance.filter(r => r.status === 'present').length / thisMonthAttendance.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mark Attendance</h1>
        <p className="text-gray-600 mt-2">Mark your daily attendance here</p>
      </div>

      {/* Today's Attendance Card */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Today's Attendance</h2>
            <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            {todayMarked ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-8 w-8" />
                <div>
                  <p className="font-semibold">Marked as Present</p>
                  <p className="text-sm text-gray-500">
                    Time: {myAttendance.find(r => r.date === today)?.time}
                  </p>
                </div>
              </div>
            ) : (
              <button
                onClick={markAttendance}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center space-x-2 text-lg font-medium"
              >
                <UserCheck className="h-6 w-6" />
                <span>Mark Present</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900">{attendancePercentage}%</p>
              <p className="text-sm text-gray-500">Attendance Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present Days</p>
              <p className="text-3xl font-bold text-gray-900">
                {thisMonthAttendance.filter(r => r.status === 'present').length}
              </p>
              <p className="text-sm text-gray-500">This Month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-3xl font-bold text-gray-900">{myAttendance.length}</p>
              <p className="text-sm text-gray-500">All Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Recent Attendance History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {myAttendance.slice(-10).reverse().map((record) => (
            <div key={record.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <UserCheck className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(record.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">Marked at {record.time}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Present
              </span>
            </div>
          ))}
          {myAttendance.length === 0 && (
            <div className="px-6 py-8 text-center text-gray-500">
              No attendance records found. Mark your first attendance today!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceMarking;