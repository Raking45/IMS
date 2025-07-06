const express = require('express');
const router = express.Router();
const InventoryItem = require('../../../models/inventoryItem');

router.post('/', async (req, res, next) => {
  try {
    const { _id, name, description, quantity, price, categoryId, supplierId } = req.body;

    if (!_id || !name || typeof quantity !== 'number' || typeof price !== 'number' || !categoryId || !supplierId) {
      return res.status(400).json({ message: 'Invalid input. Missing or malformed fields.' });
    }

    const item = new InventoryItem({
      _id,
      name,
      description,
      quantity,
      price,
      categoryId,
      supplierId
    });

    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: 'Duplicate name. Name must be unique.' });
    } else {
      next(err);
    }
  }
});

module.exports = router;
