const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Users = require('../models/user.models')
const Blog = require('../models/blog.models');
const Comment = require('../models/comment.models');

const router = Router();
console.log(
 { __dirname}
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname,`../public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

// router.get("/:id", async (req, res) => {
//   console.log(req.params.id);
  
//   const blog = await Blog.findById(req.params.id)
//   const comments = await Comment.find({ blogId: req.params.id }).populate(
//     "createdBy"
//   );});

router.get("/:id", async (req, res) => {
  console.log(req.params.id);
  const searchTerm = req.params.id;
  
    console.log(typeof searchTerm);
    

  try {
    const blogs = await Blog.aggregate([
      // Stage 1: Search for blogs that match the search term in the title or body
      {
        $match: {
          $or: [
            { title: { $regex: searchTerm, $options: "i" } },  // Case-insensitive search in title
            { body: { $regex: searchTerm, $options: "i" } },   // Case-insensitive search in body
          ],
        },
      },
      // Stage 2: Lookup the user who created the blog (populate 'createdBy')
      {
        $lookup: {
          from: "users",                // Collection to join (should be the name of your users collection)
          localField: "createdBy",       // Field in Blog collection
          foreignField: "_id",           // Field in User collection
          as: "createdBy",               // Name for the resulting array field
        },
      },
      // Stage 3: Unwind the 'createdBy' array to turn it into an object
      {
        $unwind: "$createdBy",
      },
      // Stage 4: Lookup the comments related to the blog
      {
        $lookup: {
          from: "comments",              // Collection to join (should be the name of your comments collection)
          localField: "_id",             // Blog ID
          foreignField: "blogId",        // Field in Comment collection that matches Blog ID
          as: "comments",                // Name for the resulting comments field
        },
      },
      // Stage 5: Unwind the comments array to work with individual comments
      {
        $unwind: { path: "$comments", preserveNullAndEmptyArrays: true },
      },
      // Stage 6: Lookup the user who created the comment (populate 'createdBy' in comments)
      {
        $lookup: {
          from: "users",
          localField: "comments.createdBy",
          foreignField: "_id",
          as: "comments.createdBy",
        },
      },
      // Stage 7: Unwind the 'createdBy' in comments (if there are comments)
      {
        $unwind: { path: "$comments.createdBy", preserveNullAndEmptyArrays: true },
      },
      // Stage 8: Group back the comments so that each blog has an array of comments again
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          body: { $first: "$body" },
          createdBy: { $first: "$createdBy" },
          comments: { $push: "$comments" },
          coverImageURL: { $first: "$coverImageURL" },
        },
      },
    ]);

    return res.render("blog", {
      user: req.user,
      blogs,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server Error");
  }
});

  // return res.render("blog", {
  //   user: req.user,
  //   blog,
  //   comments,
  // });


router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageURL: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
