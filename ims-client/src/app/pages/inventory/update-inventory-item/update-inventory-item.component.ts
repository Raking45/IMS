// src/app/pages/inventory/update-inventory-item/update-inventory-item.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

interface InventoryItem {
  _id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-update-inventory-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="update-inventory-container">
      <h2>Update Inventory Item</h2>

      <!-- Dropdown to select item -->
      <label for="selectedItem">Select an item:</label>
      <select
        id="selectedItem"
        [(ngModel)]="selectedItemId"
        (ngModelChange)="onItemSelected($event)"
      >
        <option value="">-- choose --</option>
        <option *ngFor="let item of items" [value]="item._id">
          {{ item.name }} ({{ item._id }})
        </option>
      </select>

      <!-- Form appears once an item is selected -->
      <form *ngIf="selectedItem" (ngSubmit)="onSubmit()" #f="ngForm" class="form">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            name="name"
            required
            [(ngModel)]="selectedItem.name"
            placeholder="e.g. Widget A"
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <input
            id="description"
            name="description"
            [(ngModel)]="selectedItem.description"
            placeholder="e.g. High-quality widget"
          />
        </div>

        <div class="form-group">
          <label for="quantity">Quantity</label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            required
            [(ngModel)]="selectedItem.quantity"
            placeholder="e.g. 100"
          />
        </div>

        <div class="form-group">
          <label for="price">Price</label>
          <input
            id="price"
            name="price"
            type="number"
            required
            [(ngModel)]="selectedItem.price"
            placeholder="e.g. 9.99"
          />
        </div>

        <button type="submit" [disabled]="f.invalid">Update Item</button>
      </form>

      <p class="message" *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .update-inventory-container { max-width: 600px; margin: auto; padding: 1rem; }
    select, input { width: 100%; padding: 0.5rem; margin-bottom: 1rem; }
    button { padding: 0.5rem 1rem; }
    .message { margin-top: 1rem; color: var(--error-color); }
  `]
})
export class UpdateInventoryItemComponent implements OnInit {
  items: InventoryItem[] = [];
  selectedItemId = '';
  selectedItem: InventoryItem | null = null;
  message = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadItems();
  }

  private loadItems() {
    this.http
      .get<InventoryItem[]>(`${environment.apiBaseUrl}/api/reports/inventory/view`)
      .subscribe({
        next: items => this.items = items,
        error: () => this.message = 'Failed to load inventory list.'
      });
  }

  onItemSelected(id: string) {
    const found = this.items.find(i => i._id === id);
    this.selectedItem = found ? { ...found } : null;
    this.message = '';
  }

  onSubmit() {
    if (!this.selectedItem) { return; }
    this.http
      .put<InventoryItem>(
        `${environment.apiBaseUrl}/api/reports/inventory/update/${this.selectedItem._id}`,
        this.selectedItem
      )
      .subscribe({
        next: () => {
          this.message = 'Item updated successfully.';
          this.router.navigate(['/inventory']);
        },
        error: () => this.message = 'Failed to update item.'
      });
  }
}
