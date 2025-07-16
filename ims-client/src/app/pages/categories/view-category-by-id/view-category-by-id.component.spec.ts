import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ViewCategoryByIdComponent } from '../view-category-by-id/view-category-by-id.component';

describe('ViewCategoryByIdComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ViewCategoryByIdComponent,  // standalone component
        RouterTestingModule          // provides ActivatedRoute and Router mocks
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),
            queryParamMap: of({
              get: (key: string) => 'someValue',
            }),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ViewCategoryByIdComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});

