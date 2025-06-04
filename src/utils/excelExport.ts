
import * as XLSX from 'xlsx';

export const exportProductsToExcel = (products: any[]) => {
  const workbook = XLSX.utils.book_new();
  
  // Prepare data for export
  const exportData = products.map(product => ({
    'Product Name': product.name,
    'Brand': product.brand,
    'SKU': product.sku,
    'Net Volume': product.net_volume || '',
    'Vintage': product.vintage || '',
    'Type': product.type || '',
    'Sugar Content': product.sugar_content || '',
    'Appellation': product.appellation || '',
    'Alcohol Content (%)': product.alcohol_content || '',
    'Description': product.description || '',
    'Producer Name': product.producer_name || '',
    'Producer Address': product.producer_address || '',
    'Country of Origin': product.country_of_origin || '',
    'Created At': new Date(product.created_at).toLocaleDateString(),
    'Updated At': new Date(product.updated_at).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Set column widths
  const columnWidths = [
    { wch: 20 }, // Product Name
    { wch: 15 }, // Brand
    { wch: 15 }, // SKU
    { wch: 12 }, // Net Volume
    { wch: 10 }, // Vintage
    { wch: 15 }, // Type
    { wch: 15 }, // Sugar Content
    { wch: 20 }, // Appellation
    { wch: 15 }, // Alcohol Content
    { wch: 30 }, // Description
    { wch: 20 }, // Producer Name
    { wch: 30 }, // Producer Address
    { wch: 15 }, // Country
    { wch: 12 }, // Created At
    { wch: 12 }, // Updated At
  ];
  
  worksheet['!cols'] = columnWidths;
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
  
  // Generate filename with current date
  const fileName = `products_export_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  XLSX.writeFile(workbook, fileName);
};

export const exportIngredientsToExcel = (ingredients: any[]) => {
  const workbook = XLSX.utils.book_new();
  
  // Prepare data for export
  const exportData = ingredients.map(ingredient => ({
    'Ingredient Name': ingredient.name,
    'Category': ingredient.category,
    'E Number': ingredient.e_number || '',
    'Description': ingredient.description || '',
    'Allergens': ingredient.allergens ? ingredient.allergens.join(', ') : '',
    'Created At': new Date(ingredient.created_at).toLocaleDateString(),
    'Updated At': new Date(ingredient.updated_at).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Set column widths
  const columnWidths = [
    { wch: 25 }, // Ingredient Name
    { wch: 15 }, // Category
    { wch: 12 }, // E Number
    { wch: 40 }, // Description
    { wch: 30 }, // Allergens
    { wch: 12 }, // Created At
    { wch: 12 }, // Updated At
  ];
  
  worksheet['!cols'] = columnWidths;
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ingredients');
  
  // Generate filename with current date
  const fileName = `ingredients_export_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  XLSX.writeFile(workbook, fileName);
};

export const importProductsFromExcel = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Transform the data to match our database schema
        const transformedData = jsonData.map((row: any) => ({
          name: row['Product Name'] || '',
          brand: row['Brand'] || '',
          sku: row['SKU'] || '',
          net_volume: row['Net Volume'] || '',
          vintage: row['Vintage'] || '',
          type: row['Type'] || '',
          sugar_content: row['Sugar Content'] || '',
          appellation: row['Appellation'] || '',
          alcohol_content: row['Alcohol Content (%)'] ? parseFloat(row['Alcohol Content (%)']) : null,
          description: row['Description'] || '',
          producer_name: row['Producer Name'] || '',
          producer_address: row['Producer Address'] || '',
          country_of_origin: row['Country of Origin'] || '',
        }));
        
        resolve(transformedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};

export const importIngredientsFromExcel = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Transform the data to match our database schema
        const transformedData = jsonData.map((row: any) => ({
          name: row['Ingredient Name'] || '',
          category: row['Category'] || '',
          e_number: row['E Number'] || '',
          description: row['Description'] || '',
          allergens: row['Allergens'] ? row['Allergens'].split(',').map((a: string) => a.trim()) : [],
        }));
        
        resolve(transformedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
};
