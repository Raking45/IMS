// src/app/pages/inventory/delete-inventory-item/delete-inventory-item.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteInventoryItemComponent } from './delete-inventory-item.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';

describe('DeleteInventoryItemComponent', () => {
  let component: DeleteInventoryItemComponent;
  let fixture: ComponentFixture<DeleteInventoryItemComponent>;
  let httpMock: HttpTestingController;

  const id = 'item123';
  const endpoint = `${environment.apiBaseUrl}/api/reports/inventory/delete/${id}`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteInventoryItemComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteInventoryItemComponent);
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

  it('should send DELETE request and set success message', () => {
    component.handleDelete({ _id: id });

    const req = httpMock.expectOne(endpoint);
    expect(req.request.method).toBe('DELETE');

    // simulate successful delete
    req.flush(null);

    expect(component.error).toBeFalse();
    expect(component.message).toBe(`Inventory item “${id}” deleted successfully!`);
  });

  it('should show error message on HTTP failure', () => {
    component.handleDelete({ _id: id });

    const req = httpMock.expectOne(endpoint);
    expect(req.request.method).toBe('DELETE');

    // simulate network error
    req.error(new ErrorEvent('Network error'));

    expect(component.error).toBeTrue();
    expect(component.message).toBe(`Failed to delete inventory item “${id}.”`);
  });
});
