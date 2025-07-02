import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="table-container">
      <h2 class="table-title">{{ title }}</h2>
      <table class="table">
        <thead class="table-head" [ngClass]="headerBackground">
          <tr class="table-row">
            @for(header of headers; track header) {
              <th class="table-header" (click)="sortableColumns.includes(header) && sortData(header)">
                <span class="header-content">
                  {{ header }}
                  <i
                    *ngIf="sortableColumns.includes(header)"
                    [class]="getSortIconClass(header)"
                    aria-hidden="true"
                  ></i>
                </span>
              </th>
            }
          </tr>
        </thead>
        <tbody class="table-body">
          @for(row of paginatedData; track row) {
            <tr class="table-row">
              @for(header of headers; track header) {
                <td class="table-cell">{{ row[header] }}</td>
              }
            </tr>
          }
        </tbody>
      </table>
      <div class="pagination-wrapper">
        <div class="pagination">
          <button class="button button-primary" (click)="changePage(currentPage - 1)" [disabled]="currentPage === 1">Previous</button>
          <span class="pagination-info">Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="button button-primary" (click)="changePage(currentPage + 1)" [disabled]="currentPage * recordsPerPage >= data.length">Next</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
  .table-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 75%;
    margin: 2rem auto;
    background-color: var(--surface-color);
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px var(--shadow-color);
    overflow-x: auto;
  }

  .table-title {
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    text-align: center;
    width: 100%;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    background-color: var(--surface-color);
    border-radius: 8px;
    overflow: hidden;
  }

  .table-head.default {
    background-color: var(--primary-light);
    color: var(--text-white);
  }

  .table-head.primary {
    background-color: var(--accent-dark);
    color: var(--text-white);
  }

  .table-head.secondary {
    background-color: var(--primary-dark);
    color: var(--text-white);
  }

  .table-row {
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
  }

  .table-header, .table-cell {
    padding: 12px 16px;
    text-align: left;
    position: relative;
    color: var(--text-primary);
    font-family: 'Rubik', sans-serif;
  }

  .table-header {
    font-weight: 600;
    font-size: 1.2rem;
    cursor: pointer;
    user-select: none;
  } 

  .table-header:hover {
    background-color: var(--hover-color);
    color: var(--text-white);
  }

  .header-content {
    display: inline-flex;
    align-items: center;
    color: var(--text-white);
  }

  .header-content i {
    margin-left: 6px;
    font-size: 0.9em;
  }

  .table-cell {
    color: var(--text-secondary);
    font-size: 0.95rem;
  }

  .pagination-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 1.5rem;
  }

  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 3rem;
    flex-wrap: wrap;
  }

  .pagination-info {
    font-size: 0.95rem;
    color: var(--text-secondary);
  }

  .button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    font-family: 'Rubik', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }

  .button-primary {
    background-color: var(--primary-color);
    color: var(--text-white);
  }

  .button-primary:disabled {
    background-color: var(--primary-light);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .button-primary:hover:not(disabled) {
    background-color: var(--hover-color);
  }

  @media (max-width: 768px) {
    .table-header, .table-cell {
      padding: 8px 10px;
      font-size: 0.85rem;
    }

    .table-title {
      font-size: 1.25rem;
    }
  }
  `]
})
export class TableComponent implements OnInit, OnChanges {
  @Input() title!: string;
  @Input() data!: any[];
  @Input() headers!: string[];
  @Input() recordsPerPage: number = 10; // Set to 10 records per page.
  @Input() sortableColumns!: string[];
  @Input() columnTypes: { [key: string]: 'alpha' | 'numeric' } = {};
  @Input() headerBackground: 'default' | 'primary' | 'secondary' = 'default';

  currentPage: number = 1;
  sortedColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor() { }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.sortData(this.sortedColumn);
    }
  }

  get paginatedData() {
    const start = (this.currentPage - 1) * this.recordsPerPage;
    const end = start + this.recordsPerPage;
    return this.data.slice(start, end);
  }

  getSortIconClass(header: string): string {
  if (!this.sortableColumns.includes(header)) return '';

  const type = this.columnTypes[header] || 'alpha'; // default to alpha
  const direction = this.sortedColumn === header ? this.sortDirection : null;

  if (!direction) return 'fa fa-sort';

  if (type === 'numeric') {
    return direction === 'asc' ? 'fa fa-sort-numeric-asc' : 'fa fa-sort-numeric-desc';
  } else {
    return direction === 'asc' ? 'fa fa-sort-alpha-asc' : 'fa fa-sort-alpha-desc';
  }
}

  sortData(column: string) {
    if (this.sortedColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = column;
      this.sortDirection = 'asc';
    }

    this.data.sort((a, b) => {
      if (a[column] < b[column]) return this.sortDirection === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.recordsPerPage);
  }
}
