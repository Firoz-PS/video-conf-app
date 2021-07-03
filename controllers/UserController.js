const config = require("../config/authConfig");
const User = require("../models/UserModel");
const fs = require("fs");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// function to create a new user while signing up
const signup = (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNo:"",
    password: bcrypt.hashSync(req.body.password, 8),
    avatar: "",
    theme: "dark",
    color: "blue",
    accessToken:"",
    isDeleted: false,
    isOnline: true,
    contactInfos: [],
  });
  const token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400 // 24 hours
  });  
  user.accessToken = token;

  user.save()
    .then(
      res.status(200).send({
        message: "user registered successfully",
        accessToken: user.accessToken,
        user: [{
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNo: user.phoneNo,
          theme: user.theme,
          color: user.color,
          avatar: user.avatar,
          isOnline: user.isOnline
        }]
      }) 
    )
    .catch(err =>{
      res.status(500).send({message: "failed to register user"})
      console.log(err)
    })
 };

// function to signin a user 
const signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if(!user.isDeleted){
        const isPasswordValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!isPasswordValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
        else {
          const token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // 24 hours
          });  
          user.accessToken = token;
          user.isOnline = true; 
          user.save()
            .then(
              res.status(200).send({
                accessToken: user.accessToken,
                user: [{
                  id: user._id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  phoneNo: user.phoneNo,
                  avatar: user.avatar,
                  theme: user.theme,
                  color: user.color,
                  isOnline: user.isOnline
                }]
              })
            )
            .catch(err =>{
              res.status(500).send({message: "failed to save access token"})
              console.log(err)
            })
        }
      }
      else {
        res.status(404).send({ message: "User is deleted" });
      }
    })
    .catch(err => {
      res.status(404).send({ message: "User Not found." });
      console.log(err)
    })
}

// function to fetch details of a user using th id passed as a path param
const fetchUser = (req, res) =>{
  User.findById(req.params.id)
    .then(user => {
      if(!user.isDeleted){
        res.status(200).send({
          res,
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNo: user.phoneNo,
          avatar: user.avatar,
          isOnline: user.isOnline
        })    
      }
      else {
        res.status(404).send({ message: "User is deleted" });
      }       
    })
    .catch(err => {
      res.status(404).send({ message: "User Not found." });
      console.log(err)
    })
}

// function to fetch profile details
const fetchProfile = (req, res) =>{
  User.findById(req.userId)
    .then(user => {
      if(!user.isDeleted){
        res.status(200).send({
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNo: user.phoneNo,
            theme: user.theme,
            color: user.color,
            avatar: user.avatar,
            isOnline: user.isOnline
          }
        })
      }
      else {
        res.status(404).send({ message: "Profile is deleted" });
      }       
    })
    .catch(err => {
      res.status(404).send({ message: "Profile Not found." });
      console.log(err)
    })
}

// function to signout the user and to set the user offline 
const signout = (req, res) => {
  User.findById(req.userId)
    .then(user => {
      if(!user.isDeleted){
        user.isOnline = false;
        user.save()
          .then(
            res.status(200).send({
              message: "user signed out successfully",
              user: [{
                isOnline: user.isOnline
              }]
          })
          )
          .catch(err =>{
            res.status(500).send({message: "failed to signout"})
            console.log(err)
          })
      }
      else {
        res.status(404).send({ message: "User is deleted" }); 
      }     
    })
    .catch(err =>{
      res.status(404).send({ message: "User Not found." });
      console.log(err)
    })
}

// function to update the user based on the update field and id passed as path param
const updateUser = (req, res) => {
  const UPDATE_CASE = req.params.updatefield

// need to implement a check for whether the user is deleted

  switch(UPDATE_CASE) {
    case "THEME": 
      User.findById(req.params.id)
        .then(user => {
          user.theme = req.body.theme;
          user.color = req.body.color;
          user.save()
            .then(
              res.status(200).send({message: "user updated successfully"})
            )
            .catch(err =>{
              res.status(500).send({message: "failed to update user"})
              console.log(err)
            })
        })
        break;

    case "BASIC": 
      User.findById(req.params.id)
        .then(user => {
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName;
          user.phoneNo = req.body.phoneNo;
          user.avatar = req.body.avatar;
          user.save()
            .then(
              res.status(200).send({message: "user updated successfully"})
            )
            .catch(err =>{
              res.status(500).send({message: "failed to update user"})
              console.log(err)
            })
        })
        break;

    case "CONTACT": 
      User.findById(req.params.id)
        .then(user => {
          user.contactInfos.push({
            contactId: req.body.contactId,
            chatId: req.body.chatId,
            contactName: req.body.contactName,
            contactAvatar: req.body.contactAvatar,
            isContactOnline: req.body.isContactOnline ,
            lastChatTime: req.body.lastChatTime         
          })
          user.save()
            .then(
              res.status(200).send({message: "user contacts updated successfully"})
            )
            .catch(err =>{
              res.status(500).send({message: "failed to update user contacts"})
              console.log(err)
            })
        })
        break;    

    case "PASSWORD": 
      User.findById(req.params.id)
        .then(user => {
          const isPasswordValid = bcrypt.compareSync(
            req.body.oldPassword,
            user.password
          );
          if (!isPasswordValid) {
            res.status(401).send({ message: "Invalid Password! , failed to update password"});
          }
          else {
            user.password = req.body.newPassword;
            user.save()
            .then(
              res.status(200).send({message: "Password updated successfully"})
            )
            .catch(err =>{
              res.status(500).send({message: "failed to update password"})
              console.log(err)
            })
          }
        })
        break;

    default: 
        res.status(400).send({message: "invalid update field"})
        
  }
}

// function after uploading avatar
const updateAvatar = (req, res) => {
  const img = fs.readFileSync(req.file.path);
  const encode_img = img.toString('base64');
  User.findById(req.userId)
  .then(user => {
    user.avatar = {
      contentType: req.file.mimetype,
      image: new Buffer(encode_img,'base64')
    };
    user.save()
      .then(
        res.status(200).send({message: "Avatar uploaded successfully"})
        // console.log(result.img.Buffer)
        // res.contentType(final_img.contentType);
        // res.send(final_img.image);
      )
      .catch(err =>{
        res.status(500).send({message: "failed to upload avatar"})
        console.log(err)
      })
  })  
}

// function to delete the user
const deleteUser = (req, res) => {
  User.findById(req.body.id)
    .then(user => {
      if(!user.isDeleted){
        const isPasswordValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!isPasswordValid) {
          res.status(401).send({ message: "Invalid Password! , failed to delete user"});
        }
        user.isDeleted = true;
        user.save()
          .then(
            res.status(200).send({message: "user deleted successfully"})
          )
          .catch(err =>{
            res.status(500).send({message: "failed to delete user"})
            console.log(err)
          })
      }
      else{
        res.status(404).send({ message: "User is deleted" });
      }     
    })
    .catch(err =>{
      res.status(404).send({ message: "User Not found." });
      console.log(err)
    })
}

module.exports = {
  signup,
  signin,
  signout,
  fetchUser,
  fetchProfile,
  updateUser,
  updateAvatar,
  deleteUser
}