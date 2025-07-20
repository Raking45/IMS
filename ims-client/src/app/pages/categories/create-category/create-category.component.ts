import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [CommonModule, FormComponent],
  template: `
    <div class="create-category-container">
      <h2>Create New Category</h2>

      <app-form
        [title]="'Create Category'"
        [submitLabel]="'Create Category'"
        [inputs]="formFields"
        (formSubmit)="onSubmit($event)">
      </app-form>

      <p *ngIf="message" [ngClass]="{ 'message-success': !error, 'message-error': error }">
        {{ message }}
      </p>
    </div>
  `,
  styles: [`
    h2 {
      text-align: center;
    }
  `]
})
export class CreateCategoryComponent {
  message = '';
  error = false;

  formFields: FormInputConfig[] = [
  {
    name: '_id', 
    label: 'Category ID (e.g., cat1, cat25)', 
    placeholder: 'e.g., cat1', 
    type: 'text', 
    required: true,
  },
  {
    name: 'categoryId',
    label: 'Category ID',
    type: 'text',
    placeholder: 'e.g. CAT001',
    required: true,
    errorMessage: 'Category ID is required.'
  },
  {
    name: 'categoryName',
    label: 'Category Name',
    type: 'text',
    placeholder: 'e.g. Electronics',
    required: true,
    errorMessage: 'Category Name is required.'
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'e.g. Devices and electronic equipment'
  }
];

  
  constructor(private http: HttpClient) {}

  onSubmit(formData: any): void {
    const url = `${environment.apiBaseUrl}/api/reports/categories/create`;

    this.http.post(url, formData).subscribe({
      next: () => {
        this.error = false;
        this.message = 'Category created successfully!';
      },
      error: (err) => {
        this.error = true;
        if (err.status === 400) {
          this.message = 'Validation error. Please check your input.';
        } else if (err.status === 409) {
          this.message = 'Duplicate category ID. Please use a unique ID.';
        } else {
          this.message = 'Failed to create category.';
        }
      }
    });
  }
}
