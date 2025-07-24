const request = require('supertest');
const express = require('express');
const router = require('../../../../src/routes/supplier/create-supplier/index');

const Supplier = require('../../../../src/models/supplier');
jest.mock('../../../../src/models/supplier');

const app = express();
app.use(express.json());
app.use('/api/supplier', router);

// Updated error handler middleware matching your code
app.use((err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({ message: 'Duplicate entry' });
  }
  if (err.message && err.message.includes('Validation')) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: 'Server error' });
});

describe('POST /api/supplier (mocked)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a supplier successfully', async () => {
    const payload = {
      name: 'Acme Corp',
      email: 'contact@acme.com',
      phone: '123-456-7890',
      address: '123 Main St, Cityville'
    };

    Supplier.mockImplementation(() => ({
      ...payload,
      _id: 'mock-id',
      save: jest.fn().mockResolvedValue({
        _id: 'mock-id',
        ...payload
      }),
    }));

    const res = await request(app).post('/api/supplier').send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id', 'mock-id');
    expect(res.body.name).toBe(payload.name);
  });

  it('should handle validation error (missing fields)', async () => {
    Supplier.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Validation failed'))
    }));

    const res = await request(app).post('/api/supplier').send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Validation failed');
  });

  it('should handle invalid email error as 500 (not validation)', async () => {
    const payload = {
      name: 'Invalid Email Supplier',
      email: 'not-an-email',
      phone: '000-000-0000',
      address: 'Fake Address'
    };

    Supplier.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Invalid email'))
    }));

    const res = await request(app).post('/api/supplier').send(payload);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Server error'); // matches error handler output
  });

  it('should handle duplicate email error', async () => {
    const payload = {
      name: 'Dup Supplier',
      email: 'dupe@example.com',
      phone: '111-111-1111',
      address: 'Dup Street'
    };

    const duplicateKeyError = new Error('Duplicate email');
    duplicateKeyError.code = 11000;

    Supplier.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(duplicateKeyError)
    }));

    const res = await request(app).post('/api/supplier').send(payload);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe('Duplicate entry');
  });

  it('should return JSON content-type', async () => {
    const payload = {
      name: 'Json Supplier',
      email: 'json@example.com',
      phone: '222-222-2222',
      address: 'Json Ave'
    };

    Supplier.mockImplementation(() => ({
      ...payload,
      _id: 'mock-id-json',
      save: jest.fn().mockResolvedValue({
        _id: 'mock-id-json',
        ...payload
      }),
    }));

    const res = await request(app).post('/api/supplier').send(payload);

    expect(res.headers['content-type']).toMatch(/application\/json/);
    expect(res.statusCode).toBe(201);
  });

  it('should handle unexpected server errors gracefully', async () => {
    const payload = {
      name: 'Error Supplier',
      email: 'error@example.com',
      phone: '000-000-0000',
      address: 'Err Ln'
    };

    Supplier.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error('Server error'))
    }));

    const res = await request(app).post('/api/supplier').send(payload);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe('Server error');
  });
});
