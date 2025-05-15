const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/').get(getBlogs).post(createBlog);
router.route('/my-blogs').get(getUserBlogs);
router.route('/:id').get(getBlog).put(updateBlog).delete(deleteBlog);

module.exports = router;