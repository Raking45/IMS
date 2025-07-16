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
  selector: 'app-view-supplier-by-id',
  standalone: true,
  imports: [CommonModule, FormComponent, TableComponent, HttpClientModule],
  template: `
    <div class="view-supplier-id-container">
      <h2 class="view-supplier-header">View Supplier by Id</h2>
      <app-form
        *ngIf="formFields.length"
        [title]="'Search Supplier'"
        [submitLabel]="'Search'"
        [inputs]="formFields"
        (formSubmit)="onFormSubmit($event)">
      </app-form>

      <app-table
        *ngIf="supplierResult.length > 0"
        [title]="'Supplier Details'"
        [data]="supplierResult"
        [headers]="supplierHeaders"
        [sortableColumns]="['Supplier Name', 'Contact Info']"
        [columnTypes]="{ 'Supplier Name': 'alpha', 'Contact Info': 'alpha' }"
        [headerBackground]="'default'">
      </app-table>
    </div>
  `,
  styles: [`
    .view-supplier-header {
      text-align: center;
    }
  `]
})
export class ViewSupplierByIdComponent implements OnInit {
  supplierResult: any[] = [];
  formFields: FormInputConfig[] = [];
  allSuppliers: any[] = [];
  supplierHeaders = [
    'ID', 'Supplier ID', 'Supplier Name', 'Contact Info', 'Address', 'Date Created', 'Date Modified'
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
    this.http.get<any[]>(`${environment.apiBaseUrl}/api/reports/suppliers/view`).subscribe(data => {
      this.allSuppliers = data;

      const options = data.map(supplier => ({
        label: `${supplier._id} - ${supplier.supplierName}`,
        value: supplier._id
      }));

      this.formFields = [
        {
          label: 'Select Supplier',
          name: 'selectId',
          type: 'select',
          required: true,
          options,
          errorMessage: 'Please select a supplier.'
        }
      ];

      this.formReady$.next(true);
    });
  }

  onFormSubmit(formValue: any) {
    const id = formValue.selectId;
    if (!id) return;

    this.http.get<any>(`${environment.apiBaseUrl}/api/reports/suppliers/view/${id}`).subscribe(supplier => {
      const transformed = {
        'ID': supplier._id,
        'Supplier ID': supplier.supplierId,
        'Supplier Name': supplier.supplierName,
        'Contact Info': supplier.contactInformation,
        'Address': supplier.address,
        'Date Created': supplier.dateCreated,
        'Date Modified': supplier.dateModified
      };
      this.supplierResult = [transformed];
    });
  }
}
