const Todo = require('../model/Todo');

// Add Todo
const addTodo = async (req, res) => {
    try {
        const { title, description, userId, isUrgent } = req.body;

        const newTodo = new Todo({
            title,
            description,
            userId,
            isUrgent: isUrgent || false,
            completed: false
        });

        await newTodo.save();

        res.status(201).json({
            message: 'Todo added successfully',
            todo: newTodo
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error adding todo',
            error: error.message
        });
    }
};

// Get All Todos
const getAllTodos = async (req, res) => {
    try {
        // Check for userId in URL params first, then query params
        const userId = req.params.userId || req.query.userId;

        let todos;
        if (userId) {
            todos = await Todo.find({ userId });
        } else {
            todos = await Todo.find();
        }

        res.json({
            message: 'Todos retrieved successfully',
            todos,
            count: todos.length
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error getting todos',
            error: error.message
        });
    }
};

// Update Todo
const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Update fields
        if (title) todo.title = title;
        if (description) todo.description = description;

        await todo.save();

        res.json({
            message: 'Todo updated successfully',
            todo
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error updating todo',
            error: error.message
        });
    }
};

// Delete Todo
const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByIdAndDelete(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({
            message: 'Todo deleted successfully',
            todo
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error deleting todo',
            error: error.message
        });
    }
};

// Mark Todo as Done
const markTodoDone = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todo.completed = true;
        await todo.save();

        res.json({
            message: 'Todo marked as done',
            todo
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error marking todo as done',
            error: error.message
        });
    }
};

// Remove Mark Done (Mark as Undone)
const removeTodoMarkDone = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todo.completed = false;
        await todo.save();

        res.json({
            message: 'Todo marked as undone',
            todo
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error marking todo as undone',
            error: error.message
        });
    }
};

module.exports = {
    addTodo,
    getAllTodos,
    updateTodo,
    deleteTodo,
    markTodoDone,
    removeTodoMarkDone
};