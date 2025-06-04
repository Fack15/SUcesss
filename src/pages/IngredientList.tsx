
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Copy,
  Download,
  Upload,
  Loader2
} from 'lucide-react';
import Navigation from '../components/Navigation';
import { useIngredients, useCreateIngredient, useDeleteIngredient } from '../hooks/useIngredients';
import { useToast } from '@/hooks/use-toast';
import { exportIngredientsToExcel, importIngredientsFromExcel } from '../utils/excelExport';

const IngredientList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: ingredients = [], isLoading, error } = useIngredients();
  const createIngredientMutation = useCreateIngredient();
  const deleteIngredientMutation = useDeleteIngredient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ingredient.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ingredient.e_number && ingredient.e_number.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleView = (id: string) => {
    navigate(`/ingredients/details/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/ingredients/edit/${id}`);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteIngredientMutation.mutateAsync(id);
      toast({
        title: "Ingredient deleted",
        description: `Ingredient ${name} has been successfully deleted.`,
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete ingredient.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = (ingredient: any) => {
    navigate('/ingredients/create', { state: { duplicateFrom: ingredient } });
  };

  const handleExport = () => {
    if (ingredients.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no ingredients to export.",
        variant: "destructive",
      });
      return;
    }
    
    exportIngredientsToExcel(ingredients);
    toast({
      title: "Export successful",
      description: `Exported ${ingredients.length} ingredients to Excel.`,
    });
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const importedData = await importIngredientsFromExcel(file);
      
      // Import each ingredient
      for (const ingredientData of importedData) {
        if (ingredientData.name && ingredientData.category) {
          await createIngredientMutation.mutateAsync(ingredientData);
        }
      }
      
      toast({
        title: "Import successful",
        description: `Successfully imported ${importedData.length} ingredients.`,
      });
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message || "Failed to import ingredients from Excel.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading ingredients...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Error Loading Ingredients</h1>
            <p className="text-gray-600 mt-2">Please try refreshing the page.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ingredients</h1>
              <p className="text-gray-600">Manage your ingredient database</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export to Excel
              </Button>
              <Button 
                onClick={handleImportClick} 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={isImporting}
              >
                {isImporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                Import from Excel
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link to="/ingredients/create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Ingredient
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Hidden file input for import */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search ingredients by name, category, or E-number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Ingredients Grid */}
        {filteredIngredients.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No ingredients found' : 'No ingredients yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Get started by adding your first ingredient'
                  }
                </p>
                {!searchTerm && (
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link to="/ingredients/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Ingredient
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIngredients.map((ingredient) => (
              <Card key={ingredient.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{ingredient.name}</CardTitle>
                      <p className="text-gray-600">{ingredient.category}</p>
                    </div>
                    {ingredient.e_number && (
                      <Badge variant="outline">{ingredient.e_number}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {ingredient.description && (
                      <div>
                        <span className="text-gray-600">Description:</span>
                        <p className="text-gray-900 line-clamp-2">{ingredient.description}</p>
                      </div>
                    )}
                    {ingredient.allergens && ingredient.allergens.length > 0 && (
                      <div>
                        <span className="text-gray-600">Allergens:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {ingredient.allergens.slice(0, 3).map((allergen, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {allergen}
                            </Badge>
                          ))}
                          {ingredient.allergens.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{ingredient.allergens.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(ingredient.id)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(ingredient.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicate(ingredient)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(ingredient.id, ingredient.name)}
                      disabled={deleteIngredientMutation.isPending}
                    >
                      {deleteIngredientMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{ingredients.length}</div>
              <div className="text-gray-600">Total Ingredients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(ingredients.map(i => i.category)).size}
              </div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {ingredients.filter(i => i.allergens && i.allergens.length > 0).length}
              </div>
              <div className="text-gray-600">With Allergens</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientList;
