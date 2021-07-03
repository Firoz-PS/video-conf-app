const User = require("../models/UserModel");

// function to check whether the given email is exixting
const checkDuplicateEmail = (req, res, next) => {
    User.findOne({
        email: req.body.email
    })
    .exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (user) {
            if(user.isDeleted){
                res.status(400).send({ message: "User is deleted" });
                return;
            }
            else {
                res.status(400).send({ message: "Failed! Email is already in use!" });
                return;
            }
        }

        next();
    });
};

module.exports = {
  checkDuplicateEmail
};
