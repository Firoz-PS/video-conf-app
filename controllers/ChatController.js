const Chat = require("../models/ChatModel");
const moment = require("moment");

//function to create a new Chat record for a contact once the contact is added
const initChat = async () => {
  const chat = new Chat({
    chatContent: [],
  });
  await chat.save();

  if (chat.id) {
    return chat.id;
  } else {
    console.log("some error happened");
    return;
  }
};

// function to fetch all the chat details of a user
const fetchChat = (req, res) => {
  Chat.findById(req.params.id)
    .then((chat) => {
      res.status(200).send({
        message: "Chat details fetched Successfully",
        chat: chat,
      });
    })
    .catch((err) => {
      res.status(404).send({ message: "Chat details not found" });
      console.log(err);
    });
};

// function to update a chat
const updateChat = async (req, res) => {
  Chat.findById(req.params.id)
    .then((chat) => {
      const newChat = {
        userId: req.userId,
        userName: req.body.myName,
        text: req.body.text,
        time: moment().unix(),
      };
      chat.chatContent.push(newChat);
      chat
        .save()
        .then(
          res.status(200).send({
            message: "chat added successfully",
            chat: chat,
          })
        )
        .catch((err) => {
          res.status(500).send({ message: "failed to add chat" });
          console.log(err);
        });
    })
    .catch((err) => {
      res.status(404).send({ message: "Chat details not found" });
      console.log(err);
    });
};

module.exports = {
  initChat,
  fetchChat,
  updateChat,
};
