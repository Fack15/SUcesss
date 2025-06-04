
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Wine, Users } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleEnterAdminPanel = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Wine className="h-16 w-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Administration Dashboard</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your wine products, ingredients, and business operations from this central hub.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center">
                <Wine className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage wine inventory and details</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <Settings className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle>Ingredients</CardTitle>
                <CardDescription>Track ingredients and allergens</CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle>Operations</CardTitle>
                <CardDescription>Business management tools</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Ready to get started?</CardTitle>
                <CardDescription>
                  Access the admin panel to begin managing your wine business
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={handleEnterAdminPanel}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  Enter Admin Panel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
