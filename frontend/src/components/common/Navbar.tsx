import React from 'react';
import { LogOut, User, Building, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();

  const getRoleIcon = () => {
    switch (currentUser?.role) {
      case 'student':
        return <User className="w-5 h-5" />;
      case 'company':
        return <Building className="w-5 h-5" />;
      case 'admin':
        return <Shield className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getRoleName = () => {
    switch (currentUser?.role) {
      case 'student':
        return 'Student Portal';
      case 'company':
        return 'Company Portal';
      case 'admin':
        return 'Admin Dashboard';
      default:
        return 'Portal';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">InternMatch</h1>
                <p className="text-xs text-gray-500">{getRoleName()}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              {getRoleIcon()}
              <span>{currentUser?.email}</span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;