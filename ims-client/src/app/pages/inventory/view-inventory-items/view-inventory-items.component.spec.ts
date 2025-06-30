import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInventoryItemsComponent } from './view-inventory-items.component';

describe('ViewInventoryItemsComponent', () => {
  let component: ViewInventoryItemsComponent;
  let fixture: ComponentFixture<ViewInventoryItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInventoryItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewInventoryItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
