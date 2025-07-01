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

module.exports = router;