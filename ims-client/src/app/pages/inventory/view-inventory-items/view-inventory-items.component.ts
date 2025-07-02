import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TableComponent } from '../../../shared/table/table.component';

@Component({
  selector: 'app-view-inventory-items',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TableComponent],
  template: `
  <div class="inv-view-container">
    <h2>All Inventory Items</h2>
    <app-table
      *ngIf="inventoryItems.length > 0"
      [title]="'Inventory Items'"
      [data]="inventoryItems"
      [headers]="inventoryHeaders"
      [sortableColumns]="['Name', 'Quantity', 'Price']"
      [columnTypes]="{ Name: 'alpha', Quantity: 'numeric', Price: 'numeric' }"
      [headerBackground]="'default'">
    </app-table>
  </div>
  `,
  styles: [`
    .inv-view-container {
      text-align: center;
    }
    `]
})
export class ViewInventoryItemsComponent implements OnInit {
  inventoryItems: any[] = [];
  inventoryHeaders = ['Id', 'Name', 'Description', 'Quantity', 'Price', 'Category Id', 'Supplier Id', 'Date Created', 'Date Modified'];
  formFields: any[] = [];

  allInventory: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/reports/inventory/view`).subscribe(data => {
      this.inventoryItems = data;
      for (let data of this.inventoryItems) {
        data['Id']=data['_id'];
        data['Name']=data['name'];
        data['Description']=data['description'];
        data['Quantity']=data['quantity'];
        data['Price']=data['price'];
        data['Category Id']=data['categoryId'];
        data['Supplier Id']=data['supplierId'];
        data['Date Created']=data['dateCreated'];
        data['Date Modified']=data['dateModified'];
      }
    });
  }
}
