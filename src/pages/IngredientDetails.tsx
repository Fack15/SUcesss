
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, Edit, Trash2, Copy } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useIngredient, useDeleteIngredient } from '../hooks/useIngredients';
import { useToast } from '@/hooks/use-toast';

const IngredientDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: ingredient, isLoading, error } = useIngredient(id || '');
  const deleteIngredientMutation = useDeleteIngredient();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading ingredient...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ingredient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Ingredient Not Found</h1>
            <p className="text-gray-600 mt-2">The ingredient you're looking for doesn't exist.</p>
            <Button 
              onClick={() => navigate('/ingredients')}
              className="mt-4"
            >
              Back to Ingredients
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/ingredients/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteIngredientMutation.mutateAsync(id!);
      toast({
        title: "Ingredient deleted",
        description: "Ingredient has been successfully deleted.",
      });
      navigate('/ingredients');
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete ingredient.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = () => {
    navigate('/ingredients/create', { state: { duplicateFrom: ingredient } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/ingredients')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ingredients
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ingredient Details</h1>
          <p className="text-gray-600">Complete information about {ingredient.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ingredient Name
                    </label>
                    <p className="text-lg font-semibold text-gray-900">{ingredient.name}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <p className="text-lg text-gray-900">{ingredient.category}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E Number
                    </label>
                    <p className="text-lg text-gray-900">
                      {ingredient.e_number || 'Not assigned'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ingredient ID
                    </label>
                    <p className="text-lg text-gray-900 font-mono">{ingredient.id}</p>
                  </div>
                </div>
                
                {ingredient.description && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <p className="text-gray-900">{ingredient.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Allergen Information */}
            <Card>
              <CardHeader>
                <CardTitle>Allergen Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Known Allergens
                  </label>
                  {ingredient.allergens && ingredient.allergens.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {ingredient.allergens.map((allergen, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No known allergens</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Function/Purpose
                    </label>
                    <p className="text-gray-900">
                      {ingredient.category === 'Preservative' && 'Used to prevent spoilage and extend shelf life'}
                      {ingredient.category === 'Antioxidant' && 'Prevents oxidation and maintains product quality'}
                      {ingredient.category === 'Colorant' && 'Provides or maintains color in the product'}
                      {ingredient.category === 'Flavoring' && 'Enhances or adds flavor to the product'}
                      {ingredient.category === 'Stabilizer' && 'Maintains texture and consistency'}
                      {ingredient.category === 'Emulsifier' && 'Helps mix ingredients that normally separate'}
                      {ingredient.category === 'Acidifier' && 'Adjusts pH levels and adds tartness'}
                      {ingredient.category === 'Fining Agent' && 'Clarifies and purifies the wine during production'}
                      {ingredient.category === 'Other' && 'Additional ingredient used in wine production'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Usage in Wine Production
                    </label>
                    <p className="text-gray-900">
                      This ingredient is commonly used in wine production as a {ingredient.category.toLowerCase()}.
                      {ingredient.e_number && ` It is regulated under the E-number system as ${ingredient.e_number}.`}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Safety Information
                    </label>
                    <p className="text-gray-900">
                      {ingredient.allergens && ingredient.allergens.length > 0 
                        ? `Contains allergens: ${ingredient.allergens.join(', ')}. Please check with individuals who have allergies before consumption.`
                        : 'No known allergens associated with this ingredient.'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Audit Information */}
            <Card>
              <CardHeader>
                <CardTitle>Audit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Created on:</span>
                  <p className="text-gray-900">{new Date(ingredient.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Updated on:</span>
                  <p className="text-gray-900">{new Date(ingredient.updated_at).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={handleEdit} className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={handleDuplicate} variant="outline" className="w-full justify-start">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </Button>
                <Button 
                  onClick={handleDelete} 
                  variant="destructive" 
                  className="w-full justify-start"
                  disabled={deleteIngredientMutation.isPending}
                >
                  {deleteIngredientMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientDetails;
