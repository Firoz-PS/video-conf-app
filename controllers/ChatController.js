const Chat = require("../models/ChatModel");

const newChat = (req, res) =>{}

const fetchChat = (req, res) =>{
    Chat.findById(req.params.id)
}

const updateChat = (req, res) =>{
    Chat.findById(req.params.id)
}

const deleteChat = (req, res) =>{
    Chat.findById(req.params.id)
}

module.exports = {
    newChat,
    fetchChat,
    updateChat,
    deleteChat    
}