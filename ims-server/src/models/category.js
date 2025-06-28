const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryId: { type: String, required: true },
  categoryName: { type: String, required: true, unique: true },
  description: String,
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now }
});

categorySchema.pre('save', function (next) {
  this.dateModified = new Date();
  next();
});

module.exports = mongoose.model('Category', categorySchema);