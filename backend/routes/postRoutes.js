const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");

//Controllers
const PostController = require("../controller/postController");

//Routes
router.get("/posts", PostController.getAll);
router.post("/post", auth, PostController.createPost);
router.get("/post/:id/publish", auth, PostController.publishPost);
module.exports = router;
