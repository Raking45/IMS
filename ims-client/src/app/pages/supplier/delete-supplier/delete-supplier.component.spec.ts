import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DeleteSupplierComponent } from './delete-supplier.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('DeleteSupplierComponent', () => {
  let component: DeleteSupplierComponent;
  let fixture: ComponentFixture<DeleteSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DeleteSupplierComponent,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({})),
            paramMap: of(convertToParamMap({})),
            snapshot: { queryParamMap: convertToParamMap({}) }
          }
        }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

