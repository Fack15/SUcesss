import { Router } from 'express';
import { IngredientController } from '../controllers/ingredientController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const ingredientController = new IngredientController();

// Public routes
router.get('/', ingredientController.getAllIngredients.bind(ingredientController));
router.get('/:id', ingredientController.getIngredientById.bind(ingredientController));

// Protected routes (require authentication)
router.post('/', authenticateToken, ingredientController.createIngredient.bind(ingredientController));
router.put('/:id', authenticateToken, ingredientController.updateIngredient.bind(ingredientController));
router.delete('/:id', authenticateToken, ingredientController.deleteIngredient.bind(ingredientController));
router.post('/:id/duplicate', authenticateToken, ingredientController.duplicateIngredient.bind(ingredientController));

export default router;