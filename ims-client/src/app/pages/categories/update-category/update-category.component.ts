import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';
import { TableComponent } from '../../../shared/table/table.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [CommonModule, FormComponent, TableComponent],
  template: `
    <div class="update-category-container">
      <h2>Update Category</h2>

      <!-- Form 1: Select category -->
      <app-form
        *ngIf="selectionForm.length"
        [title]="'Select Category to Edit'"
        [submitLabel]="'Load Category'"
        [inputs]="selectionForm"
        (formSubmit)="onSelectCategory($event)">
      </app-form>

      <!-- Form 2: Edit category -->
      <app-form
        *ngIf="editForm.length"
        [title]="'Update Category'"
        [submitLabel]="'Update Category'"
        [inputs]="editForm"
        (formSubmit)="onSubmit($event)">
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
    </div>
  `,
  styles: [`
    h2 {
      text-align: center;
    }
  `]
})
export class UpdateCategoryComponent implements OnInit {
  selectionForm: FormInputConfig[] = [];
  editForm: FormInputConfig[] = [];
  categoryList: any[] = [];
  selectedCategory: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
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

  onSelectCategory(formValue: any): void {
    const id = formValue.selectedId;
    if (!id) return;

    this.http.get<any>(`${environment.apiBaseUrl}/api/reports/categories/view/${id}`)
      .subscribe(cat => {
        this.selectedCategory = cat;
        this.buildEditForm(cat);
      });
  }

  buildEditForm(cat: any): void {
    this.editForm = [
      {
        label: 'Category ID',
        name: 'categoryId',
        type: 'text',
        required: true,
        value: cat.categoryId ?? '',
        errorMessage: 'Category ID is required.'
      },
      {
        label: 'Category Name',
        name: 'categoryName',
        type: 'text',
        required: true,
        value: cat.categoryName ?? '',
        errorMessage: 'Category Name is required.'
      },
      {
        label: 'Description',
        name: 'description',
        type: 'text',
        value: cat.description ?? ''
      }
    ];
  }

  onSubmit(updatedForm: any): void {
    if (!this.selectedCategory?._id) return;

    this.http.put<any>(
      `${environment.apiBaseUrl}/api/reports/categories/update/${this.selectedCategory._id}`,
      updatedForm
    ).subscribe({
      next: updated => {
        this.selectedCategory = updated;
        alert('Category updated successfully.');
      },
      error: () => {
        alert('Failed to update category.');
      }
    });
  }
}

