const express = require('express');
const router = express.Router();
const InventoryItem = require('../../../models/inventoryItem');

// GET all inventoryItems
router.get('/', async (req, res, next) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET a single inventory item by ID
router.get('/:id', async (req, res, next) => {
  try {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;