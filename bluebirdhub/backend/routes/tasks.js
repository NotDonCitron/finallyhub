const express = require('express');
const { Task, User, Workspace, File, Comment } = require('../models');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Get all tasks (with optional filtering)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { workspaceId, status, assignedToId, priority } = req.query;
    
    const whereClause = {};
    
    // Filter by workspace if specified
    if (workspaceId) {
      whereClause.workspaceId = workspaceId;
    }
    
    // Filter by status if specified
    if (status) {
      whereClause.status = status;
    }
    
    // Filter by assigned user if specified
    if (assignedToId) {
      whereClause.assignedToId = assignedToId;
    }
    
    // Filter by priority if specified
    if (priority) {
      whereClause.priority = priority;
    }

    const tasks = await Task.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Workspace,
          as: 'workspace',
          attributes: ['id', 'name', 'color'],
          where: { ownerId: req.user.id }
        },
        {
          model: File,
          as: 'files',
          attributes: ['id', 'filename', 'originalName', 'mimetype', 'size']
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id'],
          limit: 0
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Aufgaben' });
  }
});

// Get single task
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Workspace,
          as: 'workspace',
          attributes: ['id', 'name', 'color'],
          where: { ownerId: req.user.id }
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
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'displayName']
            }
          ],
          order: [['createdAt', 'ASC']]
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Aufgabe nicht gefunden' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Aufgabe' });
  }
});

// Create new task
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, description, workspaceId, assignedToId, priority, dueDate } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Titel ist erforderlich' });
    }

    if (!workspaceId) {
      return res.status(400).json({ error: 'Workspace ist erforderlich' });
    }

    // Verify workspace belongs to user
    const workspace = await Workspace.findOne({
      where: { id: workspaceId, ownerId: req.user.id }
    });

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace nicht gefunden' });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || null,
      workspaceId,
      assignedToId: assignedToId || null,
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdById: req.user.id
    });

    const newTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Workspace,
          as: 'workspace',
          attributes: ['id', 'name', 'color']
        }
      ]
    });

    res.status(201).json({ 
      message: 'Aufgabe erfolgreich erstellt',
      task: newTask 
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen der Aufgabe' });
  }
});

// Update task
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedToId } = req.body;

    const task = await Task.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Workspace,
          as: 'workspace',
          where: { ownerId: req.user.id }
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Aufgabe nicht gefunden' });
    }

    await task.update({
      title: title?.trim() || task.title,
      description: description?.trim() || task.description,
      status: status || task.status,
      priority: priority || task.priority,
      dueDate: dueDate !== undefined ? dueDate : task.dueDate,
      assignedToId: assignedToId !== undefined ? assignedToId : task.assignedToId
    });

    const updatedTask = await Task.findByPk(task.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Workspace,
          as: 'workspace',
          attributes: ['id', 'name', 'color']
        }
      ]
    });

    res.json({ 
      message: 'Aufgabe erfolgreich aktualisiert',
      task: updatedTask 
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Aufgabe' });
  }
});

// Delete task
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Workspace,
          as: 'workspace',
          where: { ownerId: req.user.id }
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Aufgabe nicht gefunden' });
    }

    await task.destroy();

    res.json({ message: 'Aufgabe erfolgreich gelöscht' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Aufgabe' });
  }
});

// Get tasks for calendar view
router.get('/calendar/:year/:month', verifyToken, async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const tasks = await Task.findAll({
      where: {
        dueDate: {
          [require('sequelize').Op.between]: [startDate, endDate]
        }
      },
      include: [
        {
          model: Workspace,
          as: 'workspace',
          where: { ownerId: req.user.id },
          attributes: ['id', 'name', 'color']
        },
        {
          model: User,
          as: 'assignee',
          attributes: ['id', 'username', 'displayName']
        }
      ],
      order: [['dueDate', 'ASC']]
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get calendar tasks error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Kalender-Aufgaben' });
  }
});

module.exports = router;