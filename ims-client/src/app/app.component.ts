import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SearchService } from './shared/services/search-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <router-outlet />
  `,
  styles: `
  `
})
export class AppComponent {
  constructor(public searchService: SearchService) {}
}
