import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CreateCategoryComponent } from './create-category.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

describe('CreateCategoryComponent', () => {
  let component: CreateCategoryComponent;
  let fixture: ComponentFixture<CreateCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateCategoryComponent,
        HttpClientTestingModule  
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: of(convertToParamMap({})) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

