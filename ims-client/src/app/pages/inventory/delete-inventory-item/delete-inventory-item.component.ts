// src/app/pages/inventory/delete-inventory-item/delete-inventory-item.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';  // Reusable form UI :contentReference[oaicite:0]{index=0}
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-delete-inventory-item',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormComponent],
  template: `
    <div class="card">
      <div class="card-header">Delete Inventory Item</div>
      <div class="card-body">
        <app-form
          [title]="'Delete Inventory Item'"
          [submitLabel]="'Delete'"
          [inputs]="formFields"
          (formSubmit)="handleDelete($event)">
        </app-form>

        <p *ngIf="message"

          [ngClass]="{ 'message--success': !error, 'message--error': error }">

          {{ message }}
        </p>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background-color: var(--surface-color);
      border-radius: 8px;
      box-shadow: 0 4px 8px var(--shadow-color);
      margin: 2rem auto;
      max-width: 500px;
      overflow: hidden;
    }
    .card-header {
      background-color: var(--primary-color);
      color: var(--text-white);
      padding: 1rem;
      font-family: Rubik, sans-serif;
      font-size: 1.25rem;
    }
    .card-body {
      padding: 1.5rem;
      font-family: Lora, serif;
    }
    .message--success {
      color: var(--success-color);
      margin-top: 1rem;
    }
    .message--error {
      color: var(--error-color);
      margin-top: 1rem;
    }
  `]
})
export class DeleteInventoryItemComponent {
  // Single‐field form: just the ID to delete
  formFields: FormInputConfig[] = [
    {
      name: '_id',
      label: 'Item ID',
      placeholder: 'Enter item ID to delete',
      type: 'text',
      required: true
    }
  ];

  message = '';
  error = false;

  constructor(private http: HttpClient) {}


  handleDelete(formData: any): void {
    const id = formData._id;
    const url = `${environment.apiBaseUrl}/api/reports/inventory/delete-inventory/${id}`;

    this.http.delete<void>(url).subscribe({
      next: () => {
        this.error = false;
        this.message = `Inventory item "${id}" deleted successfully!`;
      },
      error: () => {
        this.error = true;
        this.message = `Failed to delete inventory item "${id}."`;

      }
    });
  }
}

