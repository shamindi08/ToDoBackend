const express = require('express');
const router = express.Router();
const {
    addTodo,
    getAllTodos,
    updateTodo,
    deleteTodo,
    markTodoDone,
    removeTodoMarkDone
} = require('../controllers/todoController');

// Add Todo
router.post('/', addTodo);

// Get All Todos by User ID
router.get('/user/:userId', getAllTodos);

// Get All Todos (with optional userId filter via query parameter)
router.get('/', getAllTodos);

// Update Todo
router.put('/:id', updateTodo);

// Delete Todo
router.delete('/:id', deleteTodo);

// Mark Todo as Done
router.patch('/:id/done', markTodoDone);

// Remove Todo Mark Done (Mark as Undone)
router.patch('/:id/undone', removeTodoMarkDone);

module.exports = router;