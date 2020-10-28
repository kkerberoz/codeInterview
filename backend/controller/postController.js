const Post = require("../models/Post");
const ResHelper = require("../helpers/ResHelper");
const { find } = require("../models/Post");

module.exports = {
  getAll: (req, res) => {
    let option = parseInt(req.query.p);
    if (option && option != null) {
      if (option == 1) {
        Post.find({ published: { $in: ["true", true] } })
          .sort({ createdAt: -1 })
          .limit(10)
          .skip(option)
          .then((posts) =>
            ResHelper.success(res, { post: posts, count: posts.length })
          )
          .catch((err) => ResHelper.error(res, err));
      } else if (option == 2) {
        Post.find({ published: { $in: ["true", true] } })
          .sort({ createdAt: -1 })
          .skip(10)
          .then((posts) =>
            ResHelper.success(res, { post: posts, count: posts.length })
          )
          .catch((err) => ResHelper.error(res, err));
      } else {
        Post.find({ published: { $in: ["true", true] } })
          .sort({ createdAt: -1 })
          .limit(10)
          .skip(option)
          .then((posts) =>
            ResHelper.success(res, { post: posts, count: posts.length })
          )
          .catch((err) => ResHelper.error(res, err));
      }
    } else if (!option) {
      Post.find({ published: { $in: ["true", true] } })
        .sort({ createdAt: -1 })
        .limit(10)
        .then((posts) =>
          ResHelper.success(res, { post: posts, count: posts.length })
        )
        .catch((err) => ResHelper.error(res, err));
    } else {
      return ResHelper.fail(res, "offset value not found");
    }
  },
  createPost: (req, res) => {
    const { title, content } = req.body;

    if (!title) {
      return ResHelper.fail(res, "Title is required");
    }
    if (!content) {
      return ResHelper.fail(res, "Content is required");
    }

    Post.findOne({ title: title }, (err, post) => {
      if (post) {
        return ResHelper.fail(res, "This title already exists");
      } else {
        const newPost = Post({
          title: title,
          content: content,
          author: req.user._id,
        });
        newPost.save((err, doc) => {
          if (err) {
            return ResHelper.error(res, err);
          } else {
            ResHelper.success(res, {
              message: "Post have been created!",
              doc,
            });
          }
        });
      }
    });
  },
  publishPost: (req, res) => {
    const postID = req.params.id;
    if (!postID) {
      return ResHelper.fail(res, "Post ID is required");
    } else {
      Post.findByIdAndUpdate(
        { _id: postID },
        { $set: { published: true } },
        (err, doc) => {
          if (err) {
            return ResHelper.error(res, err);
          }
          if (!doc) {
            return ResHelper.fail(res, "Post is not exist");
          } else {
            ResHelper.success(res, {
              message: "Post have been Published!",
            });
          }
        }
      );
    }
  },
};
