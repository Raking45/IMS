import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TableComponent } from '../../shared/table/table.component';
import { environment } from '../../../environments/environment';
import { SearchService } from '../../shared/services/search-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TableComponent],
  template: `
    <div class="dashboard-container">
      <app-table
        *ngIf="inventoryItems.length > 0"
        [imageColumn]="'Image'"
        [title]="'Inventory Items'"
        [data]="inventoryItems"
        [headers]="inventoryHeaders"
        [sortableColumns]="['name', 'quantity', 'price']"
        [columnTypes]="{ name: 'alpha', quantity: 'numeric', price: 'numeric' }"
        [headerBackground]="'default'">
      </app-table>

      <app-table
        *ngIf="categories.length > 0"
        [title]="'Categories'"
        [data]="categories"
        [headers]="categoryHeaders"
        [sortableColumns]="['categoryName']"
        [columnTypes]="{ categoryName: 'alpha' }"
        [headerBackground]="'default'">
      </app-table>

      <app-table
        *ngIf="suppliers.length > 0"
        [title]="'Suppliers'"
        [data]="suppliers"
        [headers]="supplierHeaders"
        [sortableColumns]="['supplierName', 'contactInformation']"
        [columnTypes]="{ supplierName: 'alpha', contactInformation: 'alpha'}"
        [headerBackground]="'default'">
      </app-table>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 2rem;
      background-color: var(--background-color);
    }

  `]
})
export class DashboardComponent implements OnInit {
  inventoryItems: any[] = [];
  categories: any[] = [];
  suppliers: any[] = [];

  inventoryHeaders = ['Image', 'Id', 'Name', 'Description', 'Quantity', 'Price', 'Category Id', 'Supplier Id', 'Date Created', 'Date Modified'];
  categoryHeaders = ['_id', 'categoryId', 'categoryName', 'description'];
  supplierHeaders = ['_id', 'supplierName', 'contactInformation', 'address'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadInventory();
    this.loadCategories();
    this.loadSuppliers();
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
        Image: `https://picsum.photos/seed/${item._id || index}/${35}`
      }));
    });
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/dashboard/categories`).subscribe(data => {
      this.categories = data;
    });
  }

  loadSuppliers() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/dashboard/suppliers`).subscribe(data => {
      this.suppliers = data;
    });
  }
}
