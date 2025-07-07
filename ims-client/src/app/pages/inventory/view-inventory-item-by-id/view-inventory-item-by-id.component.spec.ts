import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ViewInventoryItemByIdComponent } from './view-inventory-item-by-id.component';
import { environment } from '../../../../environments/environment';

describe('ViewInventoryItemByIdComponent', () => {
  let component: ViewInventoryItemByIdComponent;
  let fixture: ComponentFixture<ViewInventoryItemByIdComponent>;
  let httpMock: HttpTestingController;

  const mockInventoryList = [
    { _id: 'inv10', name: 'Monitor' },
    { _id: 'inv2', name: 'Mouse' },
    { _id: 'item001', name: 'Hidden Item' }, // should be filtered out
  ];

  const mockItemById = {
    _id: 'inv2',
    name: 'Mouse',
    description: 'Wireless Mouse',
    quantity: 50,
    price: 29.99,
    categoryId: 'CAT001',
    supplierId: 'SUP001',
    dateCreated: '2025-02-01T00:00:00.000Z',
    dateModified: '2025-02-05T00:00:00.000Z',
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ViewInventoryItemByIdComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInventoryItemByIdComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not update inventoryItems if no ID is selected', () => {
    component.onFormSubmit({ selectId: '' });
    expect(component.inventoryItems.length).toBe(0);
  });

  it('should not display <app-table> when inventoryItems is empty', () => {
    component.inventoryItems = [];
    fixture.detectChanges();
    const tableEl = fixture.nativeElement.querySelector('app-table');
    expect(tableEl).toBeNull();
  });

  it('should render <app-table> when inventoryItems is populated', () => {
    component.inventoryItems = [{
      Id: 'inv2',
      Name: 'Mouse',
      Description: 'Wireless Mouse',
      Quantity: 50,
      Price: 29.99,
      'Category Id': 'CAT001',
      'Supplier Id': 'SUP001',
      'Date Created': '2025-02-01T00:00:00.000Z',
      'Date Modified': '2025-02-05T00:00:00.000Z'
    }];
    fixture.detectChanges();
    const tableEl = fixture.nativeElement.querySelector('app-table');
    expect(tableEl).not.toBeNull();
  });
});