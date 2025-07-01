import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from '../../../shared/form/form.component';
import { environment } from '../../../../environments/environment';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TableComponent } from '../../../shared/table/table.component';

@Component({
  selector: 'app-view-inventory-items',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TableComponent, FormComponent],
  template: `
  <div class="view-inventory-container">
    <app-form
      [title]="'View Inventory by Id'"
      [submitLabel]="'Generate Report'"
      [inputs]="formFields"
      (formSubmit)="handleSubmit($event)">
    </app-form>

    <app-table
        *ngIf="inventoryItems.length > 0"
        [title]="'Inventory Items'"
        [data]="inventoryItems"
        [headers]="inventoryHeaders"
        [sortableColumns]="['name', 'quantity', 'price']"
        [columnTypes]="{ name: 'alpha', quantity: 'numeric', price: 'numeric' }"
        [headerBackground]="'default'">
      </app-table>
  </div>
  `,
  styles: [``]
})
export class ViewInventoryItemsComponent implements OnInit {
  inventoryItems: any[] = [];
  inventoryHeaders = ['_id', 'name', 'description', 'quantity', 'price', 'categoryId', 'supplierId', 'dateCreated', 'dateModified'];
  formFields: any[] = [];

  allInventory: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch inventory list to populate dropdown
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/reports/inventory/view`).subscribe(data => {
      this.allInventory = data;

      this.formFields = [
        {
          name: '_id',
          label: 'Select Inventory Id',
          placeholder: 'Click for Dropdown List',
          type: 'select' as const,
          required: true,
          options: data.map(item => ({
            label: `${item._id} - ${item.name}`,
            value: item._id
          }))
        }
      ];
    });
  }

  // Fetch inventory _id to populate table
  handleSubmit(formData: any) {
    const id = formData._id;
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/reports/inventory/view/${id}`).subscribe(data => {
      this.inventoryItems = Array.isArray(data) ? data : [data];
    });
  }
}
