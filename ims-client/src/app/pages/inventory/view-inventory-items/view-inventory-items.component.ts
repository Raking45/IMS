import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TableComponent } from '../../../shared/table/table.component';
import { SearchService } from '../../../shared/services/search-service.service';

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
      [imageColumn]="'Image'"
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
  inventoryHeaders = ['Image', 'Id', 'Name', 'Description', 'Quantity', 'Price', 'Category Id', 'Supplier Id', 'Date Created', 'Date Modified'];
  formFields: any[] = [];

  allInventory: any[] = [];

  constructor(private http: HttpClient, private searchService: SearchService) {}

  ngOnInit(): void {
    this.loadInventory();
  }

  loadInventory() {
  this.http.get<any[]>(`${environment.apiBaseUrl}/api/reports/inventory/view`).subscribe(data => {
    this.inventoryItems = data.map((item, index) => ({
      Id: item._id || index,
      ...item,
      Name: item.name,
      Description: item.description,
      Quantity: item.quantity,
      Price: item.price,
      'Category Id': item.categoryId,
      'Supplier Id': item.supplierId,
      'Date Created': item.dateCreated,
      'Date Modified': item.dateModified,
      Image: `https://picsum.photos/seed/${item._id || index}/${35}` // assign a unique image URL
      }));
    });
  }
}
