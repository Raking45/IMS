const express = require('express');
const router = express.Router();
const Category = require('../../../models/category');

router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;