var express = require('express');
var router = express.Router();
const authJwt = require("../middlewares/authJwt");
const ChatController = require("../controllers/ChatController");

router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.post("/", [authJwt.verifyToken], ChatController.newChat)
router.get("/:id", [authJwt.verifyToken], ChatController.fetchChat);
router.put("/:id", [authJwt.verifyToken], ChatController.updateChat);
router.put("/delete/:id", [authJwt.verifyToken], ChatController.deleteChat);


module.exports = router;  