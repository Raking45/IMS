/**
 * Title: Update Inventory Item Tests
 * Author: Caleb Goforth
 * Date: 7/8/2025
 * Description: Unit tests for updating and retrieving inventory items
 */

const request = require('supertest');
const express = require('express');
const router = require('../../../../src/routes/inventory/update-inventory-item/index');

const InventoryItem = require('../../../../src/models/inventoryItem');
jest.mock('../../../../src/models/inventoryItem');

const app = express();
app.use(express.json());
app.use('/inventory', router);

describe('PUT /inventory/:id', () => {
  it('should return updated inventory item', async () => {
    const itemId = '123';
    const update = { name: 'Updated', quantity: 10, price: 9.99 };
    const updatedItem = { _id: itemId, ...update };

    InventoryItem.findByIdAndUpdate.mockResolvedValue(updatedItem);

    const res = await request(app)
      .put(`/inventory/${itemId}`)
      .send(update);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated');
    expect(res.body.quantity).toBe(10);
    expect(res.body.price).toBe(9.99);
  });

  it('should return 404 if item not found', async () => {
    InventoryItem.findByIdAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .put('/inventory/unknown')
      .send({ name: 'Test' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Item not found.');
  });

  it('should return 500 on server error', async () => {
    InventoryItem.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

    const res = await request(app)
      .put('/inventory/123')
      .send({ name: 'Test' });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Server error.');
  });
});
