const express = require('express');
const router = express.Router();
const InventoryItem = require('../../../models/inventoryItem');

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await InventoryItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;