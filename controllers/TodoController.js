const Todo = require("../models/TodoModel");

const newTodo = (req, res) =>{}

const fetchTodo = (req, res) =>{
    Todo.findById(req.params.id)
}

const updateTodo = (req, res) =>{
    Todo.findById(req.params.id)
}

const deleteTodo = (req, res) =>{
    Todo.findById(req.params.id)
}

module.exports = {
    newTodo,
    fetchTodo,
    updateTodo,
    deleteTodo    
}