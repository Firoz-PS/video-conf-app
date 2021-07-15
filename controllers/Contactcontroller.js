const Contact = require("../models/ContactModel");
const { initChat } = require("./Chatcontroller");
const { getContactInfosId } = require("./UserController");

//function to create a new contact record for user once the user is created
const initContact = async () => {
  const contact = new Contact({
    contacts: [],
    invitesSent: [],
    invitesReceived: [],
  });
  await contact.save();
  if (contact.id) {
    return contact.id;
  } else {
    console.log("some error happened");
    return;
  }
};

// function to check whether the given user is included in the contact
const isUserAContact = async (contactInfosId, userId) => {
  const contact = await Contact.findById(contactInfosId);
  const existingContact = [];
  contact.contacts.map((item) => {
    if (item.userId == userId) {
      existingContact.push(item);
    }
  });
  if (existingContact[0]) {
    return true;
  } else {
    return false;
  }
};

// function to fetch all the contact details of a user
const fetchContactInfo = (req, res) => {
  Contact.findById(req.params.id)
    .then((contact) => {
      res.status(200).send({
        message: "Contact details fetched Successfully",
        contact: contact,
      });
    })
    .catch((err) => {
      res.status(404).send({ message: "Contact List not found" });
      console.log(err);
    });
};

// function to add a contact
const addContact = async (req, res) => {
  const chatContentId = await initChat();
  const contactInfosId = await getContactInfosId(req.body.userId);
  Contact.findById(req.params.id)
    .then(async (myContact) => {
      const newContact = {
        userId: req.body.userId,
        chatId: chatContentId,
        userName: req.body.userName,
        userAvatar: req.body.avatar,
        lastChatTime: "",
      };
      if (req.body.type == "fromInvites") {
        myContact.contacts.push(newContact);
        myContact.invitesReceived.splice(
          myContact.invitesReceived.findIndex(
            (item) => item.userId === req.body.userId
          ),
          1
        );
      }
      else if (req.body.type == "fromCall") {
        isContact = await isUserAContact(req.params.id, req.body.userId)
        if(!isContact){
          myContact.contacts.push(newContact);
        } 
      }
      myContact
        .save()
        .then(
          Contact.findById(contactInfosId)
            .then(async (theirContact) => {
              const newContact = {
                userId: req.userId,
                chatId: chatContentId,
                userName: req.body.myName,
                userAvatar: req.body.myAvatar,
                lastChatTime: "",
              };
              if (req.body.type == "fromInvites") {
                theirContact.contacts.push(newContact);
                theirContact.invitesSent.splice(
                  theirContact.invitesSent.findIndex(
                    (item) => item.userId === req.userId
                  ),
                  1
                );
              }
              else if (req.body.type == "fromCall") {
                isContact = await isUserAContact(contactInfosId, req.userId)
                if(!isContact){
                  theirContact.contacts.push(newContact);
                } 
              }
              theirContact
                .save()
                .then(
                  res.status(200).send({
                    message: "Contact added Successfully",
                    contacts: myContact.contacts,
                    invitesReceived: myContact.invitesReceived,
                  })
                )
                .catch((err) => {
                  res.status(500).send({
                    message: "failed to add the contact to the other user",
                  });
                  console.log(err);
                });
            })
            .catch((err) => {
              res.status(500).send({ message: "failed to add the contact" });
              console.log(err);
            })
        )
        .catch((err) => {
          res
            .status(404)
            .send({ message: "Contact List of other user not found" });
          console.log(err);
        });
    })
    .catch((err) => {
      res.status(404).send({ message: "Contact List not found" });
      console.log(err);
    });
};

// function to add invites
const addInvite = async (req, res) => {
  const contactInfosId = await getContactInfosId(req.body.userId);
  Contact.findById(req.params.id)
    .then((myContact) => {
      const newInvite = {
        userId: req.body.userId,
        userName: req.body.userName,
        userAvatar: req.body.avatar,
      };
      myContact.invitesSent.push(newInvite);
      myContact
        .save()
        .then(
          Contact.findById(contactInfosId)
            .then((theirContact) => {
              const newInvite = {
                userId: req.userId,
                userName: req.body.myName,
                userAvatar: req.body.myAvatar,
              };
              theirContact.invitesReceived.push(newInvite);
              theirContact
                .save()
                .then(
                  res.status(200).send({
                    message: "Invite added Successfully",
                    invitesSent: myContact.invitesSent,
                  })
                )
                .catch((err) => {
                  res.status(500).send({
                    message: "failed to add invite to the other user",
                  });
                  console.log(err);
                });
            })
            .catch((err) => {
              res.status(500).send({ message: "failed to add invite" });
              console.log(err);
            })
        )
        .catch((err) => {
          res
            .status(404)
            .send({ message: "Contact List of other user not found" });
          console.log(err);
        });
    })
    .catch((err) => {
      res.status(404).send({ message: "Contact List not found" });
      console.log(err);
    });
};

