// src/app/pages/inventory/create-inventory-item/create-inventory-item.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-inventory-item',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormComponent],
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
  // Field definitions for the shared form component
  formFields: FormInputConfig[] = [
    { name: '_id',         label: 'ID',           placeholder: 'Enter ID',           type: 'text',     required: true },
    { name: 'name',        label: 'Name',         placeholder: 'Enter name',         type: 'text',     required: true },
    { name: 'description', label: 'Description',  placeholder: 'Enter description',  type: 'textarea'                },
    { name: 'quantity',    label: 'Quantity',     placeholder: 'Enter quantity',     type: 'number',   required: true },
    { name: 'price',       label: 'Price',        placeholder: 'Enter price',        type: 'number',   required: true },
    { name: 'categoryId',  label: 'Category ID',  placeholder: 'Enter category ID',  type: 'text',     required: true },
    { name: 'supplierId',  label: 'Supplier ID',  placeholder: 'Enter supplier ID',  type: 'text',     required: true }
  ];

  // Message shown after submission succeeds or fails
  message = '';

  constructor(private http: HttpClient) {}

  handleSubmit(formData: any): void {
    // Build the exact URL your tests expect
    const url = `${environment.apiBaseUrl}/api/reports/inventory/create`;
    console.log('POSTing to:', url, formData);

    // Convert the string inputs back to numbers
    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      price:    Number(formData.price)
    };

    // Fire off the POST
    this.http.post(url, payload).subscribe({
      next: () => this.message = 'Inventory item created successfully!',
      error: () => this.message = 'Failed to create inventory item.'
    });
  }
}
