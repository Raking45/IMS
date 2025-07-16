import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../services/search-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-container">
      <input
        type="text"
        class="search-input"
        placeholder="Search..."
        [(ngModel)]="searchTerm"
        (input)="onSearchChange()"
        (focus)="showSuggestions = true"
        (blur)="hideSuggestionsWithDelay()" />

      <ul *ngIf="showSuggestions && filteredSuggestions.length" class="suggestions">
        <li *ngFor="let suggestion of filteredSuggestions" (mousedown)="selectSuggestion(suggestion)">
          {{ suggestion.display }}
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .search-container {
      position: relative;
      width: 100%;
    }

    .search-input {
      width: 100%;
      padding: 8px 12px;
      font-size: 1em;
    }

    .suggestions {
      position: absolute;
      z-index: 10;
      background-color: white;
      border: 1px solid #ccc;
      width: 100%;
      max-height: 200px;
      overflow-y: auto;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .suggestions li {
      padding: 8px;
      cursor: pointer;
    }

    .suggestions li:hover {
      background-color: #f0f0f0;
    }
  `]
})
export class SearchBarComponent {
  @Input() dataSource: any[] = [];
  @Input() displayFields: string[] = ['name'];
  @Output() search = new EventEmitter<string>();

  searchTerm: string = '';
  filteredSuggestions: any[] = [];
  showSuggestions = false;

  constructor(private searchService: SearchService, private router: Router) {}

  onSearchChange() {
  const query = this.searchTerm.trim();
  if (!query) {
    this.filteredSuggestions = [];
    return;
  }

  this.searchService.search(query).subscribe(results => {
    this.filteredSuggestions = results;
    this.searchService.updateSearchTerm(this.searchTerm);
  });
}

  onSearch() {
    this.search.emit(this.searchTerm.trim());
  }

  selectSuggestion(suggestion: any) {
    this.search.emit(suggestion);
    this.searchTerm = suggestion.display;
    this.filteredSuggestions = [];
    this.showSuggestions = false;

    // Navigate based on suggestion type
    switch (suggestion.type) {
      case 'inventory':
        this.router.navigate(['/reports/inventory/view-inventory-item-by-id'], { queryParams: { id: suggestion.invId } });
        break;
      case 'category':
        this.router.navigate(['/reports/categories/view-category-by-id'], { queryParams: { id: suggestion.categoryId } });
        break;
      case 'supplier':
        this.router.navigate(['/reports/suppliers/view-supplier-by-id'], { queryParams: { id: suggestion.supplierId } });
        break;
      default:
        console.warn('Unknown search result type', suggestion);
    }

    this.searchService.updateSearchTerm(this.searchTerm); // optional
  }

  hideSuggestionsWithDelay() {
    // Delay so click event can register before hiding suggestions
    setTimeout(() => {
      this.showSuggestions = false;
    }, 150);
  }
}

