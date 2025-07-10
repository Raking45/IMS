// src/app/pages/inventory/delete-inventory-item/delete-inventory-item.component.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteInventoryItemComponent } from './delete-inventory-item.component';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormComponent } from '../../../shared/form/form.component';

describe('DeleteInventoryItemComponent', () => {
  let fixture: ComponentFixture<DeleteInventoryItemComponent>;
  let component: DeleteInventoryItemComponent;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  const testId  = 'item123';
  const fullUrl = `http://localhost:3000/api/reports/inventory/delete/${testId}`;

  beforeEach(async () => {
    // create a spy for HttpClient.delete
    httpSpy = jasmine.createSpyObj('HttpClient', ['delete']);

    await TestBed.configureTestingModule({
      imports: [
        // register your standalone component
        DeleteInventoryItemComponent
      ],
      providers: [
        // override HttpClient with our spy
        { provide: HttpClient, useValue: httpSpy }
      ]
    })
    // remove the real HttpClientModule (and the FormComponent’s deps) by overriding
    .overrideComponent(DeleteInventoryItemComponent, {
      set: {
        imports: [
          CommonModule,
          FormComponent
          // no HttpClientModule here! we get HttpClient from the spy above
        ]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteInventoryItemComponent);
    component = fixture.componentInstance;
  });

  it('should send DELETE request and show success message', () => {
    httpSpy.delete.and.returnValue(of(void 0));  // simulate 200 OK

    component.handleDelete({ _id: testId });

    expect(httpSpy.delete).toHaveBeenCalledWith(fullUrl);
    expect(component.error).toBeFalse();
    expect(component.message)
      .toBe(`Inventory item “${testId}” deleted successfully!`);
  });

  it('should show error message on DELETE failure', () => {
    httpSpy.delete.and.returnValue(throwError(() => new Error('Network error')));

    component.handleDelete({ _id: testId });

    expect(httpSpy.delete).toHaveBeenCalledWith(fullUrl);
    expect(component.error).toBeTrue();
    expect(component.message)
      .toBe(`Failed to delete inventory item “${testId}.”`);
  });
});
