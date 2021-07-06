var express = require('express');
var router = express.Router();
const authJwt = require("../middlewares/authJwt");
const CallController = require("../controllers/CallController");

router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.post("/start", [authJwt.verifyToken], CallController.newCall);
router.put("/join/:id", [authJwt.verifyToken], CallController.joinCall);
router.get("/answer/:id", [authJwt.verifyToken], CallController.acceptJoinRequest);
router.put("/reject/:id", [authJwt.verifyToken], CallController.rejectJoinRequest);
router.put("/leave/:id", [authJwt.verifyToken], CallController.leaveCall);
router.put("/end/:id", [authJwt.verifyToken], CallController.endCall);
router.get("/", [authJwt.verifyToken], CallController.getAllCallDetails);


module.exports = router;  