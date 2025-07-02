const express = require('express');
const router = express.Router();
const Category = require('../../models/category');
const InventoryItem = require('../../models/inventoryItem');
const Supplier = require('../../models/supplier');

// GET all categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// GET all inventoryItems
router.get('/inventoryItems', async (req, res, next) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// GET all suppliers
router.get('/suppliers', async (req, res, next) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    next(err);
  }
});

module.exports = router;