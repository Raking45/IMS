import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CreateCategoryComponent } from './create-category.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';

describe('CreateCategoryComponent', () => {
  let component: CreateCategoryComponent;
  let fixture: ComponentFixture<CreateCategoryComponent>;
  let httpMock: HttpTestingController;

  const endpoint = `${environment.apiBaseUrl}/api/reports/categories/create`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateCategoryComponent,
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of(convertToParamMap({}))
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCategoryComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should post form data and set success message', () => {
    const mockForm = {
      _id: 'cat001',
      categoryName: 'Electronics',
      description: 'Devices and gadgets'
    };

    component.onSubmit(mockForm);

    const req = httpMock.expectOne(endpoint);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockForm);

    req.flush({ message: 'Category created' });

    expect(component.message).toBe('Category created successfully!');
  });

  it('should handle 400 error response from backend', () => {
    const mockForm = {
      _id: '',
      categoryName: '',
      description: ''
    };

    component.onSubmit(mockForm);

    const req = httpMock.expectOne(endpoint);
    req.flush({}, { status: 400, statusText: 'Bad Request' });

    expect(component.message).toBe('Validation error. Please check your input.');
  });
});
