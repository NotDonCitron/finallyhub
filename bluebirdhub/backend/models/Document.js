const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Document = sequelize.define('Document', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: ''
  },
  workspaceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'workspaces',
      key: 'id'
    }
  },
  createdById: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  lastModifiedById: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  version: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'documents',
  timestamps: true,
  indexes: [
    {
      fields: ['workspaceId']
    },
    {
      fields: ['createdById']
    },
    {
      fields: ['title']
    }
  ]
});

module.exports = Document;