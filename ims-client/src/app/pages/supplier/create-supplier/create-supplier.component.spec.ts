import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateSupplierComponent } from './create-supplier.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

describe('CreateSupplierComponent', () => {
  let component: CreateSupplierComponent;
  let fixture: ComponentFixture<CreateSupplierComponent>;
  let httpMock: HttpTestingController;

  const endpoint = `${environment.apiBaseUrl}/api/reports/suppliers/create`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSupplierComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: {
              data: {},
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSupplierComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have 5 form fields with correct configuration', () => {
    expect(component.formFields.length).toBe(5);
    expect(component.formFields[0].name).toBe('_id');
    expect(component.formFields[2].label).toBe('Supplier Name');
  });

  it('should set success message on successful form submission', () => {
    const mockForm = {
      _id: 'sup10',
      supplierId: 'SUP010',
      supplierName: 'Nova Supplies',
      contactInformation: 'nova@supplies.com',
      address: '123 Space Rd'
    };

    component.onSubmit(mockForm);

    const req = httpMock.expectOne(endpoint);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockForm);

    req.flush({ message: 'Created' });

    expect(component.message).toBe('Supplier created successfully!');
  });

  it('should handle 400 error with validation message', () => {
    component.onSubmit({});

    const req = httpMock.expectOne(endpoint);
    req.flush({}, { status: 400, statusText: 'Bad Request' });

    expect(component.message).toBe('Validation error. Please check your input.');
  });

  it('should handle 409 error with duplicate message', () => {
    const duplicateData = {
      _id: 'sup01',
      supplierId: 'SUP001',
      supplierName: 'Dup Supplier'
    };

    component.onSubmit(duplicateData);

    const req = httpMock.expectOne(endpoint);
    req.flush({}, { status: 409, statusText: 'Conflict' });

    expect(component.message).toBe('Duplicate supplier name or ID. Please use a unique value.');
  });

  it('should handle unknown errors with fallback message', () => {
    component.onSubmit({});

    const req = httpMock.expectOne(endpoint);
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });

    expect(component.message).toBe('Failed to create supplier.');
  });
});
