import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';
import { TableComponent } from '../../../shared/table/table.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-delete-category',
  standalone: true,
  imports: [CommonModule, FormComponent, TableComponent],
  template: `
    <div class="delete-category-container">
      <h2>Delete Category</h2>

      <!-- Form 1: Select category to delete -->
      <app-form
        *ngIf="selectionForm.length"
        [title]="'Select Category to Delete'"
        [submitLabel]="'Load Category'"
        [inputs]="selectionForm"
        (formSubmit)="onSelectCategory($event)">
      </app-form>

      <!-- Category snapshot -->
      <app-table
        *ngIf="selectedCategory"
        [title]="'Category Snapshot'"
        [headers]="['ID', 'Category ID', 'Name', 'Description']"
        [data]="[{
          ID: selectedCategory._id,
          'Category ID': selectedCategory.categoryId,
          Name: selectedCategory.categoryName,
          Description: selectedCategory.description
        }]"
        [sortableColumns]="['Name', 'Category ID']"
        [columnTypes]="{ Name: 'alpha', 'Category ID': 'alpha' }"
      ></app-table>

      <!-- Form 2: Confirm delete -->
      <app-form
        *ngIf="deleteForm.length"
        [title]="'Confirm Deletion'"
        [submitLabel]="'Delete Category'"
        [inputs]="deleteForm"
        (formSubmit)="onDeleteCategory()">
      </app-form>

      <p *ngIf="message" [ngClass]="{'success-message': !error, 'error-message': error}">
        {{ message }}
      </p>
    </div>
  `,
  styles: [`
    h2, .success-message, .error-message {
      text-align: center;
    }
  `]
})
export class DeleteCategoryComponent implements OnInit {
  selectionForm: FormInputConfig[] = [];
  deleteForm: FormInputConfig[] = [];
  categoryList: any[] = [];
  selectedCategory: any = null;
  message = '';
  error = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  // Loads categories from the backend and rebuilds the selection form.
  loadCategories(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/reports/categories/view`)
      .subscribe(data => {
        this.categoryList = data;
        const options = data.map(cat => ({
          label: `${cat._id} - ${cat.categoryName}`,
          value: cat._id
        }));
        this.selectionForm = [{
          label: 'Select Category',
          name: 'selectedId',
          type: 'select',
          required: true,
          options,
          errorMessage: 'Please select a category.'
        }];
      });
  }

  // Loads the selected category data.
  onSelectCategory(formValue: any): void {
    const id = formValue.selectedId;
    if (!id) return;

    this.http.get<any>(`${environment.apiBaseUrl}/api/reports/categories/view/${id}`)
      .subscribe(cat => {
        this.selectedCategory = cat;
        this.buildDeleteForm(cat);
      });
  }

  // Builds a read-only form to confirm deletion.
  buildDeleteForm(cat: any): void {
    this.deleteForm = [
      {
        label: 'Category ID',
        name: 'categoryId',
        type: 'text',
        value: cat.categoryId,
        required: true,
        errorMessage: 'Category ID is required.'
      },
      {
        label: 'Category Name',
        name: 'categoryName',
        type: 'text',
        value: cat.categoryName,
        required: true,
        errorMessage: 'Category Name is required.'
      },
      {
        label: 'Description',
        name: 'description',
        type: 'text',
        value: cat.description
      }
    ];
  }

  // Deletes the selected category and refreshes the selection list.
  onDeleteCategory(): void {
    if (!this.selectedCategory?._id) return;

    this.http.delete<void>(`${environment.apiBaseUrl}/api/reports/categories/delete/${this.selectedCategory._id}`)
      .subscribe({
        next: () => {
          this.error = false;
          this.message = `Category “${this.selectedCategory._id}” deleted successfully.`;
          // Clear the current selection and delete form.
          this.selectedCategory = null;
          this.deleteForm = [];
          // Refresh the selection list to reflect deletion.
          this.loadCategories();
        },
        error: () => {
          this.error = true;
          this.message = `Failed to delete category “${this.selectedCategory._id}”.`;
        }
      });
  }
}

