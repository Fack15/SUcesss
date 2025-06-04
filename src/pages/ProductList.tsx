
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Navigation from '../components/Navigation';
import ProductPreviewDialog from '../components/ProductPreviewDialog';
import { Plus, Search, Download, Upload, MoreHorizontal, Eye, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';

const ProductList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewProduct, setPreviewProduct] = useState<any | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: products = [], isLoading, error } = useProducts();
  const deleteProductMutation = useDeleteProduct();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id: string) => {
    navigate(`/products/edit/${id}`);
  };

  const handleDetails = (id: string) => {
    navigate(`/products/details/${id}`);
  };

  const handlePreview = (product: any) => {
    setPreviewProduct(product);
    setPreviewOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProductMutation.mutateAsync(id);
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = (product: any) => {
    // For now, navigate to create with prefilled data
    navigate('/products/create', { state: { duplicateFrom: product } });
  };

  const handleImport = () => {
    toast({
      title: "Import",
      description: "Import functionality will be implemented with backend.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Export",
      description: "Export functionality will be implemented with backend.",
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600">Error loading products: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Manage your product inventory and details</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex gap-2">
                <Button 
                  onClick={() => navigate('/products/create')}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
                <Button variant="outline" onClick={handleImport}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading products...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Net Volume</TableHead>
                    <TableHead>Vintage</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Sugar Content</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        {searchTerm ? 'No products found matching your search.' : 'No products yet. Create your first product!'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>{product.net_volume || '-'}</TableCell>
                        <TableCell>{product.vintage || '-'}</TableCell>
                        <TableCell>{product.type || '-'}</TableCell>
                        <TableCell>{product.sugar_content || '-'}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product.id)}
                            >
                              ✏️
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(product)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleDetails(product.id)}>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEdit(product.id)}>
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(product.id)}
                                  disabled={deleteProductMutation.isPending}
                                >
                                  Delete
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDuplicate(product)}>
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handlePreview(product)}>
                                  Preview
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      <ProductPreviewDialog 
        product={previewProduct}
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
};

export default ProductList;
