const express = require('express');
const router = express.Router();
const InventoryItem = require('../../models/inventoryItem');
const Category = require('../../models/category');
const Supplier = require('../../models/supplier');

router.get('/', async (req, res, next) => {
  const query = (req.query.q || '').toLowerCase();

  try {
    const [inventoryItems, categories, suppliers] = await Promise.all([
      InventoryItem.find({ name: { $regex: query, $options: 'i' } }),
      Category.find({ categoryName: { $regex: query, $options: 'i' } }),
      Supplier.find({ supplierName: { $regex: query, $options: 'i' } })
    ]);

    const results = [
      ...inventoryItems.map(item => ({
        type: 'inventory',
        invId: item._id,
        name: item.name,
        display: `${item._id} - ${item.name}`
      })),
      ...categories.map(cat => ({
        type: 'category',
        categoryId: cat._id,
        name: cat.categoryName,
        display: `${cat._id} - ${cat.categoryName}`
      })),
      ...suppliers.map(supplier => ({
        type: 'supplier',
        supplierId: supplier._id,
        name: supplier.supplierName,
        display: `${supplier._id} - ${supplier.supplierName}`
      }))
    ];

    res.json(results);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
