import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateInventoryItemComponent } from './create-inventory-item.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CreateInventoryItemComponent', () => {
  let component: CreateInventoryItemComponent;
  let fixture: ComponentFixture<CreateInventoryItemComponent>;
  let httpMock: HttpTestingController;

  const endpoint = `${environment.apiBaseUrl}/api/reports/inventory/create-inventory`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInventoryItemComponent, HttpClientTestingModule],
      providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: '123' }), // mock route params
          snapshot: {
            data: {},
            paramMap: {
              get: () => '123',
            },
          },
        },
      },
    ], 
    }).compileComponents();

    fixture = TestBed.createComponent(CreateInventoryItemComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Ensure all requests were handled
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should post converted payload and set success message', () => {
    const mockForm = {
      _id: 'item001',
      name: 'New Item',
      description: 'Sample',
      quantity: '10',
      price: '15.5',
      categoryId: 'cat001',
      supplierId: 'sup001'
    };

    component.onSubmit(mockForm);

    const req = httpMock.expectOne(endpoint);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      ...mockForm,
      quantity: 10,
      price: 15.5
    });

    req.flush({ message: 'Created' });

    expect(component.message).toBe('Inventory item created successfully!');

  });

  it('should show error message on HTTP failure (409)', () => {
    const mockForm = {
      _id: 'item002',
      name: 'Error Item',
      description: '',
      quantity: '5',
      price: '12.0',
      categoryId: 'cat002',
      supplierId: 'sup002'
    };

    component.onSubmit(mockForm);

    const req = httpMock.expectOne(endpoint);
    req.flush({}, { status: 409, statusText: 'Conflict' });


    expect(component.message).toBe(`Duplicate item ID. Please use a unique ID.`);
  });

  it('should show error message on HTTP failure (400)', () => {
    const mockForm = {
      _id: 'item002',
      name: 'Bad Data',
      description: '',
      quantity: '',
      price: '',
      categoryId: '',
      supplierId: ''
    };

    component.onSubmit(mockForm);

    const req = httpMock.expectOne(endpoint);
    req.flush({}, { status: 400, statusText: 'Bad Request' });

    expect(component.message).toBe('Validation error. Please check your input.');
  });

  it('should show fallback error message for unknown error', () => {
    const mockForm = {
      _id: 'item004',
      name: 'Server Crash',
      description: 'Causes 500',
      quantity: '1',
      price: '99.99',
      categoryId: 'catX',
      supplierId: 'supX'
    };

    component.onSubmit(mockForm);

    const req = httpMock.expectOne(endpoint);
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });


    expect(component.message).toBe('Failed to create inventory item.');
  });
});
