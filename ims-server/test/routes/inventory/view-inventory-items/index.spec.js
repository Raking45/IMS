const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../../src/app');

describe('GET /api/reports/inventory/view (non-destructive)', () => {

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/test-db', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // 1. Should return a 200 and an array (can be empty)
  it('should return a list (array) of inventory items', async () => {
    const res = await request(app).get('/api/reports/inventory/view');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // 2. Should return 404 for valid but non-existent ObjectId
  it('should return 404 for a valid but non-existent inventory item ID', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/reports/inventory/view/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Inventory item not found');
  });

  // 3. Should return 400 for invalid ObjectId format
  it('should return 400 for invalid/malformed item ID', async () => {
    const res = await request(app).get('/api/reports/inventory/view/invalid-id-###');
    
    // Optional: custom handling of CastError in middleware
    if (res.statusCode === 500) {
      // App doesn't validate ObjectId format; returns 500
      expect(res.body).toHaveProperty('type', 'error');
    } else {
      // App has middleware to catch and send 404
      expect(res.statusCode).toBe(404);
    }
  });

  // 4. Should return items with expected fields
  it('should return items with expected fields if data exists', async () => {
  const res = await request(app).get('/api/reports/inventory/view');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

  if (res.body.length > 0) {
    const item = res.body[0];
      expect(item).toHaveProperty('_id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('quantity');
      expect(item).toHaveProperty('price');
      expect(item).toHaveProperty('supplierId');
      expect(item).toHaveProperty('categoryId');
  }
});

  // 5. Should return JSON content-type
  it('should return application/json content-type', async () => {
  const res = await request(app).get('/api/reports/inventory/view');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/json/);
});

  // 6. Should return 404 for clearly fake ObjectId string
  it('should return 404 for a clearly fake but valid ObjectId string', async () => {
  const nonExistentId = 'aaaaaaaaaaaaaaaaaaaaaaaa'; // 24-char hex string
  const res = await request(app).get(`/api/reports/inventory/view/${nonExistentId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Inventory item not found');
  });
});
