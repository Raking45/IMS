const express = require('express');
const router = express.Router();
const Category = require('../../../models/category');

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

module.exports = router;