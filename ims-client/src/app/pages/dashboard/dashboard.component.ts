import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TableComponent } from '../../shared/table/table.component'; 
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TableComponent],
  template: `
    <div class="dashboard-container">
      <app-table
        *ngIf="inventoryItems.length > 0"
        [title]="'Inventory Items'"
        [data]="inventoryItems"
        [headers]="inventoryHeaders"
        [sortableColumns]="['name', 'quantity', 'price']"
        [headerBackground]="'default'">
      </app-table>

      <app-table
        *ngIf="categories.length > 0"
        [title]="'Categories'"
        [data]="categories"
        [headers]="categoryHeaders"
        [sortableColumns]="['categoryName']"
        [headerBackground]="'default'">
      </app-table>

      <app-table
        *ngIf="suppliers.length > 0"
        [title]="'Suppliers'"
        [data]="suppliers"
        [headers]="supplierHeaders"
        [sortableColumns]="['supplierName', 'contactInformation']"
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

  inventoryHeaders = ['_id', 'name', 'description', 'quantity', 'price', 'categoryId', 'supplierId', 'dateCreated', 'dateModified'];
  categoryHeaders = ['categoryId', 'categoryName', 'description'];
  supplierHeaders = ['supplierName', 'contactInformation', 'address'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadInventory();
    this.loadCategories();
    this.loadSuppliers();
  }

  loadInventory() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/dashboard/inventoryItems`).subscribe(data => {
      this.inventoryItems = data;
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
