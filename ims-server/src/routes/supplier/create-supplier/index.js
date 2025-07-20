const express = require('express');
const router = express.Router();
const Supplier = require('../../../models/supplier');

router.post('/', async (req, res, next) => {
  console.log('REQ BODY:', req.body); // <--- Debug payload
  try {
    const newSupplier = new Supplier(req.body);
    await newSupplier.save();
    res.status(201).json(newSupplier);
  } catch (err) {
    console.error('Error saving supplier:', err); // <--- Important
    next(err);
  }
});



module.exports = router;