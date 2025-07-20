import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';
import { TableComponent } from '../../../shared/table/table.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-delete-inventory-item',
  standalone: true,
  imports: [CommonModule, FormComponent, TableComponent],
  template: `
    <div class="delete-inventory-container">
      <h2>Delete Inventory Item</h2>

      <!-- Form 1: Select item to delete -->
      <app-form
        *ngIf="selectionForm.length"
        [title]="'Select Item to Delete'"
        [submitLabel]="'Load Item'"
        [inputs]="selectionForm"
        (formSubmit)="onSelectItem($event)">
      </app-form>

      <!-- Snapshot -->
      <app-table
        *ngIf="selectedItem"
        [title]="'Item Snapshot'"
        [headers]="['Id', 'Name', 'Description', 'Quantity', 'Price']"
        [data]="[{
          Id: selectedItem._id,
          Name: selectedItem.name,
          Description: selectedItem.description,
          Quantity: selectedItem.quantity,
          Price: selectedItem.price
        }]"
        [sortableColumns]="['Name', 'Quantity', 'Price']"
        [columnTypes]="{ Name: 'alpha', Quantity: 'numeric', Price: 'numeric' }"
      ></app-table>

      <!-- Form 2: Confirm delete -->
      <app-form
        *ngIf="deleteForm.length"
        [title]="'Confirm Deletion'"
        [submitLabel]="'Delete Item'"
        [inputs]="deleteForm"
        (formSubmit)="onDeleteItem()">
      </app-form>

      <p *ngIf="message"
         [ngClass]="{ 'success-message': !error, 'error-message': error }">
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
export class DeleteInventoryItemComponent implements OnInit {
  selectionForm: FormInputConfig[] = [];
  deleteForm: FormInputConfig[] = [];
  inventoryList: any[] = [];
  selectedItem: any = null;
  message = '';
  error = false;

  constructor(private http: HttpClient) {}

 ngOnInit(): void {
  this.loadInventoryList();
}

private loadInventoryList(): void {
  this.http.get<any[]>(`${environment.apiBaseUrl}/api/reports/inventory/view`)
    .subscribe(data => {
      this.inventoryList = data;

      const options = data.map(item => ({
        label: `${item._id} - ${item.name}`,
        value: item._id
      }));

      this.selectionForm = [{
        label: 'Select Inventory Item',
        name: 'selectedId',
        type: 'select',
        required: true,
        options,
        errorMessage: 'Please select an item to delete.'
      }];
    });
}



  onSelectItem(formValue: any): void {
    const id = formValue.selectedId;
    if (!id) return;

    this.http.get<any>(`${environment.apiBaseUrl}/api/reports/inventory/view/${id}`)
      .subscribe(item => {
        this.selectedItem = item;
        this.buildDeleteForm(item);
      });
  }

  buildDeleteForm(item: any): void {
    this.deleteForm = [
      {
        label: 'ID',
        name: '_id',
        type: 'text',
        value: item._id,
        required: true
      },
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        value: item.name
      },
      {
        label: 'Description',
        name: 'description',
        type: 'text',
        value: item.description
      },
      {
        label: 'Quantity',
        name: 'quantity',
        type: 'number',
        value: item.quantity
      },
      {
        label: 'Price',
        name: 'price',
        type: 'number',
        value: item.price
      }
    ];
  }

  onDeleteItem(): void {
  if (!this.selectedItem?._id) return;

  this.http.delete<void>(
    `${environment.apiBaseUrl}/api/reports/inventory/delete/${this.selectedItem._id}`
  ).subscribe({
    next: () => {
      this.message = `Inventory item “${this.selectedItem._id}” deleted successfully!`;
      this.error = false;
      this.selectedItem = null;
      this.deleteForm = [];

      this.loadInventoryList(); // refresh after delete
    },
    error: () => {
      this.message = `Failed to delete inventory item “${this.selectedItem?._id}.”`;
      this.error = true;
    }
  });
}

}
