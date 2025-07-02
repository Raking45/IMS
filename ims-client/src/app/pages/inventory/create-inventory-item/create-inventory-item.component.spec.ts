// src/app/pages/inventory/create-inventory-item/create-inventory-item.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { CreateInventoryItemComponent } from './create-inventory-item.component';

describe('CreateInventoryItemComponent', () => {
  let component: CreateInventoryItemComponent;
  let fixture: ComponentFixture<CreateInventoryItemComponent>;

  // Hard-coded to match exactly what handleSubmit() builds
  const endpoint = 'http://localhost:3000/api/reports/inventory/create';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInventoryItemComponent, HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateInventoryItemComponent);
    component = fixture.componentInstance;
  });

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
    // 1) Spy on the component's own HttpClient instance
    const httpPostSpy = spyOn((component as any).http, 'post')
      .and.returnValue(of({ message: 'Created' }));
    
    // 2) Prepare form data (strings come from the form)
    const mockForm = {
      _id: 'item001',
      name: 'New Item',
      description: 'Sample',
      quantity: '10',
      price: '15.5',
      categoryId: 'cat001',
      supplierId: 'sup001'
    };

    // 3) Call the method under test
    component.handleSubmit(mockForm);

    // 4) Verify the HTTP call with converted numeric payload
    expect(httpPostSpy).toHaveBeenCalledWith(endpoint, {
      ...mockForm,
      quantity: 10,
      price: 15.5
    });

    // 5) Verify that the success path set the message
    expect(component.message).toBe('Inventory item created successfully!');
  });

  it('should show error message on HTTP failure', () => {
    // 1) Spy to force an error from HttpClient.post()
    const httpPostSpy = spyOn((component as any).http, 'post')
      .and.returnValue(throwError(() => new Error('Network error')));
    
    // 2) Prepare form data
    const mockForm = {
      _id: 'item002',
      name: 'Error Item',
      description: '',
      quantity: '5',
      price: '12.0',
      categoryId: 'cat002',
      supplierId: 'sup002'
    };

    // 3) Call the method under test
    component.handleSubmit(mockForm);

    // 4) Ensure the HTTP call was still attempted with correct payload
    expect(httpPostSpy).toHaveBeenCalledWith(endpoint, {
      ...mockForm,
      quantity: 5,
      price: 12
    });

    // 5) Verify that the error path set the message
    expect(component.message).toBe('Failed to create inventory item.');
  });
});
