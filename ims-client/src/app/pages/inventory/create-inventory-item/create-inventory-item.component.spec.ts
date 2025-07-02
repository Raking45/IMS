import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInventoryItemComponent } from './create-inventory-item.component';

describe('CreateInventoryItemComponent', () => {
  let component: CreateInventoryItemComponent;
  let fixture: ComponentFixture<CreateInventoryItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateInventoryItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateInventoryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
