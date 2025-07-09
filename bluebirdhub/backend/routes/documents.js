const express = require('express');
const { Document, User, Workspace } = require('../models');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Get all documents for a workspace
router.get('/', verifyToken, async (req, res) => {
  try {
    const { workspace_id } = req.query;
    
    if (!workspace_id) {
      return res.status(400).json({ error: 'Workspace ID ist erforderlich' });
    }

    // Check if user has access to workspace
    const workspace = await Workspace.findOne({
      where: { 
        id: workspace_id,
        ownerId: req.user.id 
      }
    });

    if (!workspace) {
      return res.status(403).json({ error: 'Zugriff auf Workspace verweigert' });
    }

    const documents = await Document.findAll({
      where: { workspaceId: workspace_id },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: User,
          as: 'lastModifier',
          attributes: ['id', 'username', 'displayName']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    res.json(documents);
  } catch (error) {
    console.error('Get documents error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Dokumente' });
  }
});

// Get single document
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: User,
          as: 'lastModifier',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Workspace,
          as: 'workspace',
          attributes: ['id', 'name', 'ownerId']
        }
      ]
    });

    if (!document) {
      return res.status(404).json({ error: 'Dokument nicht gefunden' });
    }

    // Check if user has access to workspace
    if (document.workspace.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Zugriff verweigert' });
    }

    res.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Fehler beim Laden des Dokuments' });
  }
});

// Create new document
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content, workspace_id, tags } = req.body;

    if (!title || !workspace_id) {
      return res.status(400).json({ error: 'Titel und Workspace ID sind erforderlich' });
    }

    // Check if user has access to workspace
    const workspace = await Workspace.findOne({
      where: { 
        id: workspace_id,
        ownerId: req.user.id 
      }
    });

    if (!workspace) {
      return res.status(403).json({ error: 'Zugriff auf Workspace verweigert' });
    }

    const document = await Document.create({
      title: title.trim(),
      content: content || '',
      workspaceId: workspace_id,
      createdById: req.user.id,
      lastModifiedById: req.user.id,
      tags: tags || []
    });

    const newDocument = await Document.findByPk(document.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: User,
          as: 'lastModifier',
          attributes: ['id', 'username', 'displayName']
        }
      ]
    });

    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Dokuments' });
  }
});

// Update document
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const document = await Document.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Workspace,
          as: 'workspace',
          attributes: ['id', 'name', 'ownerId']
        }
      ]
    });

    if (!document) {
      return res.status(404).json({ error: 'Dokument nicht gefunden' });
    }

    // Check if user has access to workspace
    if (document.workspace.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Zugriff verweigert' });
    }

    await document.update({
      title: title?.trim() || document.title,
      content: content !== undefined ? content : document.content,
      tags: tags || document.tags,
      lastModifiedById: req.user.id,
      version: document.version + 1
    });

    const updatedDocument = await Document.findByPk(document.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: User,
          as: 'lastModifier',
          attributes: ['id', 'username', 'displayName']
        }
      ]
    });

    res.json(updatedDocument);
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Dokuments' });
  }
});

// Delete document
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const document = await Document.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Workspace,
          as: 'workspace',
          attributes: ['id', 'name', 'ownerId']
        }
      ]
    });

    if (!document) {
      return res.status(404).json({ error: 'Dokument nicht gefunden' });
    }

    // Check if user has access to workspace
    if (document.workspace.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Zugriff verweigert' });
    }

    await document.destroy();
    res.json({ message: 'Dokument erfolgreich gelöscht' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Dokuments' });
  }
});

// Search documents
router.get('/search/:query', verifyToken, async (req, res) => {
  try {
    const { query } = req.params;
    const { workspace_id } = req.query;

    if (!workspace_id) {
      return res.status(400).json({ error: 'Workspace ID ist erforderlich' });
    }

    // Check if user has access to workspace
    const workspace = await Workspace.findOne({
      where: { 
        id: workspace_id,
        ownerId: req.user.id 
      }
    });

    if (!workspace) {
      return res.status(403).json({ error: 'Zugriff auf Workspace verweigert' });
    }

    const documents = await Document.findAll({
      where: {
        workspaceId: workspace_id,
        [require('sequelize').Op.or]: [
          { title: { [require('sequelize').Op.like]: `%${query}%` } },
          { content: { [require('sequelize').Op.like]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: User,
          as: 'lastModifier',
          attributes: ['id', 'username', 'displayName']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    res.json(documents);
  } catch (error) {
    console.error('Search documents error:', error);
    res.status(500).json({ error: 'Fehler bei der Suche' });
  }
});

module.exports = router;