const express = require('express');
const { Workspace, User, Task, File } = require('../models');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Get all workspaces for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const workspaces = await Workspace.findAll({
      where: { ownerId: req.user.id },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Task,
          as: 'tasks',
          attributes: ['id', 'title', 'status', 'priority']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ workspaces });
  } catch (error) {
    console.error('Get workspaces error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Workspaces' });
  }
});

// Get single workspace
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      where: { 
        id: req.params.id,
        ownerId: req.user.id 
      },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Task,
          as: 'tasks',
          include: [
            {
              model: User,
              as: 'assignee',
              attributes: ['id', 'username', 'displayName']
            },
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'username', 'displayName']
            }
          ]
        },
        {
          model: File,
          as: 'files',
          include: [
            {
              model: User,
              as: 'uploader',
              attributes: ['id', 'username', 'displayName']
            }
          ]
        }
      ]
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace nicht gefunden' });
    }

    res.json({ workspace });
  } catch (error) {
    console.error('Get workspace error:', error);
    res.status(500).json({ error: 'Fehler beim Laden des Workspace' });
  }
});

// Create new workspace
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name ist erforderlich' });
    }

    const workspace = await Workspace.create({
      name: name.trim(),
      description: description?.trim() || null,
      color: color || '#1A6ED8',
      ownerId: req.user.id
    });

    const newWorkspace = await Workspace.findByPk(workspace.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'displayName']
        }
      ]
    });

    res.status(201).json({ 
      message: 'Workspace erfolgreich erstellt',
      workspace: newWorkspace 
    });
  } catch (error) {
    console.error('Create workspace error:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Workspace' });
  }
});

// Update workspace
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, description, color, isActive } = req.body;

    const workspace = await Workspace.findOne({
      where: { 
        id: req.params.id,
        ownerId: req.user.id 
      }
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace nicht gefunden' });
    }

    await workspace.update({
      name: name?.trim() || workspace.name,
      description: description?.trim() || workspace.description,
      color: color || workspace.color,
      isActive: isActive !== undefined ? isActive : workspace.isActive
    });

    const updatedWorkspace = await Workspace.findByPk(workspace.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'displayName']
        }
      ]
    });

    res.json({ 
      message: 'Workspace erfolgreich aktualisiert',
      workspace: updatedWorkspace 
    });
  } catch (error) {
    console.error('Update workspace error:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Workspace' });
  }
});

// Delete workspace
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      where: { 
        id: req.params.id,
        ownerId: req.user.id 
      }
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace nicht gefunden' });
    }

    // Check if workspace has tasks
    const taskCount = await Task.count({ where: { workspaceId: workspace.id } });
    if (taskCount > 0) {
      return res.status(400).json({ 
        error: 'Workspace kann nicht gelöscht werden, da es noch Aufgaben enthält' 
      });
    }

    await workspace.destroy();

    res.json({ message: 'Workspace erfolgreich gelöscht' });
  } catch (error) {
    console.error('Delete workspace error:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Workspace' });
  }
});

// Get workspace statistics
router.get('/:id/stats', verifyToken, async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      where: { 
        id: req.params.id,
        ownerId: req.user.id 
      }
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace nicht gefunden' });
    }

    const [
      totalTasks,
      openTasks,
      inProgressTasks,
      completedTasks,
      totalFiles
    ] = await Promise.all([
      Task.count({ where: { workspaceId: workspace.id } }),
      Task.count({ where: { workspaceId: workspace.id, status: 'open' } }),
      Task.count({ where: { workspaceId: workspace.id, status: 'in_progress' } }),
      Task.count({ where: { workspaceId: workspace.id, status: 'completed' } }),
      File.count({ where: { workspaceId: workspace.id } })
    ]);

    const stats = {
      totalTasks,
      openTasks,
      inProgressTasks,
      completedTasks,
      totalFiles,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };

    res.json({ stats });
  } catch (error) {
    console.error('Get workspace stats error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Statistiken' });
  }
});

module.exports = router;