import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewSuppliersComponent } from './view-suppliers.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

describe('ViewSuppliersComponent', () => {
  let component: ViewSuppliersComponent;
  let fixture: ComponentFixture<ViewSuppliersComponent>;
  let httpMock: HttpTestingController;

  const endpoint = `${environment.apiBaseUrl}/api/reports/suppliers/view`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSuppliersComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            snapshot: {
              data: {},
              paramMap: {
                get: () => null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewSuppliersComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges(); // triggers ngOnInit
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should not render <app-table> if suppliers array is empty', () => {
    component.suppliers = [];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-table')).toBeNull();
  });

  it('should render <app-table> when suppliers are loaded', () => {
    component.suppliers = [
      { _id: '1', supplierName: 'Test Supplier', contactInformation: 'info@test.com', address: '123 Test St' }
    ];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-table')).not.toBeNull();
  });

  it('should define correct supplier headers', () => {
    expect(component.supplierHeaders).toEqual(['_id', 'supplierName', 'contactInformation', 'address']);
  });
});
