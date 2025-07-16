import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SearchService {
  constructor(private http: HttpClient) {}

  search(query: string) {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/api/search?q=${encodeURIComponent(query)}`);
  }

  // Optionally keep latest search term
  private currentTerm = '';
  updateSearchTerm(term: string) {
    this.currentTerm = term;
  }

  getSearchTerm() {
    return this.currentTerm;
  }
}
