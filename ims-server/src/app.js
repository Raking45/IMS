'use strict';

// require statements
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { notFoundHandler, errorHandler } = require('./routes/utils/error-handler');
const connectToDatabase = require('./routes/utils/mongoose'); // Import Connection
const path = require('path');

// Importing routers
const indexRouter = require('./routes/index');
const dashboardRouter = require('./routes/dashboard');
const usersRouter = require('./routes/users');
const securityRouter = require("./routes/security");
const viewInventoryRouter = require('./routes/inventory/view-inventory-items');
const createInventoryRouter = require('./routes/inventory/create-inventory-item');
const deleteInventoryRouter = require('./routes/inventory/delete-inventory-item');
const updateInventoryRouter = require('./routes/inventory/update-inventory-item');
const viewSupplierRouter = require('./routes/supplier/view-suppliers');
const createSupplierRouter = require('./routes/supplier/create-supplier');
const deleteSupplierRouter = require('./routes/supplier/delete-supplier');
const updateSupplierRouter = require('./routes/supplier/update-supplier');
const viewCategoryRouter = require('./routes/categories/view-categories');
const createCategoryRouter = require('./routes/categories/create-category');
const deleteCategoryRouter = require('./routes/categories/delete-category');
const updateCategoryRouter = require('./routes/categories/update-category');
const searchRouter = require('./routes/search');

// Initialize express app
const app = express();

// Connect to MongoDB using Mongoose
connectToDatabase();  // Initializes DB Connection

// CORS configuration
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // This allows all origins
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed request methods
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allowed headers
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// API Routes
app.use('/api', indexRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/users', usersRouter);
app.use('/api/security', securityRouter);
app.use('/api/reports/inventory/view', viewInventoryRouter);
app.use('/api/reports/inventory/create', createInventoryRouter);
app.use('/api/reports/inventory/delete', deleteInventoryRouter);
app.use('/api/reports/inventory/update', updateInventoryRouter);
app.use('/api/reports/suppliers/view', viewSupplierRouter);
app.use('/api/reports/suppliers/create', createSupplierRouter);
app.use('/api/reports/suppliers/delete', deleteSupplierRouter);
app.use('/api/reports/suppliers/update', updateSupplierRouter);
app.use('/api/reports/categories/view', viewCategoryRouter);
app.use('/api/reports/categories/create', createCategoryRouter);
app.use('/api/reports/categories/delete', deleteCategoryRouter);
app.use('/api/reports/categories/update', updateCategoryRouter);
app.use('/api/search', searchRouter);

// Basic root route
app.get('/', (req, res) => {
  res.send('Inventory Management System API is running.');
});

// Serve Angular static files **after** API routes and middleware
app.use(express.static(path.join(__dirname, '../../ims-client/dist/ims-client/browser/')));

// For any other route, serve Angular's index.html to enable client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../ims-client/dist/ims-client/browser/index.html'));
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
