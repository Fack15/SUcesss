import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { insertProductSchema, updateProductSchema } from '../../shared/schema';
import { AuthenticatedRequest } from '../middleware/auth';

const productService = new ProductService();

export class ProductController {

  async getAllProducts(req: Request, res: Response) {
    try {
      const { search, category } = req.query;

      let products;

      if (search) {
        products = await productService.searchProducts(search as string);
      } else if (category) {
        products = await productService.getProductsByCategory(category as string);
      } else {
        products = await productService.getAllProducts();
      }

      res.status(200).json({
        success: true,
        data: products,
        count: products.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  }

  async createProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await productService.createProduct(validatedData);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors
        });
      }
      res.status(500).json({ error: 'Failed to create product' });
    }
  }

  async updateProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = updateProductSchema.parse(req.body);
      
      const product = await productService.updateProduct(id, validatedData);

      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors
        });
      }
      res.status(500).json({ error: 'Failed to update product' });
    }
  }

  async deleteProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await productService.deleteProduct(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete product' });
    }
  }

  async duplicateProduct(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const originalProduct = await productService.getProductById(id);

      if (!originalProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }

      const { id: _, created_at, updated_at, ...productData } = originalProduct;
      const duplicatedProduct = await productService.createProduct({
        ...productData,
        name: `${productData.name} (Copy)`,
        sku: `${productData.sku}-COPY`
      });

      res.status(201).json({
        success: true,
        message: 'Product duplicated successfully',
        data: duplicatedProduct
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to duplicate product' });
    }
  }
}