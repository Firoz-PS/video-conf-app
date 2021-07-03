var express = require('express');
var router = express.Router();
const authJwt = require("../middlewares/authJwt");
const TodoController = require("../controllers/TodoController");

router.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

router.post("/", [authJwt.verifyToken], TodoController.newTodo)
router.get("/:id", [authJwt.verifyToken], TodoController.fetchTodo);
router.put("/:id", [authJwt.verifyToken], TodoController.updateTodo);
router.put("/delete/:id", [authJwt.verifyToken], TodoController.deleteTodo);


module.exports = router;  