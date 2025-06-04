
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleAdminDashboard = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <QrCode className="h-6 w-6 text-gray-600" />
              <span className="text-lg font-medium text-gray-900">Open E-Label</span>
            </div>
            <div className="flex space-x-6">
              <span className="text-gray-700 hover:text-gray-900 cursor-pointer">Products</span>
              <span className="text-gray-700 hover:text-gray-900 cursor-pointer">Ingredients</span>
            </div>
          </div>
          <div>
            <span className="text-gray-700 hover:text-gray-900 cursor-pointer">Login</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg mb-6">
              <QrCode className="h-8 w-8 text-gray-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Open E-Label
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12">
            Open-source solution for electronic labels.
          </p>

          {/* Administration Dashboard Button */}
          <Button 
            onClick={handleAdminDashboard}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-lg"
          >
            Administration Dashboard
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-24">
          <p className="text-sm text-gray-500">
            Electronic label provided by Open E-Label. Web Accessibility Guidelines.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
