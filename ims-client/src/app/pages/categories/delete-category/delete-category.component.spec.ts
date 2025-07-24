import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DeleteCategoryComponent } from './delete-category.component';
import { environment } from '../../../../environments/environment';

describe('DeleteCategoryComponent', () => {
  let component: DeleteCategoryComponent;
  let fixture: ComponentFixture<DeleteCategoryComponent>;
  let httpMock: HttpTestingController;

  const apiBase = environment.apiBaseUrl;

  const mockCategoryList = [
    { _id: 'cat1', categoryId: 'C001', categoryName: 'Electronics', description: 'Devices and gadgets' },
    { _id: 'cat2', categoryId: 'C002', categoryName: 'Books', description: 'Printed and digital books' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteCategoryComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteCategoryComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(`${apiBase}/api/reports/categories/view`);
    req.flush(mockCategoryList);

    expect(component).toBeTruthy();
  });

  it('should populate selectionForm on loadCategories', fakeAsync(() => {
    fixture.detectChanges();

    const req = httpMock.expectOne(`${apiBase}/api/reports/categories/view`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategoryList);
    tick();

    expect(component.selectionForm.length).toBe(1);
    expect(component.selectionForm[0].options?.length).toBe(mockCategoryList.length);
  }));

  it('should load selected category and build delete form', fakeAsync(() => {
    fixture.detectChanges();

    httpMock.expectOne(`${apiBase}/api/reports/categories/view`).flush(mockCategoryList);
    tick();

    const selectedId = 'cat1';
    component.onSelectCategory({ selectedId });

    const req = httpMock.expectOne(`${apiBase}/api/reports/categories/view/${selectedId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategoryList[0]);
    tick();

    expect(component.selectedCategory).toEqual(mockCategoryList[0]);
    expect(component.deleteForm.length).toBe(3);
    expect(component.deleteForm[0].value).toBe('C001');
  }));

  it('should send DELETE request and reset state on success', fakeAsync(() => {
    fixture.detectChanges();

    httpMock.expectOne(`${apiBase}/api/reports/categories/view`).flush(mockCategoryList);
    tick();

    component.selectedCategory = mockCategoryList[0];
    component.deleteForm = [{} as any]; // mock populated form
    component.onDeleteCategory();

    const deleteReq = httpMock.expectOne(`${apiBase}/api/reports/categories/delete/cat1`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({});
    tick();

    const reloadReq = httpMock.expectOne(`${apiBase}/api/reports/categories/view`);
    reloadReq.flush(mockCategoryList);
    tick();

    expect(component.message).toContain('deleted successfully');
    expect(component.error).toBeFalse();
    expect(component.selectedCategory).toBeNull();
    expect(component.deleteForm.length).toBe(0);
  }));

  it('should handle error on delete failure', fakeAsync(() => {
    fixture.detectChanges();

    httpMock.expectOne(`${apiBase}/api/reports/categories/view`).flush(mockCategoryList);
    tick();

    component.selectedCategory = mockCategoryList[0];
    component.onDeleteCategory();

    const deleteReq = httpMock.expectOne(`${apiBase}/api/reports/categories/delete/cat1`);
    deleteReq.flush({}, { status: 500, statusText: 'Internal Server Error' });
    tick();

    expect(component.message).toContain('Failed to delete category');
    expect(component.error).toBeTrue();
  }));
});
