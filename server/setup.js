const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model (you'll need to create this)
const User = require('./src/models/User').default;

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      return;
    }

    // Create admin user
    const adminUser = new User({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'admin'
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${process.env.ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${process.env.ADMIN_PASSWORD}`);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

createAdminUser();
