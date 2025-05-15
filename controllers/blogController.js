const Blog = require('../models/Blog');
const User = require('../models/User');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Private
exports.getBlogs = async (req, res, next) => {
  try {
    const { category, author } = req.query;
    const filter = {};

    if (category) filter.category = category;

    if (author) {
      filter.author = { $regex: author, $options: 'i' };
    }

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Private
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private
exports.createBlog = async (req, res, next) => {
  try {
    // Add user id to request body
    req.body.userId = req.user.id;

    // Add author name from user
    const user = await User.findById(req.user.id);
    req.body.author = user.name;

    const blog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private
exports.updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Make sure user is blog owner
    if (blog.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to update this blog',
      });
    }

    // Update blog
    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Make sure user is blog owner
    if (blog.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to delete this blog',
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user blogs
// @route   GET /api/blogs/my-blogs
// @access  Private
exports.getUserBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};