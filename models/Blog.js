const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Career', 'Finance', 'Travel', 'Technology', 'Health', 'Other'],
  },
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Please add content'],
  },
  image: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure updatedAt is changed on update
BlogSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: Date.now() });
});

module.exports = mongoose.model('Blog', BlogSchema);