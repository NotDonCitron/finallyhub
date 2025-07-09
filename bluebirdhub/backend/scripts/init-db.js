const { sequelize } = require('../config/database');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Sync database models
    await sequelize.sync({ force: false });
    console.log('Database models synchronized.');
    
    // Create demo users if they don't exist
    const existingUsers = await User.count();
    if (existingUsers === 0) {
      console.log('Creating demo users...');
      
      const demoUsers = [
        {
          username: 'user1',
          email: 'user1@example.com',
          password: await bcrypt.hash('pass123', 10)
        },
        {
          username: 'user2',
          email: 'user2@example.com',
          password: await bcrypt.hash('pass123', 10)
        },
        {
          username: 'user3',
          email: 'user3@example.com',
          password: await bcrypt.hash('pass123', 10)
        },
        {
          username: 'admin',
          email: 'admin@example.com',
          password: await bcrypt.hash('admin123', 10)
        }
      ];
      
      for (const userData of demoUsers) {
        await User.create(userData);
        console.log(`Created user: ${userData.username}`);
      }
      
      console.log('Demo users created successfully.');
    } else {
      console.log(`Found ${existingUsers} existing users.`);
    }
    
    console.log('Database initialization complete.');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}

module.exports = initializeDatabase;