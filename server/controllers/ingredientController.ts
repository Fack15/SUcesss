import { Request, Response } from 'express';
import { IngredientService } from '../services/ingredientService';
import { insertIngredientSchema, updateIngredientSchema } from '../../shared/schema';
import { AuthenticatedRequest } from '../middleware/auth';

const ingredientService = new IngredientService();

export class IngredientController {

  async getAllIngredients(req: Request, res: Response) {
    try {
      const { search, category, allergen } = req.query;

      let ingredients;

      if (search) {
        ingredients = await ingredientService.searchIngredients(search as string);
      } else if (category) {
        ingredients = await ingredientService.getIngredientsByCategory(category as string);
      } else if (allergen) {
        ingredients = await ingredientService.getIngredientsByAllergen(allergen as string);
      } else {
        ingredients = await ingredientService.getAllIngredients();
      }

      res.status(200).json({
        success: true,
        data: ingredients,
        count: ingredients.length
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ingredients' });
    }
  }

  async getIngredientById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const ingredient = await ingredientService.getIngredientById(id);

      if (!ingredient) {
        return res.status(404).json({ error: 'Ingredient not found' });
      }

      res.status(200).json({
        success: true,
        data: ingredient
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch ingredient' });
    }
  }

  async createIngredient(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = insertIngredientSchema.parse(req.body);
      const ingredient = await ingredientService.createIngredient(validatedData);

      res.status(201).json({
        success: true,
        message: 'Ingredient created successfully',
        data: ingredient
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors
        });
      }
      res.status(500).json({ error: 'Failed to create ingredient' });
    }
  }

  async updateIngredient(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = updateIngredientSchema.parse(req.body);
      
      const ingredient = await ingredientService.updateIngredient(id, validatedData);

      if (!ingredient) {
        return res.status(404).json({ error: 'Ingredient not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Ingredient updated successfully',
        data: ingredient
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors
        });
      }
      res.status(500).json({ error: 'Failed to update ingredient' });
    }
  }

  async deleteIngredient(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await ingredientService.deleteIngredient(id);

      if (!deleted) {
        return res.status(404).json({ error: 'Ingredient not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Ingredient deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete ingredient' });
    }
  }

  async duplicateIngredient(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const originalIngredient = await ingredientService.getIngredientById(id);

      if (!originalIngredient) {
        return res.status(404).json({ error: 'Ingredient not found' });
      }

      const { id: _, created_at, updated_at, ...ingredientData } = originalIngredient;
      const duplicatedIngredient = await ingredientService.createIngredient({
        ...ingredientData,
        name: `${ingredientData.name} (Copy)`,
        eNumber: `${ingredientData.eNumber}-COPY`
      });

      res.status(201).json({
        success: true,
        message: 'Ingredient duplicated successfully',
        data: duplicatedIngredient
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to duplicate ingredient' });
    }
  }
}