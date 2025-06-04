
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import Navigation from '../components/Navigation';
import { useToast } from '@/hooks/use-toast';
import { useProduct, useCreateProduct, useUpdateProduct } from '../hooks/useProducts';

const ProductForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const isEdit = !!id;
  
  const { data: existingProduct, isLoading } = useProduct(id || '');
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  
  const duplicateFrom = location.state?.duplicateFrom;
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    sku: '',
    net_volume: '',
    vintage: '',
    type: '',
    sugar_content: '',
    appellation: '',
    alcohol_content: '',
    description: '',
    producer_name: '',
    producer_address: '',
    country_of_origin: '',
  });

  useEffect(() => {
    if (existingProduct) {
      setFormData({
        name: existingProduct.name || '',
        brand: existingProduct.brand || '',
        sku: existingProduct.sku || '',
        net_volume: existingProduct.net_volume || '',
        vintage: existingProduct.vintage || '',
        type: existingProduct.type || '',
        sugar_content: existingProduct.sugar_content || '',
        appellation: existingProduct.appellation || '',
        alcohol_content: existingProduct.alcohol_content?.toString() || '',
        description: existingProduct.description || '',
        producer_name: existingProduct.producer_name || '',
        producer_address: existingProduct.producer_address || '',
        country_of_origin: existingProduct.country_of_origin || '',
      });
    } else if (duplicateFrom) {
      setFormData({
        name: `${duplicateFrom.name} (Copy)`,
        brand: duplicateFrom.brand || '',
        sku: `${duplicateFrom.sku}-COPY`,
        net_volume: duplicateFrom.net_volume || '',
        vintage: duplicateFrom.vintage || '',
        type: duplicateFrom.type || '',
        sugar_content: duplicateFrom.sugar_content || '',
        appellation: duplicateFrom.appellation || '',
        alcohol_content: duplicateFrom.alcohol_content?.toString() || '',
        description: duplicateFrom.description || '',
        producer_name: duplicateFrom.producer_name || '',
        producer_address: duplicateFrom.producer_address || '',
        country_of_origin: duplicateFrom.country_of_origin || '',
      });
    }
  }, [existingProduct, duplicateFrom]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        ...formData,
        alcohol_content: formData.alcohol_content ? parseFloat(formData.alcohol_content) : null,
      };

      if (isEdit && id) {
        await updateProductMutation.mutateAsync({ id, ...productData });
        toast({
          title: "Product updated",
          description: `Product ${formData.name} has been successfully updated.`,
        });
      } else {
        await createProductMutation.mutateAsync(productData);
        toast({
          title: "Product created",
          description: `Product ${formData.name} has been successfully created.`,
        });
      }
      
      navigate('/products');
    } catch (error: any) {
      toast({
        title: isEdit ? "Update failed" : "Creation failed",
        description: error.message || "An error occurred while saving the product.",
        variant: "destructive",
      });
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading product...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEdit ? 'Edit Product' : 'Create New Product'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Update product information' : 'Add a new wine product to your inventory'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="net_volume">Net Volume</Label>
                <Input
                  id="net_volume"
                  name="net_volume"
                  value={formData.net_volume}
                  onChange={handleInputChange}
                  placeholder="e.g., 750ml"
                />
              </div>
            </CardContent>
          </Card>

          {/* Wine Details */}
          <Card>
            <CardHeader>
              <CardTitle>Wine Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vintage">Vintage</Label>
                <Input
                  id="vintage"
                  name="vintage"
                  value={formData.vintage}
                  onChange={handleInputChange}
                  placeholder="e.g., 2020"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Wine Type</Label>
                <Select onValueChange={(value) => handleSelectChange('type', value)} value={formData.type}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select wine type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Red Wine">Red Wine</SelectItem>
                    <SelectItem value="White Wine">White Wine</SelectItem>
                    <SelectItem value="Rosé Wine">Rosé Wine</SelectItem>
                    <SelectItem value="Champagne">Champagne</SelectItem>
                    <SelectItem value="Sparkling Wine">Sparkling Wine</SelectItem>
                    <SelectItem value="Dessert Wine">Dessert Wine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sugar_content">Sugar Content</Label>
                <Select onValueChange={(value) => handleSelectChange('sugar_content', value)} value={formData.sugar_content}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sugar content" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dry">Dry</SelectItem>
                    <SelectItem value="Semi-Dry">Semi-Dry</SelectItem>
                    <SelectItem value="Semi-Sweet">Semi-Sweet</SelectItem>
                    <SelectItem value="Sweet">Sweet</SelectItem>
                    <SelectItem value="Brut">Brut</SelectItem>
                    <SelectItem value="Extra Brut">Extra Brut</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="appellation">Appellation</Label>
                <Input
                  id="appellation"
                  name="appellation"
                  value={formData.appellation}
                  onChange={handleInputChange}
                  placeholder="e.g., Bordeaux AOC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alcohol_content">Alcohol Content (%)</Label>
                <Input
                  id="alcohol_content"
                  name="alcohol_content"
                  type="number"
                  step="0.1"
                  value={formData.alcohol_content}
                  onChange={handleInputChange}
                  placeholder="e.g., 13.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country_of_origin">Country of Origin</Label>
                <Input
                  id="country_of_origin"
                  name="country_of_origin"
                  value={formData.country_of_origin}
                  onChange={handleInputChange}
                  placeholder="e.g., France"
                />
              </div>
            </CardContent>
          </Card>

          {/* Producer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Producer Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="producer_name">Producer Name</Label>
                <Input
                  id="producer_name"
                  name="producer_name"
                  value={formData.producer_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="producer_address">Producer Address</Label>
                <Textarea
                  id="producer_address"
                  name="producer_address"
                  value={formData.producer_address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Product description..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={createProductMutation.isPending || updateProductMutation.isPending}
            >
              {(createProductMutation.isPending || updateProductMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isEdit ? 'Update Product' : 'Create Product'}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/products')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
