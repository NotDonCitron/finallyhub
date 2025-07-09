const { User } = require('../models');
const bcrypt = require('bcryptjs');

async function createDemoUsers() {
  const demoUsers = [
    { username: 'user1', password: 'pass123', displayName: 'Demo User 1', email: 'user1@bluebirdhub.com' },
    { username: 'user2', password: 'pass123', displayName: 'Demo User 2', email: 'user2@bluebirdhub.com' },
    { username: 'user3', password: 'pass123', displayName: 'Demo User 3', email: 'user3@bluebirdhub.com' }
  ];

  for (const userData of demoUsers) {
    try {
      const existingUser = await User.findOne({ where: { username: userData.username } });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await User.create({
          ...userData,
          password: hashedPassword
        });
        console.log(`Demo user ${userData.username} created`);
      } else {
        console.log(`Demo user ${userData.username} already exists`);
      }
    } catch (error) {
      console.error(`Error creating user ${userData.username}:`, error.message);
    }
  }
}

createDemoUsers()
  .then(() => {
    console.log('Demo user creation completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });