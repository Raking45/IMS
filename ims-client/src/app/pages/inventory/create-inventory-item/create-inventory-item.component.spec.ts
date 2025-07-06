// src/app/pages/inventory/create-inventory-item/create-inventory-item.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateInventoryItemComponent } from './create-inventory-item.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';

describe('CreateInventoryItemComponent', () => {
  let component: CreateInventoryItemComponent;
  let fixture: ComponentFixture<CreateInventoryItemComponent>;
  let httpMock: HttpTestingController;

  const endpoint = `${environment.apiBaseUrl}/api/reports/inventory/create`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInventoryItemComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateInventoryItemComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formFields correctly', () => {
    expect(component.formFields.length).toBe(7);
    const qtyField = component.formFields.find(f => f.name === 'quantity');
    expect(qtyField?.type).toBe('number');
    expect(component.formFields.find(f => f.name === 'description')?.type).toBe('textarea');
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

    component.handleSubmit(mockForm);

    const req = httpMock.expectOne(endpoint);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      ...mockForm,
      quantity: 10,
      price: 15.5
    });

    req.flush({ message: 'Created' });
    expect(component.message).toBe(`✅ "${mockForm.name}" has been added to the inventory.`);
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

    component.handleSubmit(mockForm);

    const req = httpMock.expectOne(endpoint);
    req.flush({}, { status: 409, statusText: 'Conflict' });

    expect(component.message).toBe(`⚠️ An item with ID "${mockForm._id}" or name "${mockForm.name}" already exists.`);
  });

  it('should show error message on HTTP failure (400)', () => {
    const mockForm = {
      _id: 'item003',
      name: 'Bad Data',
      description: '',
      quantity: '',
      price: '',
      categoryId: '',
      supplierId: ''
    };

    component.handleSubmit(mockForm);

    const req = httpMock.expectOne(endpoint);
    req.flush({}, { status: 400, statusText: 'Bad Request' });

    expect(component.message).toBe('⚠️ Missing or invalid fields. Please review the form.');
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

    component.handleSubmit(mockForm);

    const req = httpMock.expectOne(endpoint);
    req.flush({}, { status: 500, statusText: 'Internal Server Error' });

    expect(component.message).toBe('❌ Something went wrong. Please try again.');
  });
});
