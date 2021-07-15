const config = require("../config/authConfig");
const User = require("../models/UserModel");
const fs = require("fs");
const {initContact, isUserAContact} = require("./Contactcontroller")

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

//function to fetch the contactInfosId of a user with the user Id passed as argument
const getContactInfosId = async (userId) => {
  const user = await User.findById(userId)

  if (user) {
    return user.contactInfosId
  } else {
    console.log("user not found");
    return;
  }
};

// function to search for a contact
const searchUser = async (req, res) => {
  const searchResult=[]
  var isContact = false
  User.findOne({ 
    email: req.body.searchValue
  })
    .then(async (user) => {
       isContact = await isUserAContact(req.body.contactInfosId, user._id)
          searchResult.push({
            userId: user._id,
            userName: `${user.firstName} ${user.lastName}`,
            avatar: user.avatar,
            isUserAContact: isContact
          })
          res.status(200).send({
            searchResult
          }) 
        })
        .catch(err => {
          res.status(404).send({ message: "User Not found." });
          console.log(err)
        })
      }

// function to create a new user while signing up
const signup = async(req, res) => {
  const contactInfosId = await initContact()
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phoneNo: "",
    organization: "",
    dateOfBirth: "",
    password: bcrypt.hashSync(req.body.password, 8),
    avatar: "",
    theme: "dark",
    color: "blue",
    accessToken:"",
    isDeleted: false,
    isOnline: true,
    contactInfosId: contactInfosId,
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
          organization: user.organization,
          dateOfBirth: user.dateOfBirth,
          theme: user.theme,
          color: user.color,
          avatar: user.avatar,
          isOnline: user.isOnline,
          contactInfosId: user.contactInfosId
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
                  organization: user.organization,
                  dateOfBirth: user.dateOfBirth,
                  avatar: user.avatar,
                  theme: user.theme,
                  color: user.color,
                  isOnline: user.isOnline,
                  contactInfosId: user.contactInfosId
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

// function to fetch details of a user using the id passed as a path param
const fetchUser = (req, res) =>{
  User.findById(req.params.id)
    .then(user => {
      if(!user.isDeleted){
        res.status(200).send({
          message: "user found successfully",
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNo: user.phoneNo,
            organization: user.organization,
            dateOfBirth: user.dateOfBirth,
            avatar: user.avatar,
            isOnline: user.isOnline,
          }
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
          organization: user.organization,
          dateOfBirth: user.dateOfBirth,
          avatar: user.avatar,
          isOnline: user.isOnline,
          contactInfosId: user.contactInfosId
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

  switch(UPDATE_CASE) {

    case "BASIC": 
      User.findById(req.userId)
        .then(user => {
          user.firstName = req.body.firstName;
          user.lastName = req.body.lastName;
          user.phoneNo = req.body.phoneNo;
          user.organization = req.body.organization;
          user.dateOfBirth = req.body.dateOfBirth;
          user.save()
            .then(
              res.status(200).send({
                message: "user updated successfully",
                user
              })
            )
            .catch(err =>{
              res.status(500).send({message: "failed to update user"})
              console.log(err)
            })
        })
        break;  

    case "PASSWORD": 
      User.findById(req.userId)
        .then(user => {
          const isPasswordValid = bcrypt.compareSync(
            req.body.oldPassword,
            user.password
          );
          if (!isPasswordValid) {
            res.status(401).send({ message: "Invalid Password! , failed to update password"});
          }
          else {
            user.password = bcrypt.hashSync(req.body.newPassword, 8);
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

// function to delete the user
const deleteUser = (req, res) => {
  User.findById(req.userId)
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
  getContactInfosId,
  searchUser,
  signup,
  signin,
  signout,
  fetchUser,
  fetchProfile,
  updateUser,
  deleteUser
}