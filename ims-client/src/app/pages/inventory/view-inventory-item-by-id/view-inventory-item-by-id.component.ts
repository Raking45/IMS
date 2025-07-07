import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TableComponent } from '../../../shared/table/table.component';
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';

@Component({
  selector: 'app-view-inventory-item-by-id',
  standalone: true,
  imports: [CommonModule, FormComponent, TableComponent, HttpClientModule],
  template: `
    <div class="view-inventory-id-container">
      <h2 class="view-inv-header">View Inventory Item by Id</h2>
      <app-form
        *ngIf="formFields.length"
        [title]="'Search Inventory Item'"
        [submitLabel]="'Search'"
        [inputs]="formFields"
        (formSubmit)="onFormSubmit($event)">
      </app-form>

      <app-table
        *ngIf="inventoryItems.length > 0"
        [title]="'Inventory Items'"
        [data]="inventoryItems"
        [headers]="inventoryHeaders"
        [sortableColumns]="['Name', 'Quantity', 'Price']"
        [columnTypes]="{Name:'alpha', Quantity: 'numeric', Price: 'numeric'}"
        [headerBackground]="'default'">
      </app-table>
    </div>
  `,
  styles: [`
    .view-inv-header {
      text-align: center;
    }
    `]
})
export class ViewInventoryItemByIdComponent implements OnInit {
  inventoryItems: any[] = [];
  formFields: FormInputConfig[] = [];
  allInventory: any[] = [];

  inventoryHeaders = [
    'Id', 'Name', 'Description', 'Quantity', 'Price', 'Category Id', 'Supplier Id', 'Date Created', 'Date Modified'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadDropdownOptions();
  }

  // Populate dropdown field options
  loadDropdownOptions() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/reports/inventory/view`).subscribe(data => {
      this.allInventory = data;

      const options = data
        // Exclude IDs 'item001' etc.
        .filter(item => !/^item\d+$/i.test(item._id))

        .slice()
        // Sort by numeric part of Id
        .sort((a, b) => {
          const numA = parseInt(a._id.replace(/[^\d]/g,''), 10);
          const numB = parseInt(b._id.replace(/[^\d]/g,''), 10);
          return numA - numB;
        })
        // Format for dropdown
        .map(item => ({
          label: `${item._id} - ${item.name}`,
          value: item._id
      }));

      this.formFields = [
        {
          label: 'Select Inventory Item',
          name: 'selectId',
          type: 'select',
          required: true,
          options,
          errorMessage: 'Please select an item.'
        }
      ];
    });
  }

  // Handle form submission
  onFormSubmit(formValue: any) {
    const id = formValue.selectId;
    if (!id) return;

    this.http.get<any>(`${environment.apiBaseUrl}/api/reports/inventory/view/${id}`).subscribe(item => {
      const transformed = {
        'Id': item._id,
        'Name': item.name,
        'Description': item.description,
        'Quantity': item.quantity,
        'Price': item.price,
        'Category Id': item.categoryId,
        'Supplier Id': item.supplierId,
        'Date Created': item.dateCreated,
        'Date Modified': item.dateModified
      };
      this.inventoryItems = [transformed];
    });
  }
}
