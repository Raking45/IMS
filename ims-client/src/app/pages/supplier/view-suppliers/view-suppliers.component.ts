import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TableComponent } from '../../../shared/table/table.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view-suppliers',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TableComponent],
  template: `
    <div class="sup-view-container">
      <h2>View All Suppliers</h2>
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
    .sup-view-container {
      text-align: center;
    }
  `]
})
export class ViewSuppliersComponent {
  suppliers: any[] = [];

  supplierHeaders = ['_id', 'supplierName', 'contactInformation', 'address'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers() {
      this.http.get<any[]>(`${environment.apiBaseUrl}/api/reports/suppliers/view`).subscribe(data => {
        this.suppliers = data;
      });
    }
}
