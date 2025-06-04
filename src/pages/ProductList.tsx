
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
  Loader2,
  Filter
} from 'lucide-react';
import Navigation from '../components/Navigation';
import { useProducts, useCreateProduct, useDeleteProduct } from '../hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import { exportProductsToExcel, importProductsFromExcel } from '../utils/excelExport';

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data: products = [], isLoading, error } = useProducts();
  const createProductMutation = useCreateProduct();
  const deleteProductMutation = useDeleteProduct();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (id: string) => {
    navigate(`/products/details/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/products/edit/${id}`);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      toast({
        title: "Product deleted",
        description: `Product ${name} has been successfully deleted.`,
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = (product: any) => {
    navigate('/products/create', { state: { duplicateFrom: product } });
  };

  const handleExport = () => {
    if (products.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no products to export.",
        variant: "destructive",
      });
      return;
    }
    
    exportProductsToExcel(products);
    toast({
      title: "Export successful",
      description: `Exported ${products.length} products to Excel.`,
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
      const importedData = await importProductsFromExcel(file);
      
      // Import each product
      for (const productData of importedData) {
        if (productData.name && productData.brand && productData.sku) {
          await createProductMutation.mutateAsync(productData);
        }
      }
      
      toast({
        title: "Import successful",
        description: `Successfully imported ${importedData.length} products.`,
      });
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message || "Failed to import products from Excel.",
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
            <span className="ml-2">Loading products...</span>
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
            <h1 className="text-2xl font-bold text-gray-900">Error Loading Products</h1>
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
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600">Manage your wine product inventory</p>
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
              <Button asChild className="bg-purple-600 hover:bg-purple-700">
                <Link to="/products/create" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
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

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products by name, brand, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No products found' : 'No products yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Get started by creating your first product'
                  }
                </p>
                {!searchTerm && (
                  <Button asChild className="bg-purple-600 hover:bg-purple-700">
                    <Link to="/products/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Product
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-gray-600">{product.brand}</p>
                    </div>
                    <Badge variant="secondary">{product.type || 'Wine'}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU:</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                    {product.vintage && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vintage:</span>
                        <span>{product.vintage}</span>
                      </div>
                    )}
                    {product.alcohol_content && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Alcohol:</span>
                        <span>{product.alcohol_content}%</span>
                      </div>
                    )}
                    {product.country_of_origin && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Country:</span>
                        <span>{product.country_of_origin}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleView(product.id)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicate(product)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deleteProductMutation.isPending}
                    >
                      {deleteProductMutation.isPending ? (
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
              <div className="text-2xl font-bold text-purple-600">{products.length}</div>
              <div className="text-gray-600">Total Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredProducts.length}
              </div>
              <div className="text-gray-600">
                {searchTerm ? 'Filtered Results' : 'Active Products'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(products.map(p => p.brand)).size}
              </div>
              <div className="text-gray-600">Unique Brands</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
