import { Product, InsertProduct, UpdateProduct } from '../../shared/schema';

export class ProductService {
  private products: Map<string, Product> = new Map();
  private currentId = 1;

  constructor() {
    // Initialize with some sample data
    this.seedData();
  }

  private seedData() {
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Château Margaux 2015',
        brand: 'Château Margaux',
        netVolume: '750ml',
        vintage: '2015',
        type: 'Red Wine',
        sugarContent: 'Dry',
        appellation: 'Margaux',
        sku: 'CM2015-750',
        alcohol: '13.5%',
        country: 'France',
        ean: '3760123456789',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '2',
        name: 'Dom Pérignon 2012',
        brand: 'Dom Pérignon',
        netVolume: '750ml',
        vintage: '2012',
        type: 'Champagne',
        sugarContent: 'Brut',
        appellation: 'Champagne',
        sku: 'DP2012-750',
        alcohol: '12.5%',
        country: 'France',
        ean: '3760987654321',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    sampleProducts.forEach(product => {
      this.products.set(product.id, product);
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = (++this.currentId).toString();
    const product: Product = {
      ...productData,
      id,
      created_at: new Date(),
      updated_at: new Date()
    };

    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, productData: UpdateProduct): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      return undefined;
    }

    const updatedProduct: Product = {
      ...existingProduct,
      ...productData,
      updated_at: new Date()
    };

    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const allProducts = Array.from(this.products.values());
    const lowercaseQuery = query.toLowerCase();

    return allProducts.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.brand.toLowerCase().includes(lowercaseQuery) ||
      product.type.toLowerCase().includes(lowercaseQuery) ||
      product.country.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getProductsByCategory(type: string): Promise<Product[]> {
    const allProducts = Array.from(this.products.values());
    return allProducts.filter(product => 
      product.type.toLowerCase() === type.toLowerCase()
    );
  }
}