require('dotenv').config();
const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../config/supabase');

async function createAdminUser() {
  try {
    const adminEmail = 'admin@pureelement.com';
    const adminPassword = 'admin123';
    
    console.log('Creating admin user...');
    
    // Check if admin already exists
    const { data: existingAdmin } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', adminEmail)
      .single();

    if (existingAdmin) {
      console.log('Admin user already exists!');
      return;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

    // Create admin user
    const { data: admin, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email: adminEmail,
          password_hash: passwordHash,
          role: 'admin'
        }
      ])
      .select('id, email, role')
      .single();

    if (error) {
      console.error('Error creating admin user:', error);
      return;
    }

    // Create cart for admin user
    await supabaseAdmin
      .from('carts')
      .insert([{ user_id: admin.id }]);

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('⚠️  Please change the password after first login');

  } catch (error) {
    console.error('Failed to create admin user:', error);
  }
}

async function createCustomerUser() {
  try {
    const customerEmail = 'customer@pureelement.com';
    const customerPassword = 'customer123';
    
    console.log('Creating demo customer user...');
    
    // Check if customer already exists
    const { data: existingCustomer } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', customerEmail)
      .single();

    if (existingCustomer) {
      console.log('Demo customer user already exists!');
      return;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(customerPassword, saltRounds);

    // Create customer user
    const { data: customer, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email: customerEmail,
          password_hash: passwordHash,
          role: 'customer'
        }
      ])
      .select('id, email, role')
      .single();

    if (error) {
      console.error('Error creating customer user:', error);
      return;
    }

    // Create cart for customer user
    await supabaseAdmin
      .from('carts')
      .insert([{ user_id: customer.id }]);

    console.log('✅ Demo customer user created successfully!');
    console.log('📧 Email:', customerEmail);
    console.log('🔑 Password:', customerPassword);

  } catch (error) {
    console.error('Failed to create customer user:', error);
  }
}

async function main() {
  console.log('🚀 Setting up Pure_element demo users...\n');
  
  await createAdminUser();
  console.log('');
  await createCustomerUser();
  
  console.log('\n✨ Setup complete! You can now use these accounts to test the application.');
  console.log('\n📝 Next steps:');
  console.log('1. Start the backend server: npm run dev (in backend folder)');
  console.log('2. Start the frontend: npm start (in frontend folder)');
  console.log('3. Visit http://localhost:3000 and login with either account');
  
  process.exit(0);
}

main();
