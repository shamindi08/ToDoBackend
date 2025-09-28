const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    completed: {type: Boolean, default: false},
    isUrgent: {type: Boolean, default: false},
    userId: {type: String, required: true}
})

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;