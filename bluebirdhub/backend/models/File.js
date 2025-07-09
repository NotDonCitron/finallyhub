const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const File = sequelize.define('File', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mimetype: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  workspaceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'workspaces',
      key: 'id'
    }
  },
  taskId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tasks',
      key: 'id'
    }
  },
  uploadedById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'files',
  timestamps: true
});

module.exports = File;