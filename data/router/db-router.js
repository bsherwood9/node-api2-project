const express = require("express");
const db = require("../db.js");

const router = express.Router();
//3 gets
//get /posts
router.get("/posts", (req, res) => {
  db.find()
    .then(user => {
      res.status(200).json({ user });
    })
    .catch(err => {
      res.status(500).json({
        error: "The posts information could not be retrieved."
      });
    });
});
//get posts/id
router.get("/posts/:id", (req, res) => {
  db.findById(req.params.id)
    .then(item => {
      if (item) {
        res.status(200).json({ item });
      } else {
        res.status(404).json({
          error: "The post with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The post could not be found by that id"
      });
    });
});
//get posts/id/comments
router.get("/posts/:id/comments", (req, res) => {
  db.findPostComments(req.params.id)
    .then(item => {
      if (item) {
        res.status(200).json({ item });
      } else {
        res.status(404).json({
          error: "The post with the specified ID does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The comments information could not be retrieved."
      });
    });
});

//get posts/id/comments/:id
router.get("/posts/:post_id/comments/:commentId", (req, res) => {
  db.findCommentById(req.params.commentId)
    .then(item => {
      if (item) {
        res.status(200).json({ item });
      } else {
        res.status(404).json({
          error:
            "The post with the specified ID does not have a comment with that id does not exist."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "The comments information could not be retrieved."
      });
    });
});

//posts
//api/posts post -> messed up
router.post("/posts", (req, res) => {
  const userData = req.body;
  console.log("userdata", userData);
  db.insert(userData)
    .then(item => {
      if (userData.title && userData.contents) {
        res.status(201).json({ item });
      } else {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the post to the database."
      });
    });
});
//api/posts/id/comment
router.post("/posts/:id/comments", (req, res) => {
  let userData = req.body;
  userData.post_id = req.params.id;
  db.insertComment(userData)
    .then(item => {
      if (item) {
        res.status(201).json({
          userData
        });
      } else if (!userData.text) {
        res
          .status(400)
          .json({ errorMessage: "Please provide text for the comment." });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the comment to the database"
      });
    });
});

//1 delete
//delete api/posts
router.delete("/posts/:id", (req, res) => {
  const id = req.params.id;
  db.remove(id)
    .then(item => {
      if (item) {
        res.status(200).json({ message: `You deleted post ${id}` });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err =>
      res.status(500).json({ error: "The post could not be removed" })
    );
});

//1 put
//put /api/posts/requests
router.put("/posts/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  db.update(id, data)
    .then(item => {
      if (item && data.title && data.contents) {
        res.status(200).json({ item });
      } else if (!data.title || !data.contents) {
        res.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err =>
      res.status(500).json({ error: "The post could not be modified" })
    );
});
module.exports = router;
