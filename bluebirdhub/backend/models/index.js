const User = require('./User');
const Workspace = require('./Workspace');
const Task = require('./Task');
const File = require('./File');
const Comment = require('./Comment');
const Document = require('./Document');

// Define associations
User.hasMany(Workspace, { foreignKey: 'ownerId', as: 'ownedWorkspaces' });
Workspace.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Workspace.hasMany(Task, { foreignKey: 'workspaceId', as: 'tasks' });
Task.belongsTo(Workspace, { foreignKey: 'workspaceId', as: 'workspace' });

User.hasMany(Task, { foreignKey: 'createdById', as: 'createdTasks' });
Task.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });

User.hasMany(Task, { foreignKey: 'assignedToId', as: 'assignedTasks' });
Task.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignee' });

User.hasMany(File, { foreignKey: 'uploadedById', as: 'uploadedFiles' });
File.belongsTo(User, { foreignKey: 'uploadedById', as: 'uploader' });

Workspace.hasMany(File, { foreignKey: 'workspaceId', as: 'files' });
File.belongsTo(Workspace, { foreignKey: 'workspaceId', as: 'workspace' });

Task.hasMany(File, { foreignKey: 'taskId', as: 'files' });
File.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

Task.hasMany(Comment, { foreignKey: 'taskId', as: 'comments' });
Comment.belongsTo(Task, { foreignKey: 'taskId', as: 'task' });

User.hasMany(Comment, { foreignKey: 'authorId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });

// Document associations
User.hasMany(Document, { foreignKey: 'createdById', as: 'createdDocuments' });
Document.belongsTo(User, { foreignKey: 'createdById', as: 'creator' });

User.hasMany(Document, { foreignKey: 'lastModifiedById', as: 'modifiedDocuments' });
Document.belongsTo(User, { foreignKey: 'lastModifiedById', as: 'lastModifier' });

Workspace.hasMany(Document, { foreignKey: 'workspaceId', as: 'documents' });
Document.belongsTo(Workspace, { foreignKey: 'workspaceId', as: 'workspace' });

module.exports = {
  User,
  Workspace,
  Task,
  File,
  Comment,
  Document
};