import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TableComponent } from '../../../shared/table/table.component';
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';
import { ActivatedRoute } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-view-category-by-id',
  standalone: true,
  imports: [CommonModule, FormComponent, TableComponent, HttpClientModule],
  template: `
    <div class="view-category-id-container">
      <h2 class="view-cat-header">View Category by Id</h2>
      <app-form
        *ngIf="formFields.length"
        [title]="'Search Category'"
        [submitLabel]="'Search'"
        [inputs]="formFields"
        (formSubmit)="onFormSubmit($event)">
      </app-form>

      <app-table
        *ngIf="categoryResult.length > 0"
        [title]="'Category Details'"
        [data]="categoryResult"
        [headers]="categoryHeaders"
        [headerBackground]="'default'">
      </app-table>
    </div>
  `,
  styles: [`
    .view-cat-header {
      text-align: center;
    }
  `]
})
export class ViewCategoryByIdComponent implements OnInit {
  categoryResult: any[] = [];
  formFields: FormInputConfig[] = [];
  allCategories: any[] = [];

  categoryHeaders = [
    'Id', 'Category Id', 'Category Name', 'Description', 'Date Created', 'Date Modified'
  ];

  private formReady$ = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadDropdownOptions();

    this.route.queryParamMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          if (!id) return of(null);
          return this.formReady$.pipe(
            filter(ready => ready),
            take(1),
            switchMap(() => {
              const match = this.formFields[0]?.options?.find(opt => opt.value === id);
              return match ? of(id) : of(null);
            })
          );
        })
      )
      .subscribe(id => {
        if (id) this.onFormSubmit({ selectId: id });
      });
  }

  loadDropdownOptions() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/reports/categories/view`).subscribe(data => {
      this.allCategories = data;

      const options = data
        .slice()
        .sort((a, b) => {
          const numA = parseInt(a._id.replace(/[^\d]/g, ''), 10);
          const numB = parseInt(b._id.replace(/[^\d]/g, ''), 10);
          return numA - numB;
        })
        .map(cat => ({
          label: `${cat._id} - ${cat.categoryName}`,
          value: cat._id
        }));

      this.formFields = [
        {
          label: 'Select Category',
          name: 'selectId',
          type: 'select',
          required: true,
          options,
          errorMessage: 'Please select a category.'
        }
      ];

      this.formReady$.next(true);
    });
  }

  onFormSubmit(formValue: any) {
    const id = formValue.selectId;
    if (!id) return;

    this.http.get<any>(`${environment.apiBaseUrl}/api/reports/categories/view/${id}`).subscribe(category => {
      const transformed = {
        'Id': category._id,
        'Category Id': category.categoryId,
        'Category Name': category.categoryName,
        'Description': category.description,
        'Date Created': category.dateCreated,
        'Date Modified': category.dateModified
      };
      this.categoryResult = [transformed];
    });
  }
}

