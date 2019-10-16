const express = require("express");
const Validator = require("validator");
const cloudinary = require("cloudinary");
const multer = require("multer");
const cloudinaryStorage = require("multer-storage-cloudinary");
require("dotenv").config();

const Post = require("../models/Post");
const Comment = require("../models/Comment");

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "posts",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }]
});

const parser = multer({ storage: storage }).single("image");

router.get("/posts", (req, res) => {
  Post.find({})
    .then(post => {
      if (post.length < 1) {
        res.status(404).send({ message: "Post not found" });
      }

      res.status(201).send({ data: post });
    })
    .catch(error => {
      res.status(500).send("Error" + error);
    });
});

//Fixed error here
router.post("/post/add", parser, (req, res) => {
  const errors = [];
  const { title, author, post } = req.body;
  if (Validator.isEmpty(title)) {
    errors.push({ message: "title field is required" });
  }
  if (Validator.isEmpty(author)) {
    errors.push({ message: "author field is required" });
  }
  if (Validator.isEmpty(post)) {
    errors.push({ message: "post field is required" });
  }

  if (errors.length > 0) {
    res.send(errors);
  } else {
    Post.create({
      title,
      author,
      post
    })
      .then(post => {
        if (!post) {
          res.status(400).send({ message: "Error creating post" });
        }

        res.status(200).send({ success: true, data: post });
      })
      .catch(error => {
        res.status(500).send("Error" + error);
      });
  }
});

router.get("/post/:id", (req, res, next) => {
  Post.findById({ _id: req.params.id })
    .populate({ path: "comments", model: Comment })
    .exec((err, post) => {
      if (err) return res.status(404).send(err);

      res.status(201).send(post);
    });
});

router.post("/post/:id/comment", (req, res) => {
  Post.findOne({ _id: req.params.id }).then(post => {
    let comment = new Comment({
      comment: req.body.comment
    });
    post.comments.push(comment);
    comment.save(error => {
      if (error) return res.send(error);
    });
    post.save((error, post) => {
      if (error) return res.send(error);
      res.status(200).send(post);
    });
  });
});

module.exports = router;
