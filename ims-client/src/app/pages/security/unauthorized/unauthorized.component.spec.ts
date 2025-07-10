import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnauthorizedComponent } from './unauthorized.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let fixture: ComponentFixture<UnauthorizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthorizedComponent, HttpClientTestingModule],
      providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: '123' }), // mock route params
          snapshot: {
            data: {},
            paramMap: {
              get: () => '123',
            },
          },
        },
      },
    ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

