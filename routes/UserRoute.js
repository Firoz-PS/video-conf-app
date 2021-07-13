var express = require('express');
var router = express.Router();
const authJwt = require("../middlewares/authJwt");
const validator = require("../middlewares/validator")
const UserController = require("../controllers/UserController");
//const multer = require("../middlewares/multer")
const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, "public/images");
	},
	filename: (req, file, cb) => {
	  cb(null, file.fieldname + '-' + Date.now());
	},
});
const upload = multer({ storage: storage });

router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.post('/signin', UserController.signin); //used
router.get('/details/:id', UserController.fetchUser) //used
router.put('/search',[authJwt.verifyToken], UserController.searchUser) //used
router.post('/signup', [validator.checkDuplicateEmail], UserController.signup); //used
router.put('/signout', [authJwt.verifyToken], UserController.signout); //used
router.get("/profile", [authJwt.verifyToken], UserController.fetchProfile); //used
router.post("/update-avatar", [authJwt.verifyToken, upload.single("file")], UserController.updateAvatar)
router.put("/update/:updatefield", [authJwt.verifyToken], UserController.updateUser); //partially used
router.put("/delete", [authJwt.verifyToken], UserController.deleteUser);

module.exports = router;