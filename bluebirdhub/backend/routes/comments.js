const express = require('express');
const { Comment, User, Task, Workspace } = require('../models');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Get comments for a task
router.get('/', verifyToken, async (req, res) => {
  try {
    const { taskId } = req.query;

    if (!taskId) {
      return res.status(400).json({ error: 'Task ID ist erforderlich' });
    }

    // Verify task belongs to user's workspace
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
      return res.status(404).json({ error: 'Aufgabe nicht gefunden' });
    }

    const comments = await Comment.findAll({
      where: { taskId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'displayName']
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'displayName']
            }
          ]
        }
      ],
      where: { parentId: null }, // Only top-level comments
      order: [['createdAt', 'ASC']]
    });

    res.json({ comments });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Fehler beim Laden der Kommentare' });
  }
});

// Create new comment
router.post('/', verifyToken, async (req, res) => {
  try {
    const { content, taskId, parentId } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Kommentar-Inhalt ist erforderlich' });
    }

    if (!taskId) {
      return res.status(400).json({ error: 'Task ID ist erforderlich' });
    }

    // Verify task belongs to user's workspace
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
      return res.status(404).json({ error: 'Aufgabe nicht gefunden' });
    }

    // If it's a reply, verify parent comment exists
    if (parentId) {
      const parentComment = await Comment.findOne({
        where: { id: parentId, taskId }
      });

      if (!parentComment) {
        return res.status(404).json({ error: 'Eltern-Kommentar nicht gefunden' });
      }
    }

    const comment = await Comment.create({
      content: content.trim(),
      taskId,
      authorId: req.user.id,
      parentId: parentId || null
    });

    const newComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'displayName']
        }
      ]
    });

    res.status(201).json({ 
      message: 'Kommentar erfolgreich erstellt',
      comment: newComment 
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Fehler beim Erstellen des Kommentars' });
  }
});

// Update comment
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Kommentar-Inhalt ist erforderlich' });
    }

    const comment = await Comment.findOne({
      where: { 
        id: req.params.id,
        authorId: req.user.id // Only author can edit
      },
      include: [
        {
          model: Task,
          as: 'task',
          include: [
            {
              model: Workspace,
              as: 'workspace',
              where: { ownerId: req.user.id }
            }
          ]
        }
      ]
    });

    if (!comment) {
      return res.status(404).json({ error: 'Kommentar nicht gefunden oder keine Berechtigung' });
    }

    await comment.update({
      content: content.trim()
    });

    const updatedComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'displayName']
        }
      ]
    });

    res.json({ 
      message: 'Kommentar erfolgreich aktualisiert',
      comment: updatedComment 
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Kommentars' });
  }
});

// Delete comment
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findOne({
      where: { 
        id: req.params.id,
        authorId: req.user.id // Only author can delete
      },
      include: [
        {
          model: Task,
          as: 'task',
          include: [
            {
              model: Workspace,
              as: 'workspace',
              where: { ownerId: req.user.id }
            }
          ]
        }
      ]
    });

    if (!comment) {
      return res.status(404).json({ error: 'Kommentar nicht gefunden oder keine Berechtigung' });
    }

    // Delete all replies first
    await Comment.destroy({
      where: { parentId: comment.id }
    });

    await comment.destroy();

    res.json({ message: 'Kommentar erfolgreich gelöscht' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Kommentars' });
  }
});

module.exports = router;