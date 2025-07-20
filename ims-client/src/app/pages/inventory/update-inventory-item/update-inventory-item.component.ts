import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';
import { TableComponent } from '../../../shared/table/table.component';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-inventory',
  standalone: true,
  imports: [CommonModule, FormComponent, TableComponent],
  template: `
    <div class="update-inventory-container">
      <h2>Update Inventory Item</h2>

      <!-- Form 1: Select item -->
      <app-form
        *ngIf="selectionForm.length"
        [title]="'Select Item to Edit'"
        [submitLabel]="'Load Item'"
        [inputs]="selectionForm"
        (formSubmit)="onSelectItem($event)">
      </app-form>

      <!-- Form 2: Edit item -->
      <app-form
        *ngIf="editForm.length"
        [title]="'Update Inventory Item'"
        [submitLabel]="'Update Item'"
        [inputs]="editForm"
        (formSubmit)="onSubmit($event)">
      </app-form>

      <!-- Item details table -->
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
    </div>
  `,
  styles: [`
    h2 {
      text-align: center;
    }
  `]
})
export class UpdateInventoryItemComponent implements OnInit {
  selectionForm: FormInputConfig[] = [];
  editForm: FormInputConfig[] = [];
  inventoryList: any[] = [];
  selectedItem: any = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
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
          errorMessage: 'Please select an item.'
        }];
      });
  }

  onSelectItem(formValue: any): void {
    const id = formValue.selectedId;
    if (!id) return;

    this.http.get<any>(`${environment.apiBaseUrl}/api/reports/inventory/view/${id}`)
      .subscribe(item => {
        this.selectedItem = item;
        this.buildEditForm(item);
      });
  }

  buildEditForm(item: any): void {
    this.editForm = [
      {
        label: 'Name',
        name: 'name',
        type: 'text',
        required: true,
        value: item.name ?? '',
        errorMessage: 'Name is required.'
      },
      {
        label: 'Description',
        name: 'description',
        type: 'text',
        value: item.description ?? ''
      },
      {
        label: 'Quantity',
        name: 'quantity',
        type: 'number',
        required: true,
        value: item.quantity ?? 0,
        errorMessage: 'Quantity is required.'
      },
      {
        label: 'Price',
        name: 'price',
        type: 'number',
        required: true,
        value: item.price ?? 0,
        errorMessage: 'Price is required.'
      }
    ];
  }

  onSubmit(updatedForm: any): void {
  if (!this.selectedItem?._id) return;

  this.http.put<any>(
    `${environment.apiBaseUrl}/api/reports/inventory/update/${this.selectedItem._id}`,
    updatedForm
  ).subscribe({
    next: (data) => {
      this.selectedItem = data;
      alert('Inventory item updated successfully.');
      this.router.navigate(['/inventory']);
    },
    error: () => {
      alert('Failed to update item.');
    }
  });
}


  trackById(index: number, item: any): string {
    return item._id || `${index}`;
  }

}
