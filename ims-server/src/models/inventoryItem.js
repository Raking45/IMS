const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  description: String,
  quantity: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  categoryId: { type: String, ref: 'Category', required: true },
  supplierId: { type: String, ref: 'Supplier', required: true },
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now }
}, {
  collection: 'inventoryItems'
});

inventoryItemSchema.pre('save', function (next) {
  this.dateModified = new Date();
  next();
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);