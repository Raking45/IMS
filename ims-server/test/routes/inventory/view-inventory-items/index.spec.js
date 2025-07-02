const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../../src/app');
const InventoryItem = require('../../../../src/models/inventoryItem');

describe('GET /api/reports/inventory/view', () => {
  let mockItem;

  beforeAll(async () => {
    // Connect to the test database if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/test-db');
    }

    // Insert a valid mock inventory item
    const mockData = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Sample Item',
      description: 'Sample description',
      quantity: 10,
      price: 100,
      supplierId: new mongoose.Types.ObjectId(),
      categoryId: new mongoose.Types.ObjectId(),
    };

    mockItem = await InventoryItem.create(mockData);
  });

  afterAll(async () => {
    await InventoryItem.deleteMany({});
    await mongoose.connection.close();
  });

  // 1. Should return all inventory items
  it('should return a list of inventory items', async () => {
    const res = await request(app).get('/api/reports/inventory/view');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // 2. Should return a specific inventory item by ID
  it('should return an inventory item by ID', async () => {
    const res = await request(app).get(`/api/reports/inventory/view/${mockItem._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', mockItem._id.toString());
  });

  // 3. Should return 404 for non-existent item ID
  it('should return 404 if item does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/reports/inventory/view/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Inventory item not found');
  });

  // 4. Should return empty array if no items exist
  it('should return empty array when no items are found', async () => {
    await InventoryItem.deleteMany({});
    const res = await request(app).get('/api/reports/inventory/view');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  // 5. Should handle server errors gracefully
  it('should handle server error', async () => {
    const originalFind = InventoryItem.find;
    InventoryItem.find = jest.fn().mockRejectedValue(new Error('Server crash'));

    const res = await request(app).get('/api/reports/inventory/view');
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('type', 'error');
    expect(res.body).toHaveProperty('message', 'Server crash');

    InventoryItem.find = originalFind; // Restore original method
  });
});
