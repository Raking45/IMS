const express = require('express');
const router = express.Router();
const InventoryItem = require('../../../models/inventoryItem');

router.put('/:id', async (req, res, next) => {
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    next(err);
  }
});

module.exports = router;