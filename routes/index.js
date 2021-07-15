var express = require('express');
var router = express.Router();

router.get("/ping", function (req, res) {
    return res.status(200).send("pong");
});

router.use('/user', require('./UserRoute'));
router.use('/call', require('./CallRoute'));
router.use('/chat', require('./ChatRoute'));
router.use('/contacts', require('./ContactRoute'));

module.exports = router;