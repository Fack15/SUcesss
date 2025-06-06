import { Ingredient, InsertIngredient, UpdateIngredient } from '../../shared/schema';

export class IngredientService {
  private ingredients: Map<string, Ingredient> = new Map();
  private currentId = 1;

  constructor() {
    // Initialize with some sample data
    this.seedData();
  }

  private seedData() {
    const sampleIngredients: Ingredient[] = [
      {
        id: '1',
        name: 'Sulfites',
        category: 'Preservative',
        eNumber: 'E220-E228',
        allergens: ['Contains sulfites'],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '2',
        name: 'Citric Acid',
        category: 'Acidity Regulator',
        eNumber: 'E330',
        allergens: [],
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    sampleIngredients.forEach(ingredient => {
      this.ingredients.set(ingredient.id, ingredient);
    });
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    return Array.from(this.ingredients.values());
  }

  async getIngredientById(id: string): Promise<Ingredient | undefined> {
    return this.ingredients.get(id);
  }

  async createIngredient(ingredientData: InsertIngredient): Promise<Ingredient> {
    const id = (++this.currentId).toString();
    const ingredient: Ingredient = {
      id,
      name: ingredientData.name,
      category: ingredientData.category,
      eNumber: ingredientData.eNumber,
      allergens: ingredientData.allergens || null,
      created_at: new Date(),
      updated_at: new Date()
    };

    this.ingredients.set(id, ingredient);
    return ingredient;
  }

  async updateIngredient(id: string, ingredientData: UpdateIngredient): Promise<Ingredient | undefined> {
    const existingIngredient = this.ingredients.get(id);
    if (!existingIngredient) {
      return undefined;
    }

    const updatedIngredient: Ingredient = {
      ...existingIngredient,
      ...ingredientData,
      updated_at: new Date()
    };

    this.ingredients.set(id, updatedIngredient);
    return updatedIngredient;
  }

  async deleteIngredient(id: string): Promise<boolean> {
    return this.ingredients.delete(id);
  }

  async searchIngredients(query: string): Promise<Ingredient[]> {
    const allIngredients = Array.from(this.ingredients.values());
    const lowercaseQuery = query.toLowerCase();

    return allIngredients.filter(ingredient =>
      ingredient.name.toLowerCase().includes(lowercaseQuery) ||
      ingredient.category.toLowerCase().includes(lowercaseQuery) ||
      ingredient.eNumber.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getIngredientsByCategory(category: string): Promise<Ingredient[]> {
    const allIngredients = Array.from(this.ingredients.values());
    return allIngredients.filter(ingredient => 
      ingredient.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getIngredientsByAllergen(allergen: string): Promise<Ingredient[]> {
    const allIngredients = Array.from(this.ingredients.values());
    return allIngredients.filter(ingredient => 
      ingredient.allergens?.some(a => a.toLowerCase().includes(allergen.toLowerCase()))
    );
  }
}