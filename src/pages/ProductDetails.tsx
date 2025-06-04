
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Edit, Trash2, Copy, Download, ExternalLink } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useProduct, useDeleteProduct } from '../hooks/useProducts';
import { useToast } from '@/hooks/use-toast';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: product, isLoading, error } = useProduct(id || '');
  const deleteProductMutation = useDeleteProduct();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading product...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
            <Button onClick={() => navigate('/products')} className="mt-4">
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/products/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await deleteProductMutation.mutateAsync(id!);
      toast({
        title: "Product deleted",
        description: "Product has been successfully deleted.",
      });
      navigate('/products');
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicate = () => {
    navigate('/products/create', { state: { duplicateFrom: product } });
  };

  const handleDownloadQR = async () => {
    try {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(labelPublicLink)}`;
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-${product.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "QR Code downloaded",
        description: "QR code has been successfully downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const labelPublicLink = `${window.location.origin}/l/${product.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(labelPublicLink)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/products')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-600">{product.brand}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Product Name:</span>
                  <p className="text-gray-900">{product.name}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Brand:</span>
                  <p className="text-gray-900">{product.brand}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">SKU:</span>
                  <p className="text-gray-900">{product.sku}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Net Volume:</span>
                  <p className="text-gray-900">{product.net_volume || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Vintage:</span>
                  <p className="text-gray-900">{product.vintage || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <p className="text-gray-900">{product.type || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Sugar Content:</span>
                  <p className="text-gray-900">{product.sugar_content || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Appellation:</span>
                  <p className="text-gray-900">{product.appellation || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Alcohol Content:</span>
                  <p className="text-gray-900">{product.alcohol_content ? `${product.alcohol_content}%` : 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Country:</span>
                  <p className="text-gray-900">{product.country_of_origin || 'N/A'}</p>
                </div>
                {product.description && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="text-gray-900">{product.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Producer Information */}
            {(product.producer_name || product.producer_address) && (
              <Card>
                <CardHeader>
                  <CardTitle>Producer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {product.producer_name && (
                    <div>
                      <span className="font-medium text-gray-700">Producer Name:</span>
                      <p className="text-gray-900">{product.producer_name}</p>
                    </div>
                  )}
                  {product.producer_address && (
                    <div>
                      <span className="font-medium text-gray-700">Producer Address:</span>
                      <p className="text-gray-900">{product.producer_address}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Barcode Section */}
            <Card>
              <CardHeader>
                <CardTitle>Product Identification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-700">Product ID:</span>
                    <p className="text-gray-900 font-mono">{product.id}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">SKU Barcode:</span>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <div className="font-mono text-lg tracking-wider bg-white p-2 text-center border">
                        {product.sku}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">This SKU can be used to generate various barcode formats</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* QR Code & Links */}
            <Card>
              <CardHeader>
                <CardTitle>Digital Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code" 
                    className="mx-auto mb-2"
                  />
                  <p className="text-sm text-gray-600 mb-2">QR Code</p>
                  <Button 
                    onClick={handleDownloadQR}
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download QR Code
                  </Button>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Label Public Link:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm flex-1 truncate">
                        {labelPublicLink}
                      </code>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(labelPublicLink, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Audit Information */}
            <Card>
              <CardHeader>
                <CardTitle>Audit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Created on:</span>
                  <p className="text-gray-900">{new Date(product.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Updated on:</span>
                  <p className="text-gray-900">{new Date(product.updated_at).toLocaleString()}</p>
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
                <Separator />
                <Button 
                  onClick={handleDelete} 
                  variant="destructive" 
                  className="w-full justify-start"
                  disabled={deleteProductMutation.isPending}
                >
                  {deleteProductMutation.isPending ? (
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

export default ProductDetails;
