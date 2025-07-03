// src/app/pages/inventory/create-inventory-item/create-inventory-item.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http'; // <- keep this for the service
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-inventory-item',
  standalone: true,
  imports: [CommonModule, FormComponent], // ❌ removed HttpClientModule
  template: `
    <div class="create-inventory-container">
      <app-form
        [title]="'Create Inventory Item'"
        [submitLabel]="'Create Item'"
        [inputs]="formFields"
        (formSubmit)="handleSubmit($event)">
      </app-form>

      <p *ngIf="message">{{ message }}</p>
    </div>
  `,
  styles: [``]
})
export class CreateInventoryItemComponent {
  formFields: FormInputConfig[] = [
    { name: '_id', label: 'ID', placeholder: 'Enter ID', type: 'text', required: true },
    { name: 'name', label: 'Name', placeholder: 'Enter name', type: 'text', required: true },
    { name: 'description', label: 'Description', placeholder: 'Enter description', type: 'textarea' },
    { name: 'quantity', label: 'Quantity', placeholder: 'Enter quantity', type: 'number', required: true },
    { name: 'price', label: 'Price', placeholder: 'Enter price', type: 'number', required: true },
    { name: 'categoryId', label: 'Category ID', placeholder: 'Enter category ID', type: 'text', required: true },
    { name: 'supplierId', label: 'Supplier ID', placeholder: 'Enter supplier ID', type: 'text', required: true }
  ];

  message = '';

  constructor(private http: HttpClient) {}

  handleSubmit(formData: any): void {
    const url = `${environment.apiBaseUrl}/api/reports/inventory/create`;
    console.log('POSTing to:', url, formData);

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price)
    };

    this.http.post(url, payload).subscribe({
      next: () => this.message = '✅ Inventory item created successfully!',
      error: (err) => {
        if (err.status === 400) {
          this.message = '⚠️ Validation error. Please check your input.';
        } else if (err.status === 409) {
          this.message = '⚠️ Duplicate item ID. Please use a unique ID.';
        } else {
          this.message = '❌ Failed to create inventory item.';
        }
      }
    });
  }
}
