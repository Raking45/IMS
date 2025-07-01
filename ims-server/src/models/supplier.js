const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  supplierId: { type: String, required: true },
  supplierName: { type: String, required: true, unique: true },
  contactInformation: String,
  address: String,
  dateCreated: { type: Date, default: Date.now },
  dateModified: { type: Date, default: Date.now }
});

supplierSchema.pre('save', function (next) {
  this.dateModified = new Date();
  next();
});

module.exports = mongoose.model('Supplier', supplierSchema);