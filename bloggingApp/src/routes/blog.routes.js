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
   
      {
        $lookup: {
          from: "users",                // Collection to join (should be the name of your users collection)
          localField: "createdBy",       // Field in Blog collection
          foreignField: "_id",           // Field in User collection
          as: "createdBy",               // Name for the resulting array field
        },
      },
     
      {
        $unwind: "$createdBy",
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          body: { $first: "$body" },
          createdBy: { $first: "$createdBy" },
          coverImageURL: { $first: "$coverImageURL" },
        },
      },
    ]);
    console.log(blogs);
    
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
