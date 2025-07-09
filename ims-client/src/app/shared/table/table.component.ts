import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ContentChild
} from '@angular/core';
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
              <th
                class="table-header"
                (click)="sortableColumns.includes(header) && sortData(header)"
              >
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
                <td class="table-cell">
                  <ng-container *ngIf="header !== actionsColumn; else customCell">
                    {{ row[header] }}
                  </ng-container>
                  <ng-template #customCell>
                    <ng-container
                      *ngTemplateOutlet="rowActionsTemplate; context: { $implicit: row }"
                    ></ng-container>
                  </ng-template>
                </td>
              }
            </tr>
          }
        </tbody>
      </table>

      <div class="pagination-wrapper">
        <div class="pagination">
          <button
            class="button button-primary"
            (click)="changePage(currentPage - 1)"
            [disabled]="currentPage === 1"
          >
            Previous
          </button>
          <span class="pagination-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            class="button button-primary"
            (click)="changePage(currentPage + 1)"
            [disabled]="currentPage * recordsPerPage >= data.length"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class TableComponent implements OnInit, OnChanges {
  @Input() title!: string;
  @Input() data!: any[];
  @Input() headers!: string[];
  @Input() sortableColumns: string[] = [];
  @Input() columnTypes: { [key: string]: 'alpha' | 'numeric' } = {};
  @Input() recordsPerPage: number = 10;
  @Input() headerBackground: 'default' | 'primary' | 'secondary' = 'default';
  @Input() actionsColumn: string = 'Actions';

  @ContentChild('rowActions', { static: false }) rowActionsTemplate!: TemplateRef<any>;

  currentPage: number = 1;
  sortedColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {}

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

  sortData(column: string) {
    if (!column) return;

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

  getSortIconClass(header: string): string {
    if (!this.sortableColumns.includes(header)) return '';
    const direction = this.sortedColumn === header ? this.sortDirection : null;
    const type = this.columnTypes[header] || 'alpha';

    if (!direction) return 'fa fa-sort';
    if (type === 'numeric') {
      return direction === 'asc' ? 'fa fa-sort-numeric-asc' : 'fa fa-sort-numeric-desc';
    } else {
      return direction === 'asc' ? 'fa fa-sort-alpha-asc' : 'fa fa-sort-alpha-desc';
    }
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  get totalPages(): number {
    return Math.ceil(this.data.length / this.recordsPerPage);
  }
}
