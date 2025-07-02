const express = require('express');
const router = express.Router();
const InventoryItem = require('../../../models/inventoryItem');

router.post('/', async (req, res, next) => {
  try {
    const newItem = new InventoryItem(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    next(err);
  }
});

module.exports = router;