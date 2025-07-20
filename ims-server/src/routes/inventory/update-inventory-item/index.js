/**
 * Title: Update Inventory Item
 * Author: Caleb Goforth
 * Date: 7/8/2025
 * Description: API route to update an inventory item by ID
 */

const express = require('express');
const router = express.Router();
const InventoryItem = require('../../../models/inventoryItem');


router.put('/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedItem = await InventoryItem.findByIdAndUpdate(itemId, req.body, { new: true });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;

