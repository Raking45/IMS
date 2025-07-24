import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UpdateCategoryComponent } from './update-category.component';
import { environment } from '../../../../environments/environment';

describe('UpdateCategoryComponent', () => {
  let component: UpdateCategoryComponent;
  let fixture: ComponentFixture<UpdateCategoryComponent>;
  let httpMock: HttpTestingController;

  const mockCategories = [
    { _id: 'cat1', categoryId: 'C001', categoryName: 'Category 1', description: 'Desc 1' },
    { _id: 'cat2', categoryId: 'C002', categoryName: 'Category 2', description: 'Desc 2' }
  ];

  const singleCategory = mockCategories[0];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCategoryComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCategoryComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load selected category and build edit form onSelectCategory', fakeAsync(() => {
    fixture.detectChanges();

    // Flush initial categories load
    httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/categories/view`).flush(mockCategories);
    tick();

    component.onSelectCategory({ selectedId: 'cat1' });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/categories/view/cat1`);
    expect(req.request.method).toBe('GET');
    req.flush(singleCategory);
    tick();

    expect(component.selectedCategory).toEqual(singleCategory);
    expect(component.editForm.length).toBe(3);
    expect(component.editForm[0].value).toBe(singleCategory.categoryId);
  }));

  it('should do nothing onSelectCategory if no id provided', fakeAsync(() => {
    fixture.detectChanges();

    httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/categories/view`).flush(mockCategories);
    tick();

    component.onSelectCategory({ selectedId: '' });

    httpMock.expectNone(`${environment.apiBaseUrl}/api/reports/categories/view/`);
    expect(component.selectedCategory).toBeNull();
  }));

  it('should update category onSubmit and update selectedCategory on success', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/categories/view`).flush(mockCategories);
    tick();

    component.selectedCategory = singleCategory;
    const updatedForm = { categoryId: 'C001', categoryName: 'Updated Name', description: 'Updated Desc' };

    spyOn(window, 'alert');

    component.onSubmit(updatedForm);

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/categories/update/cat1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedForm);

    const updatedCategory = { ...singleCategory, ...updatedForm };
    req.flush(updatedCategory);
    tick();

    expect(component.selectedCategory.categoryName).toBe('Updated Name');
    expect(window.alert).toHaveBeenCalledWith('Category updated successfully.');
  }));

  it('should alert failure message if update API fails', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/categories/view`).flush(mockCategories);
    tick();

    component.selectedCategory = singleCategory;
    const updatedForm = { categoryId: 'C001', categoryName: 'Fail Name', description: 'Fail Desc' };

    spyOn(window, 'alert');

    component.onSubmit(updatedForm);

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/reports/categories/update/cat1`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
    tick();

    expect(window.alert).toHaveBeenCalledWith('Failed to update category.');
  }));

  it('should not call update API if selectedCategory is null', () => {
    spyOn(component['http'], 'put').and.callThrough();

    component.selectedCategory = null;
    component.onSubmit({ categoryId: 'C001' });

    expect(component['http'].put).not.toHaveBeenCalled();
  });
});
