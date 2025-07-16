import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../services/search-service.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let mockSearchService: jasmine.SpyObj<SearchService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockResults = [
    { display: 'Wireless Mouse', type: 'inventory', invId: 'inv1' },
    { display: 'Office Chair', type: 'inventory', invId: 'inv2' },
  ];

  beforeEach(async () => {
    mockSearchService = jasmine.createSpyObj('SearchService', ['search', 'updateSearchTerm']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, SearchBarComponent],
      providers: [
        { provide: SearchService, useValue: mockSearchService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not call search service if searchTerm is empty or whitespace', () => {
    component.searchTerm = '   ';
    component.onSearchChange();
    expect(mockSearchService.search).not.toHaveBeenCalled();
    expect(component.filteredSuggestions).toEqual([]);
  });

  it('should call search service and update suggestions', () => {
    component.searchTerm = 'mouse';
    mockSearchService.search.and.returnValue(of(mockResults));

    component.onSearchChange();

    expect(mockSearchService.search).toHaveBeenCalledWith('mouse');
    expect(component.filteredSuggestions.length).toBe(2);
    expect(component.filteredSuggestions[0].display).toBe('Wireless Mouse');
  });

  it('should emit trimmed search term on onSearch()', () => {
    const emitSpy = spyOn(component.search, 'emit');
    component.searchTerm = '   category name   ';
    component.onSearch();
    expect(emitSpy).toHaveBeenCalledWith('category name');
  });

  it('should hide suggestions after blur with delay', fakeAsync(() => {
    component.showSuggestions = true;
    component.hideSuggestionsWithDelay();
    tick(150);
    expect(component.showSuggestions).toBeFalse();
  }));
});
