const { sequelize } = require('../config/database');

// Test database configuration
const testDbConfig = {
  dialect: 'sqlite',
  storage: ':memory:', // In-memory database for testing
  logging: false,
  define: {
    timestamps: true,
    underscored: false,
  },
};

// Setup test database
beforeAll(async () => {
  // Force sync database for testing
  await sequelize.sync({ force: true });
  console.log('Test database synchronized');
});

// Clean up after tests
afterAll(async () => {
  await sequelize.close();
  console.log('Test database connection closed');
});

// Clean up after each test
afterEach(async () => {
  // Clear all tables
  const models = Object.keys(sequelize.models);
  for (const model of models) {
    await sequelize.models[model].destroy({ truncate: true });
  }
});

module.exports = {
  testDbConfig,
};