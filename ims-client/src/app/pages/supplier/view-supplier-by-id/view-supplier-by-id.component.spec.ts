import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ViewCategoryByIdComponent } from '../../categories/view-category-by-id/view-category-by-id.component';

describe('ViewCategoryByIdComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // For standalone components, import them here
      imports: [ViewCategoryByIdComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: of({
              get: (key: string) => 'someValue',
            }),
            params: of({ id: '123' }),
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


