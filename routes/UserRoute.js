var express = require('express');
var router = express.Router();
const authJwt = require("../middlewares/authJwt");
const validator = require("../middlewares/validator")
const UserController = require("../controllers/UserController");

router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.post('/signin', UserController.signin);
router.get('/details/:id', UserController.fetchUser)
router.put('/search',[authJwt.verifyToken], UserController.searchUser)
router.post('/signup', [validator.checkDuplicateEmail], UserController.signup);
router.put('/signout', [authJwt.verifyToken], UserController.signout);
router.get("/profile", [authJwt.verifyToken], UserController.fetchProfile);
router.put("/update/:updatefield", [authJwt.verifyToken], UserController.updateUser);
router.put("/delete", [authJwt.verifyToken], UserController.deleteUser);

module.exports = router;