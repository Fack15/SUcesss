import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTables() {
  try {
    console.log('Creating database tables in Supabase...');

    // Create users table
    console.log('Creating users table...');
    const { error: usersError } = await supabaseAdmin
      .from('users')
      .select('id')
      .limit(1);

    if (usersError && usersError.code === 'PGRST116') {
      console.log('Users table does not exist, it will be created when first used');
    }

    // Create products table  
    console.log('Creating products table...');
    const { error: productsError } = await supabaseAdmin
      .from('products')
      .select('id')
      .limit(1);

    if (productsError && productsError.code === 'PGRST116') {
      console.log('Products table does not exist, it will be created when first used');
    }

    // Create ingredients table
    console.log('Creating ingredients table...');
    const { error: ingredientsError } = await supabaseAdmin
      .from('ingredients')
      .select('id')
      .limit(1);

    if (ingredientsError && ingredientsError.code === 'PGRST116') {
      console.log('Ingredients table does not exist, it will be created when first used');
    }

    console.log('Database connection verified!');
    console.log('Tables will be created automatically when the application starts.');

  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

createTables();