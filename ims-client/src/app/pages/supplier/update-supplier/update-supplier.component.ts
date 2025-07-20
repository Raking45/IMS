import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';
import { TableComponent } from '../../../shared/table/table.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-update-supplier',
  standalone: true,
  imports: [CommonModule, FormComponent, TableComponent],
  template: `
    <div class="update-supplier-container">
      <h2>Update Supplier</h2>

      <!-- Form 1: Select supplier -->
      <app-form
        *ngIf="selectionForm.length"
        [title]="'Select Supplier to Edit'"
        [submitLabel]="'Load Supplier'"
        [inputs]="selectionForm"
        (formSubmit)="onSelectSupplier($event)">
      </app-form>

      <!-- Form 2: Edit supplier -->
      <app-form
        *ngIf="editForm.length"
        [title]="'Update Supplier'"
        [submitLabel]="'Update Supplier'"
        [inputs]="editForm"
        (formSubmit)="onSubmit($event)">
      </app-form>

      <!-- Supplier details table -->
      <app-table
        *ngIf="selectedSupplier"
        [title]="'Supplier Snapshot'"
        [headers]="['Id', 'Name', 'Contact Info', 'Address']"
        [data]="[{
          Id: selectedSupplier._id,
          Name: selectedSupplier.supplierName,
          'Contact Info': selectedSupplier.contactInformation,
          Address: selectedSupplier.address
        }]"
        [sortableColumns]="['Name']"
        [columnTypes]="{ Name: 'alpha' }"
      ></app-table>
    </div>
  `,
  styles: [`
    h2 {
      text-align: center;
    }
  `]
})
export class UpdateSupplierComponent implements OnInit {
  selectionForm: FormInputConfig[] = [];
  editForm: FormInputConfig[] = [];
  supplierList: any[] = [];
  selectedSupplier: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
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
          errorMessage: 'Please select a supplier.'
        }];
      });
  }

  onSelectSupplier(formValue: any): void {
    const id = formValue.selectedId;
    if (!id) return;

    this.http.get<any>(`${environment.apiBaseUrl}/api/reports/suppliers/view/${id}`)
      .subscribe(supplier => {
        this.selectedSupplier = supplier;
        this.buildEditForm(supplier);
      });
  }

  buildEditForm(supplier: any): void {
    this.editForm = [
      {
        label: 'Supplier Name',
        name: 'supplierName',
        type: 'text',
        required: true,
        value: supplier.supplierName ?? '',
        errorMessage: 'Supplier name is required.'
      },
      {
        label: 'Contact Information',
        name: 'contactInformation',
        type: 'text',
        value: supplier.contactInformation ?? ''
      },
      {
        label: 'Address',
        name: 'address',
        type: 'text',
        value: supplier.address ?? ''
      }
    ];
  }

  onSubmit(updatedForm: any): void {
    if (!this.selectedSupplier?._id) return;

    this.http.put<any>(
      `${environment.apiBaseUrl}/api/reports/suppliers/update/${this.selectedSupplier._id}`,
      updatedForm
    ).subscribe({
      next: updated => {
        this.selectedSupplier = updated;
        alert('Supplier updated successfully.');
      },
      error: () => {
        alert('Failed to update supplier.');
      }
    });
  }
}

