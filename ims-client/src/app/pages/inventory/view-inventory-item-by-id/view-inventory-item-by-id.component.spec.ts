import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ViewInventoryItemByIdComponent } from './view-inventory-item-by-id.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { convertToParamMap } from '@angular/router';

describe('ViewInventoryItemByIdComponent', () => {
  let component: ViewInventoryItemByIdComponent;
  let fixture: ComponentFixture<ViewInventoryItemByIdComponent>;
  let httpMock: HttpTestingController;

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: (key: string) => 'inv2', // mock ID
      },
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ViewInventoryItemByIdComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: of(convertToParamMap({}))} },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInventoryItemByIdComponent);
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
