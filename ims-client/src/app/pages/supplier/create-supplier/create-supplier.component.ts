import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-supplier',
  standalone: true,
  imports: [CommonModule, FormComponent],
  template: `
    <div class="create-supplier-container">
      <h2>Create New Supplier</h2>

      <app-form
        [title]="'Create Supplier'"
        [submitLabel]="'Create Supplier'"
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

    .form-message {
      text-align: center;
      margin-top: 1rem;
      font-weight: bold;
      color: #2c3e50;
    }
  `]
})
export class CreateSupplierComponent {
  formFields: FormInputConfig[] = [
    {
      name: '_id',
      label: 'ID',
      type: 'text',
      placeholder: 'e.g. sup5',
      required: true,
      errorMessage: 'Supplier ID (_id) is required.'
    },
    {
      name: 'supplierId',
      label: 'Supplier Code',
      type: 'text',
      placeholder: 'e.g. SUP005',
      required: true,
      errorMessage: 'Supplier code is required.'
    },
    {
      name: 'supplierName',
      label: 'Supplier Name',
      type: 'text',
      placeholder: 'e.g. TechNova LLC',
      required: true,
      errorMessage: 'Supplier name is required.'
    },
    {
      name: 'contactInformation',
      label: 'Contact Information',
      type: 'text',
      placeholder: 'e.g. contact@technova.com'
    },
    {
      name: 'address',
      label: 'Address',
      type: 'textarea',
      placeholder: 'e.g. 500 Innovation Dr, TX'
    }
  ];

  message = '';

  constructor(private http: HttpClient) {}

  onSubmit(formData: any): void {
    const url = `${environment.apiBaseUrl}/api/reports/suppliers/create`;

    this.http.post(url, formData).subscribe({
      next: () => {
        this.message = 'Supplier created successfully!';
      },
      error: (err) => {
        if (err.status === 400) {
          this.message = 'Validation error. Please check your input.';
        } else if (err.status === 409) {
          this.message = 'Duplicate supplier name or ID. Please use a unique value.';
        } else {
          this.message = 'Failed to create supplier.';
        }
      }
    });
  }
}

