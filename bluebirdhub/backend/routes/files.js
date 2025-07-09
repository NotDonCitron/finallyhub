const express = require('express');
const path = require('path');
const fs = require('fs');
const { File, User, Workspace, Task } = require('../models');
const { verifyToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// Get all files (with optional filtering)
router.get('/', verifyToken, async (req, res) => {
  try {
    const { workspaceId, taskId } = req.query;
    
    const whereClause = {};
    
    if (workspaceId) {
      whereClause.workspaceId = workspaceId;
    }
    
    if (taskId) {
      whereClause.taskId = taskId;
    }

    const files = await File.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Workspace,
          as: 'workspace',
          attributes: ['id', 'name'],
          where: workspaceId ? undefined : { ownerId: req.user.id }
        },
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'title'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ files });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Dateien' });
  }
});

// Get single file
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Workspace,
          as: 'workspace',
          attributes: ['id', 'name'],
          where: { ownerId: req.user.id }
        },
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'title'],
          required: false
        }
      ]
    });

    if (!file) {
      return res.status(404).json({ error: 'Datei nicht gefunden' });
    }

    res.json({ file });
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Datei' });
  }
});

// Upload file
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Keine Datei hochgeladen' });
    }

    const { workspaceId, taskId } = req.body;

    // Verify workspace belongs to user if specified
    if (workspaceId) {
      const workspace = await Workspace.findOne({
        where: { id: workspaceId, ownerId: req.user.id }
      });

      if (!workspace) {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: 'Workspace nicht gefunden' });
      }
    }

    // Verify task belongs to user's workspace if specified
    if (taskId) {
      const task = await Task.findOne({
        where: { id: taskId },
        include: [
          {
            model: Workspace,
            as: 'workspace',
            where: { ownerId: req.user.id }
          }
        ]
      });

      if (!task) {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(404).json({ error: 'Aufgabe nicht gefunden' });
      }
    }

    const file = await File.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`,
      workspaceId: workspaceId || null,
      taskId: taskId || null,
      uploadedById: req.user.id
    });

    const newFile = await File.findByPk(file.id, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Workspace,
          as: 'workspace',
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'title'],
          required: false
        }
      ]
    });

    res.status(201).json({ 
      message: 'Datei erfolgreich hochgeladen',
      file: newFile 
    });
  } catch (error) {
    console.error('Upload file error:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Fehler beim Hochladen der Datei' });
  }
});

// Download file
router.get('/:id/download', verifyToken, async (req, res) => {
  try {
    const file = await File.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Workspace,
          as: 'workspace',
          where: { ownerId: req.user.id }
        }
      ]
    });

    if (!file) {
      return res.status(404).json({ error: 'Datei nicht gefunden' });
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ error: 'Datei existiert nicht auf dem Server' });
    }

    res.download(file.path, file.originalName);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ error: 'Fehler beim Herunterladen der Datei' });
  }
});

// Update file metadata
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { tags } = req.body;

    const file = await File.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Workspace,
          as: 'workspace',
          where: { ownerId: req.user.id }
        }
      ]
    });

    if (!file) {
      return res.status(404).json({ error: 'Datei nicht gefunden' });
    }

    await file.update({
      tags: tags || file.tags
    });

    const updatedFile = await File.findByPk(file.id, {
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Workspace,
          as: 'workspace',
          attributes: ['id', 'name'],
          required: false
        },
        {
          model: Task,
          as: 'task',
          attributes: ['id', 'title'],
          required: false
        }
      ]
    });

    res.json({ 
      message: 'Datei erfolgreich aktualisiert',
      file: updatedFile 
    });
  } catch (error) {
    console.error('Update file error:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Datei' });
  }
});

// Delete file
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const file = await File.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Workspace,
          as: 'workspace',
          where: { ownerId: req.user.id }
        }
      ]
    });

    if (!file) {
      return res.status(404).json({ error: 'Datei nicht gefunden' });
    }

    // Delete physical file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await file.destroy();

    res.json({ message: 'Datei erfolgreich gelöscht' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Datei' });
  }
});

module.exports = router;