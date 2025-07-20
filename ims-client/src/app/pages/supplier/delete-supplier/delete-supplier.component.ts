import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';
import { TableComponent } from '../../../shared/table/table.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-delete-supplier',
  standalone: true,
  imports: [CommonModule, FormComponent, TableComponent],
  template: `
    <div class="delete-supplier-container">
      <h2>Delete Supplier</h2>

      <!-- Form 1: Select supplier -->
      <app-form
        *ngIf="selectionForm.length"
        [title]="'Select Supplier to Delete'"
        [submitLabel]="'Load Supplier'"
        [inputs]="selectionForm"
        (formSubmit)="onSelectSupplier($event)">
      </app-form>

      <!-- Snapshot -->
      <app-table
        *ngIf="selectedSupplier"
        [title]="'Supplier Snapshot'"
        [headers]="['Id', 'Name', 'Contact', 'Address']"
        [data]="[{
          Id: selectedSupplier._id,
          Name: selectedSupplier.supplierName,
          Contact: selectedSupplier.contactInformation,
          Address: selectedSupplier.address
        }]"
        [sortableColumns]="['Name']"
        [columnTypes]="{ Name: 'alpha' }"
      ></app-table>

      <!-- Confirm delete -->
      <app-form
        *ngIf="deleteForm.length"
        [title]="'Confirm Deletion'"
        [submitLabel]="'Delete Supplier'"
        [inputs]="deleteForm"
        (formSubmit)="onDeleteSupplier()">
      </app-form>

      <p *ngIf="message"
         [ngClass]="{ 'success-message': !error, 'error-message': error }">
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
export class DeleteSupplierComponent implements OnInit {
  selectionForm: FormInputConfig[] = [];
  deleteForm: FormInputConfig[] = [];
  supplierList: any[] = [];
  selectedSupplier: any = null;
  message = '';
  error = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  private loadSuppliers(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/reports/suppliers/view`)
      .subscribe(data => {
        this.supplierList = data;

        const options = data.map(supplier => ({
          label: `${supplier._id} - ${supplier.supplierName}`,
          value: supplier._id
        }));

        this.selectionForm = [{
          label: 'Select Supplier',
          name: 'selectedId',
          type: 'select',
          required: true,
          options,
          errorMessage: 'Please select a supplier to delete.'
        }];
      });
  }

  onSelectSupplier(formValue: any): void {
    const id = formValue.selectedId;
    if (!id) return;

    this.http.get<any>(`${environment.apiBaseUrl}/api/reports/suppliers/view/${id}`)
      .subscribe(supplier => {
        this.selectedSupplier = supplier;
        this.buildDeleteForm(supplier);
      });
  }

  buildDeleteForm(supplier: any): void {
    this.deleteForm = [
      {
        label: 'ID',
        name: '_id',
        type: 'text',
        value: supplier._id,
        required: true
      },
      {
        label: 'Supplier Name',
        name: 'supplierName',
        type: 'text',
        value: supplier.supplierName
      },
      {
        label: 'Contact Info',
        name: 'contactInformation',
        type: 'text',
        value: supplier.contactInformation
      },
      {
        label: 'Address',
        name: 'address',
        type: 'text',
        value: supplier.address
      }
    ];
  }

  onDeleteSupplier(): void {
    if (!this.selectedSupplier?._id) return;

    this.http.delete<void>(
      `${environment.apiBaseUrl}/api/reports/suppliers/delete/${this.selectedSupplier._id}`
    ).subscribe({
      next: () => {
        this.message = `Supplier “${this.selectedSupplier._id}” deleted successfully!`;
        this.error = false;
        this.selectedSupplier = null;
        this.deleteForm = [];

        this.loadSuppliers(); // Refresh the list
      },
      error: () => {
        this.message = `Failed to delete supplier “${this.selectedSupplier?._id}.”`;
        this.error = true;
      }
    });
  }
}

