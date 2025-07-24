import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UpdateInventoryItemComponent } from './update-inventory-item.component';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

describe('UpdateInventoryItemComponent', () => {
  let component: UpdateInventoryItemComponent;
  let fixture: ComponentFixture<UpdateInventoryItemComponent>;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockInventoryList = [
    { _id: 'abc123', name: 'Item A', description: 'Desc A', quantity: 10, price: 5 },
    { _id: 'def456', name: 'Item B', description: 'Desc B', quantity: 20, price: 15 }
  ];

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UpdateInventoryItemComponent],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateInventoryItemComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensure all expected requests are handled
  });

  it('should create the component', fakeAsync(() => {
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/inventory/view`);
    req.flush(mockInventoryList);
    tick();

    expect(component).toBeTruthy();
  }));

  it('should load selected item and build edit form', fakeAsync(() => {
    fixture.detectChanges();

    httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/inventory/view`).flush(mockInventoryList);
    tick();

    component.onSelectItem({ selectedId: 'abc123' });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/inventory/view/abc123`);
    req.flush(mockInventoryList[0]);
    tick();

    expect(component.selectedItem).toEqual(mockInventoryList[0]);
    expect(component.editForm.length).toBeGreaterThan(0);
  }));

  it('should not call API in onSelectItem if no ID provided', fakeAsync(() => {
    fixture.detectChanges();

    httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/inventory/view`).flush(mockInventoryList);
    tick();

    component.onSelectItem({ selectedId: '' });

    httpMock.expectNone(`${environment.apiBaseUrl}/api/reports/inventory/view/`);

    expect(component.selectedItem).toBeNull();
  }));

  it('should send PUT request on form submission and update selectedItem', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/inventory/view`).flush(mockInventoryList);
    tick();

    component.selectedItem = { _id: 'abc123', name: '', description: '', quantity: 0, price: 0 };
    const updatedForm = { name: 'New Name', description: 'Updated', quantity: 5, price: 10 };

    component.onSubmit(updatedForm);

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/inventory/update/abc123`);
    expect(req.request.method).toBe('PUT');
    req.flush({ ...component.selectedItem, ...updatedForm });
    tick();

    expect(component.selectedItem.name).toBe('New Name');
  }));

  it('should PUT update and navigate on success', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/inventory/view`).flush(mockInventoryList);
    tick();

    component.selectedItem = { _id: 'abc123', name: '', description: '', quantity: 0, price: 0 };
    const updatedForm = { name: 'Updated Name', description: 'Updated Desc', quantity: 10, price: 100 };

    component.onSubmit(updatedForm);

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/inventory/update/abc123`);
    req.flush({ ...component.selectedItem, ...updatedForm });
    tick();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/inventory']);
  }));
});
