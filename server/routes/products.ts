import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const productController = new ProductController();

// Public routes
router.get('/', productController.getAllProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));

// Protected routes (require authentication)
router.post('/', authenticateToken, productController.createProduct.bind(productController));
router.put('/:id', authenticateToken, productController.updateProduct.bind(productController));
router.delete('/:id', authenticateToken, productController.deleteProduct.bind(productController));
router.post('/:id/duplicate', authenticateToken, productController.duplicateProduct.bind(productController));

export default router;