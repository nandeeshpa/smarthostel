import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Home, User, Shield, Users } from 'lucide-react';

const SignupPage: React.FC = () => {
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<'student' | 'warden' | 'parent' | ''>('');
  const [formData, setFormData] = useState({
    userId: '',
    email: '',
    password: '',
    confirmPassword: '',
    registeredNumber: '',
    block: '',
    roomNumber: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'student' | 'warden' | 'parent') => {
    setSelectedRole(role);
    setStep('form');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const userData = {
      id: formData.userId,
      role: selectedRole as 'student' | 'warden' | 'parent',
      email: formData.email,
      ...(selectedRole === 'student' && {
        registeredNumber: formData.registeredNumber,
        block: formData.block,
        roomNumber: formData.roomNumber
      }),
      ...(selectedRole === 'parent' && {
        block: formData.block
      })
    };

    login(userData);
    navigate('/dashboard');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (step === 'role') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 to-fuchsia-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Home className="mx-auto h-16 w-16 text-white" />
            <h2 className="mt-6 text-3xl font-extrabold text-white">
              Choose Your Role
            </h2>
            <p className="mt-2 text-sm text-violet-200">
              Select how you'll be using the system
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-2xl space-y-4">
            <button
              onClick={() => handleRoleSelect('student')}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm bg-violet-50 hover:bg-violet-100 focus:ring-2 focus:ring-violet-500 transition duration-150"
            >
              <User className="w-6 h-6 text-violet-600 mr-3" />
              <span className="text-lg font-medium text-violet-900">Student</span>
            </button>
            <button
              onClick={() => handleRoleSelect('warden')}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm bg-green-50 hover:bg-green-100 focus:ring-2 focus:ring-green-500 transition duration-150"
            >
              <Shield className="w-6 h-6 text-green-600 mr-3" />
              <span className="text-lg font-medium text-green-900">Warden</span>
            </button>
            <button
              onClick={() => handleRoleSelect('parent')}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm bg-purple-50 hover:bg-purple-100 focus:ring-2 focus:ring-purple-500 transition duration-150"
            >
              <Users className="w-6 h-6 text-purple-600 mr-3" />
              <span className="text-lg font-medium text-purple-900">Parent</span>
            </button>
            <div className="text-center pt-4">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 to-fuchsia-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Home className="mx-auto h-16 w-16 text-white" />
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Create {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Account
          </h2>
          <button
            onClick={() => setStep('role')}
            className="mt-2 text-sm text-violet-200 hover:text-white underline"
          >
            ← Change role
          </button>
        </div>
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-2xl" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                id="userId"
                name="userId"
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter unique User ID"
                value={formData.userId}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email ID
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {selectedRole === 'student' && (
              <>
                <div>
                  <label htmlFor="registeredNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Registered Number
                  </label>
                  <input
                    id="registeredNumber"
                    name="registeredNumber"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter registration number"
                    value={formData.registeredNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="block" className="block text-sm font-medium text-gray-700 mb-2">
                    Block
                  </label>
                  <input
                    id="block"
                    name="block"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter block (e.g., A, B, C)"
                    value={formData.block}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number
                  </label>
                  <input
                    id="roomNumber"
                    name="roomNumber"
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Enter room number"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            {selectedRole === 'parent' && (
              <div>
                <label htmlFor="block" className="block text-sm font-medium text-gray-700 mb-2">
                  Block
                </label>
                <input
                  id="block"
                  name="block"
                  type="text"
                  required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Enter block (e.g., A, B, C)"
                  value={formData.block}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition duration-150"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;