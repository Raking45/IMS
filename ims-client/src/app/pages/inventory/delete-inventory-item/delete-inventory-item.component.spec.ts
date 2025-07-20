// src/app/pages/inventory/delete-inventory-item/delete-inventory-item.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UpdateInventoryItemComponent } from '../update-inventory-item/update-inventory-item.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';

describe('UpdateInventoryItemComponent', () => {
  let fixture: ComponentFixture<UpdateInventoryItemComponent>;
  let component: UpdateInventoryItemComponent;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockItems = [
    { _id: 'a1', name: 'Item A', description: 'Desc A', quantity: 10, price: 1.23 },
    { _id: 'b2', name: 'Item B', description: 'Desc B', quantity: 20, price: 4.56 }
  ];

   beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [ UpdateInventoryItemComponent, HttpClientTestingModule, FormsModule ],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateInventoryItemComponent);
    component = fixture.componentInstance;
    httpMock  = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create and load items on init', fakeAsync(() => {
    fixture.detectChanges();  // ngOnInit → GET /view
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/inventory/view`);
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);
    tick();

    expect(component).toBeTruthy();
    expect(component.inventoryList).toEqual(mockItems);
  }));

  it('should populate selectedItem when an id is chosen', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/inventory/view`).flush(mockItems);
    tick();

    // Corrected method call with expected formValue object
    component.onSelectItem({ selectedId: 'b2' });
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/inventory/view/b2`);
    expect(req.request.method).toBe('GET');
    req.flush(mockItems[1]);
    tick();

    expect(component.selectedItem).toEqual(mockItems[1]);
  }));

  it('should PUT update and navigate on success', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/inventory/view`).flush(mockItems);
    tick();

    component.selectedItem = { ...mockItems[0] };
    component.onSubmit({ name: 'Updated Name', description: 'Updated Desc', quantity: 15, price: 2.34 });

    const putReq = httpMock.expectOne(
      `${environment.apiBaseUrl}/api/reports/inventory/update/${mockItems[0]._id}`
    );
    expect(putReq.request.method).toBe('PUT');
    expect(putReq.request.body.name).toBe('Updated Name');
    putReq.flush(mockItems[0]);
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/inventory']);
  }));

  it('should alert on update failure', fakeAsync(() => {
    spyOn(window, 'alert');
    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/inventory/view`).flush(mockItems);
    tick();

    component.selectedItem = { ...mockItems[0] };
    component.onSubmit({ name: 'Fail Name', description: 'Fail Desc', quantity: 0, price: 0 });

    const putReq = httpMock.expectOne(
      `${environment.apiBaseUrl}/api/reports/inventory/update/${mockItems[0]._id}`
    );
    putReq.flush('Update failed', { status: 500, statusText: 'Server Error' });
    tick();

    expect(window.alert).toHaveBeenCalledWith('Failed to update item.');
  }));
});