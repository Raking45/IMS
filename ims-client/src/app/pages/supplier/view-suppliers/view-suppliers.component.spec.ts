import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ViewSuppliersComponent } from './view-suppliers.component';
import { ActivatedRoute } from '@angular/router';

describe('ViewSuppliersComponent', () => {
  let component: ViewSuppliersComponent;
  let fixture: ComponentFixture<ViewSuppliersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSuppliersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
