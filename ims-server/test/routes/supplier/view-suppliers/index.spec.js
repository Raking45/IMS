const request = require('supertest');
const express = require('express');
const router = require('../../../../src/routes/supplier/view-suppliers/index');

const Supplier = require('../../../../src/models/supplier');
jest.mock('../../../../src/models/supplier');

const app = express();
app.use(express.json());
app.use('/api/supplier', router);

// Basic error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Server error'
  });
});

describe('GET /api/supplier (mocked)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of suppliers', async () => {
    const mockSuppliers = [
      { _id: '1', name: 'Supplier A' },
      { _id: '2', name: 'Supplier B' }
    ];
    Supplier.find.mockResolvedValue(mockSuppliers);

    const res = await request(app).get('/api/supplier');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe('Supplier A');
  });

  it('should return a supplier by valid ID', async () => {
    const mockSupplier = { _id: 'abc123', name: 'Test Supplier' };
    Supplier.findOne.mockResolvedValue(mockSupplier);

    const res = await request(app).get('/api/supplier/abc123');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Test Supplier');
  });

  it('should return 404 if supplier not found', async () => {
    Supplier.findOne.mockResolvedValue(null);

    const res = await request(app).get('/api/supplier/unknown-id');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'Supplier not found');
  });

  it('should return 500 if ID format is invalid', async () => {
    Supplier.findOne.mockRejectedValue(new Error('Cast to ObjectId failed'));

    const res = await request(app).get('/api/supplier/invalid-id');

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toMatch(/Cast to ObjectId failed/);
  });

  it('should return JSON content-type when fetching list', async () => {
    Supplier.find.mockResolvedValue([]);

    const res = await request(app).get('/api/supplier');

    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.statusCode).toBe(200);
  });

  it('should handle unexpected errors in /api/supplier/:id', async () => {
    Supplier.findOne.mockRejectedValue(new Error('Unexpected DB error'));

    const res = await request(app).get('/api/supplier/abc123');

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Unexpected DB error');
  });
});

