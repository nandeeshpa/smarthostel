import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Calendar, TrendingUp, BarChart3 } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  time: string;
  status: 'present' | 'absent';
}

const AttendanceMonitoring: React.FC = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const storedAttendance = localStorage.getItem('hostelAttendance');
    if (storedAttendance) {
      setAttendance(JSON.parse(storedAttendance));
    }
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();

  const todayAttendance = attendance.filter(record => record.date === today);
  const monthlyAttendance = attendance.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear;
  });

  const presentToday = todayAttendance.filter(record => record.status === 'present').length;
  const attendanceRate = monthlyAttendance.length > 0 
    ? Math.round((monthlyAttendance.filter(r => r.status === 'present').length / monthlyAttendance.length) * 100)
    : 0;

  // Generate some sample data for better demonstration
  const sampleStudents = ['STU001', 'STU002', 'STU003', 'STU004', 'STU005'];
  const studentAttendance = sampleStudents.map(studentId => ({
    studentId,
    presentDays: Math.floor(Math.random() * 25) + 5,
    totalDays: 30,
    percentage: Math.floor(Math.random() * 30) + 70
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Attendance Monitoring</h1>
        <p className="text-gray-600 mt-2">Monitor and analyze hostel attendance patterns</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Present Today</p>
              <p className="text-3xl font-bold text-gray-900">{presentToday}</p>
              <p className="text-sm text-green-600">↑ +5 from yesterday</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Rate</p>
              <p className="text-3xl font-bold text-gray-900">{attendanceRate}%</p>
              <p className="text-sm text-green-600">↑ +2% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">156</p>
              <p className="text-sm text-gray-500">Active residents</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <BarChart3 className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Weekly</p>
              <p className="text-3xl font-bold text-gray-900">92%</p>
              <p className="text-sm text-yellow-600">Standard range</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Student Attendance Summary</h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {studentAttendance.map((student) => (
              <div key={student.studentId} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{student.studentId}</p>
                    <p className="text-sm text-gray-500">
                      {student.presentDays}/{student.totalDays} days present
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      student.percentage >= 90 
                        ? 'bg-green-100 text-green-800'
                        : student.percentage >= 75
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {student.percentage}%
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        student.percentage >= 90
                          ? 'bg-green-500'
                          : student.percentage >= 75
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${student.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Recent Attendance Activity</h2>
          </div>
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {attendance.slice(-10).reverse().map((record) => (
              <div key={record.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      record.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{record.studentId}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString()} at {record.time}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    record.status === 'present' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {record.status === 'present' ? 'Present' : 'Absent'}
                  </span>
                </div>
              </div>
            ))}
            {attendance.length === 0 && (
              <div className="px-6 py-8 text-center text-gray-500">
                No attendance records found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceMonitoring;