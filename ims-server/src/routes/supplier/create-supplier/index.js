const express = require('express');
const router = express.Router();
const Supplier = require('../../../models/supplier');

router.post('/', async (req, res, next) => {
  try {
    const newSupplier = new Supplier(req.body);
    await newSupplier.save();
    res.status(201).json(newSupplier);
  } catch (err) {
    next(err);
  }
});

module.exports = router;