import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TableComponent } from '../../../shared/table/table.component';
@Component({
  selector: 'app-view-categories',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TableComponent],
  template: `
    <div class="cat-view-category">
      <h2>View All Categories</h2>
      <app-table
        *ngIf="categories.length > 0"
        [title]="'Categories'"
        [data]="categories"
        [headers]="categoryHeaders"
        [sortableColumns]="['categoryName']"
        [columnTypes]="{ categoryName: 'alpha' }"
        [headerBackground]="'default'">
      </app-table>
    </div>
  `,
  styles: [`
    .cat-view-category {
      text-align: center;
    }
  `]
})
export class ViewCategoriesComponent implements OnInit {
  categories: any[] = [];

  categoryHeaders = ['_id', 'categoryId', 'categoryName', 'description'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/reports/categories/view`).subscribe(data => {
      this.categories = data;
    });
  }
}
