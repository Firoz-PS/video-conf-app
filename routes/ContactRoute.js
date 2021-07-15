var express = require('express');
var router = express.Router();
const authJwt = require("../middlewares/authJwt");
const ContactController = require("../controllers/ContactController");

router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.get("/:id", [authJwt.verifyToken], ContactController.fetchContactInfo);
router.put("/addContact/:id", [authJwt.verifyToken], ContactController.addContact);
router.put("/addInvite/:id", [authJwt.verifyToken], ContactController.addInvite);
router.put("/removeContact/:id", [authJwt.verifyToken], ContactController.removeContact);
router.put("/removeInviteSent/:id", [authJwt.verifyToken], ContactController.removeInviteSent);
router.put("/removeInviteReceived/:id", [authJwt.verifyToken], ContactController.removeInviteReceived);

module.exports = router;  