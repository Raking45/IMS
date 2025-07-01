const express = require('express');
const router = express.Router();
const Supplier = require('../../../models/supplier');

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Supplier.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json({ message: 'Supplier deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;