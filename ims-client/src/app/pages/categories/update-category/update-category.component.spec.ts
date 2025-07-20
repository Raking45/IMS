import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UpdateCategoryComponent } from './update-category.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('UpdateCategoryComponent', () => {
  let component: UpdateCategoryComponent;
  let fixture: ComponentFixture<UpdateCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UpdateCategoryComponent,
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
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
