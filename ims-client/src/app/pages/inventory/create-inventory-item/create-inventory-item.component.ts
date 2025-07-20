import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-inventory-item',
  standalone: true,
  imports: [CommonModule, FormComponent],
  template: `
    <div class="create-inventory-container">
      <h2>Create New Inventory Item</h2>

      <app-form
        [title]="'Create Inventory Item'"
        [submitLabel]="'Create Item'"
        [inputs]="formFields"
        (formSubmit)="onSubmit($event)">
      </app-form>

      <p *ngIf="message" class="form-message">{{ message }}</p>
    </div>
  `,
  styles: [`
   h2 {
    text-align: center;
    }
  `]
})
export class CreateInventoryItemComponent {
  formFields: FormInputConfig[] = [
  {
    name: '_id',
    label: 'ID',
    type: 'text',
    placeholder: 'e.g. inv6',
    required: true,
    errorMessage: 'ID is required.'
  },
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'e.g. Cookbook',
    required: true,
    errorMessage: 'Name is required.'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'e.g. Healthy recipes'
  },
  {
    name: 'quantity',
    label: 'Quantity',
    type: 'number',
    placeholder: 'e.g. 80',
    required: true,
    errorMessage: 'Quantity is required.'
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    placeholder: 'e.g. 24.50',
    required: true,
    errorMessage: 'Price is required.'
  },
  {
    name: 'categoryId',
    label: 'Category ID',
    type: 'text',
    placeholder: 'e.g. CAT006',
    required: true,
    errorMessage: 'Category ID is required.'
  },
  {
    name: 'supplierId',
    label: 'Supplier ID',
    type: 'text',
    placeholder: 'e.g. SUP021',
    required: true,
    errorMessage: 'Supplier ID is required.'
  }
];


  message = '';

  constructor(private http: HttpClient) {}

  onSubmit(formData: any): void {
    const url = `${environment.apiBaseUrl}/api/reports/inventory/create-inventory`;

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      price: Number(formData.price)
    };

    this.http.post(url, payload).subscribe({
      next: () => {
        this.message = 'Inventory item created successfully!';
      },
      error: (err) => {
        if (err.status === 400) {
          this.message = 'Validation error. Please check your input.';
        } else if (err.status === 409) {
          this.message = 'Duplicate item ID. Please use a unique ID.';
        } else {
          this.message = 'Failed to create inventory item.';
        }
      }
    });
  }
}
