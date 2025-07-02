import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ViewInventoryItemsComponent } from './view-inventory-items.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';

describe('ViewInventoryItemsComponent', () => {
  let component: ViewInventoryItemsComponent;
  let fixture: ComponentFixture<ViewInventoryItemsComponent>;
  let httpMock: HttpTestingController;

  // The data you gave, shortened to 2 items for brevity here
  const mockInventoryData = [
    {
      _id: 'inv1',
      categoryId: 'CAT001',
      supplierId: 'SUP001',
      name: 'Wireless Mouse',
      description: 'Ergonomic wireless mouse',
      quantity: 150,
      price: 25.99,
      dateCreated: '2025-02-01T09:00:00.000Z',
      dateModified: '2025-02-10T10:00:00.000Z',
    },
    {
      _id: 'inv2',
      categoryId: 'CAT002',
      supplierId: 'SUP002',
      name: 'Office Chair',
      description: 'Adjustable ergonomic chair',
      quantity: 80,
      price: 139.99,
      dateCreated: '2025-02-02T09:00:00.000Z',
      dateModified: '2025-02-11T10:00:00.000Z',
    }
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ViewInventoryItemsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInventoryItemsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should render <app-table> only when inventoryItems length > 0', () => {
  // Initially empty inventoryItems - no <app-table>
  component.inventoryItems = [];
  fixture.detectChanges();
  let tableEl = fixture.nativeElement.querySelector('app-table');
  expect(tableEl).toBeNull();

  // Set inventoryItems to non-empty array - should render <app-table>
  component.inventoryItems = [{ Id: 'test', Name: 'Item 1' }];
  fixture.detectChanges();
  tableEl = fixture.nativeElement.querySelector('app-table');
  expect(tableEl).not.toBeNull();
});

  it('should initialize with empty inventoryItems and correct headers', () => {
  expect(component.inventoryItems).toEqual([]);
  expect(component.inventoryHeaders).toEqual([
    'Id', 'Name', 'Description', 'Quantity', 'Price', 'Category Id', 'Supplier Id', 'Date Created', 'Date Modified'
  ]);
});


  it('should display the app-table component only if inventoryItems is not empty', () => {
    // Case 1: empty inventoryItems → app-table should NOT render
    component.inventoryItems = [];
    fixture.detectChanges();
    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-table')).toBeNull();

    // Case 2: with data → app-table should render
    component.inventoryItems = [
      { Id: 'inv1', Name: 'Item 1', Description: 'desc', Quantity: 1, Price: 1 }
    ];
    fixture.detectChanges();
    compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-table')).not.toBeNull();
  });

});
