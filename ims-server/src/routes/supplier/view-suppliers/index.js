const express = require('express');
const router = express.Router();
const Supplier = require('../../../models/supplier');

router.get('/', async (req, res, next) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    next(err);
  }
});

// GET a single supplier by ID
router.get('/:id', async (req, res, next) => {
  try {
    const supplier = await Supplier.findOne({ _id: req.params.id });
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (err) {
    next(err);
  }
});

module.exports = router;