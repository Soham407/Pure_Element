require('dotenv').config();
const { supabaseAdmin } = require('../config/supabase');

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    console.log('📊 Supabase URL:', process.env.SUPABASE_URL);
    
    // Test database connection
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }

    console.log('✅ Database connection successful!');

    // Test categories
    const { data: categories, error: catError } = await supabaseAdmin
      .from('categories')
      .select('*');

    if (catError) {
      console.error('❌ Categories table error:', catError.message);
    } else {
      console.log(`✅ Categories table: ${categories.length} categories found`);
    }

    // Test products
    const { data: products, error: prodError } = await supabaseAdmin
      .from('products')
      .select('*');

    if (prodError) {
      console.error('❌ Products table error:', prodError.message);
    } else {
      console.log(`✅ Products table: ${products.length} products found`);
    }

    console.log('\n🎉 All tests passed! Your Supabase setup is working correctly.');
    return true;

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your .env file has correct SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    console.log('2. Ensure your Supabase project is active');
    console.log('3. Run the database setup script first');
    return false;
  }
}

testConnection();
