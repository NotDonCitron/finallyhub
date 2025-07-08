const express = require('express');
const { verifyToken } = require('./auth');
const router = express.Router();

// In-memory storage (in production: use database)
let tasks = [
  { id: 1, title: 'Beispielaufgabe', date: null, files: [], userId: 1 }
];

// Get all tasks
router.get('/', verifyToken, (req, res) => {
  const userTasks = tasks.filter(task => task.userId === req.user.userId);
  res.json(userTasks);
});

// Create task
router.post('/', verifyToken, (req, res) => {
  const { title, date } = req.body;
  const newTask = {
    id: Date.now(),
    title,
    date: date || null,
    files: [],
    userId: req.user.userId
  };
  
  tasks.push(newTask);
  res.json(newTask);
});

// Update task
router.put('/:id', verifyToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, date } = req.body;
  
  const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.user.userId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Aufgabe nicht gefunden' });
  }
  
  tasks[taskIndex] = { ...tasks[taskIndex], title, date };
  res.json(tasks[taskIndex]);
});

// Delete task
router.delete('/:id', verifyToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  
  const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.user.userId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Aufgabe nicht gefunden' });
  }
  
  tasks.splice(taskIndex, 1);
  res.json({ message: 'Aufgabe gelöscht' });
});

module.exports = router;