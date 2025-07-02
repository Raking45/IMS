const express = require('express');
const router = express.Router();
const Category = require('../../../models/category');

router.post('/', async (req, res, next) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
});

module.exports = router;