const express = require('express');
const router = express.Router();
const Category = require('../../../models/category');

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;