// function to remove a contact
const removeContact = async (req, res) => {
  const contactInfosId = await getContactInfosId(req.body.userId);
  Contact.findById(req.params.id)
    .then((myContact) => {
      const initialMyContactLength = myContact.contacts.length;
      myContact.contacts.splice(
        myContact.contacts.findIndex(
          (person) => person.userId === req.body.userId
        ),
        1
      );
      if (myContact.contacts.length != initialMyContactLength) {
        myContact
          .save()
          .then(
            Contact.findById(contactInfosId)
              .then((theirContact) => {
                const initialTheirContactLength = theirContact.contacts.length;
                theirContact.contacts.splice(
                  theirContact.contacts.findIndex(
                    (person) => person.userId === req.body.userId
                  ),
                  1
                );
                if (theirContact.contacts.length != initialTheirContactLength) {
                  theirContact
                    .save()
                    .then(() => {
                      res.status(200).send({
                        message: "Successfully removed the Invite Sent",
                        contacts: myContact.contacts,
                      });
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message:
                          "failed to save the removed contacts List of other user",
                      });
                      console.log(err);
                    });
                } else {
                  res.status(500).send({
                    message:
                      "Person is not removed from the contacts List of other user",
                  });
                  console.log(err);
                }
              })
              .catch((err) => {
                res
                  .status(404)
                  .send({ message: "Contact List of other user not found" });
                console.log(err);
              })
          )
          .catch((err) => {
            res.status(500).send({
              message: "failed to save the removed contacts List",
            });
            console.log(err);
          });
      } else {
        res.status(500).send({
          message: "Person is not removed from the contacts list",
        });
        console.log(err);
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "Contact List not found" });
      console.log(err);
    });
};

// function to remove an invite sent
const removeInviteSent = async (req, res) => {
  const contactInfosId = await getContactInfosId(req.body.userId);
  Contact.findById(req.params.id)
    .then((myContact) => {
      const initialMyContactLength = myContact.invitesSent.length;
      myContact.invitesSent.splice(
        myContact.invitesSent.findIndex(
          (person) => person.userId === req.body.userId
        ),
        1
      );
      if (myContact.invitesSent.length != initialMyContactLength) {
        myContact
          .save()
          .then(
            Contact.findById(contactInfosId)
              .then((theirContact) => {
                const initialTheirContactLength =
                  theirContact.invitesReceived.length;
                theirContact.invitesReceived.splice(
                  theirContact.invitesReceived.findIndex(
                    (person) => person.userId === req.body.userId
                  ),
                  1
                );
                if (
                  theirContact.invitesReceived.length !=
                  initialTheirContactLength
                ) {
                  theirContact
                    .save()
                    .then(() => {
                      res.status(200).send({
                        message: "Successfully removed the Invite Sent",
                        invitesSent: myContact.invitesSent,
                      });
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message:
                          "failed to save the removed invitesReceived List",
                      });
                      console.log(err);
                    });
                } else {
                  res.status(500).send({
                    message:
                      "Person is not removed from the invitesReceived list",
                  });
                  console.log(err);
                }
              })
              .catch((err) => {
                res
                  .status(404)
                  .send({ message: "Contact List of other user not found" });
                console.log(err);
              })
          )
          .catch((err) => {
            res.status(500).send({
              message: "failed to save the removed invitesSent List",
            });
            console.log(err);
          });
      } else {
        res.status(500).send({
          message: "Person is not removed from the invitesSent list",
        });
        console.log(err);
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "Contact List not found" });
      console.log(err);
    });
};

// function to remove an invite received
const removeInviteReceived = async (req, res) => {
  const contactInfosId = await getContactInfosId(req.body.userId);
  Contact.findById(req.params.id)
    .then((myContact) => {
      const initialMyContactLength = myContact.invitesReceived.length;
      myContact.invitesReceived.splice(
        myContact.invitesReceived.findIndex(
          (person) => person.userId === req.body.userId
        ),
        1
      );
      if (myContact.invitesReceived.length != initialMyContactLength) {
        myContact
          .save()
          .then(
            Contact.findById(contactInfosId)
              .then((theirContact) => {
                const initialTheirContactLength =
                  theirContact.invitesSent.length;
                theirContact.invitesSent.splice(
                  theirContact.invitesSent.findIndex(
                    (person) => person.userId === req.body.userId
                  ),
                  1
                );
                if (
                  theirContact.invitesSent.length != initialTheirContactLength
                ) {
                  theirContact
                    .save()
                    .then(() => {
                      res.status(200).send({
                        message: "Successfully removed the Invite Received",
                        invitesReceived: myContact.invitesReceived,
                      });
                    })
                    .catch((err) => {
                      res.status(500).send({
                        message: "failed to save the removed invitesSent List",
                      });
                      console.log(err);
                    });
                } else {
                  res.status(500).send({
                    message: "Person is not removed from the invitesSent list",
                  });
                  console.log(err);
                }
              })
              .catch((err) => {
                res
                  .status(404)
                  .send({ message: "Contact List of other user not found" });
                console.log(err);
              })
          )
          .catch((err) => {
            res.status(500).send({
              message: "failed to save the removed invitesReceived List",
            });
            console.log(err);
          });
      } else {
        res.status(500).send({
          message: "Person is not removed from the invitesReceived list",
        });
        console.log(err);
      }
    })
    .catch((err) => {
      res.status(404).send({ message: "Contact List not found" });
      console.log(err);
    });
};

module.exports = {
  initContact,
  isUserAContact,
  fetchContactInfo,
  addContact,
  removeContact,
  removeInviteSent,
  removeInviteReceived,
  addInvite,
};
