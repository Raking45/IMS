const express = require('express');
const router = express.Router();
const Supplier = require('../../../models/supplier');

router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;