import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
  <div class="app">
    <!-- Sidebar Navigation -->
    <nav class="app-side-menu">
      <div class="app-side-menu-header">
        <h2 class="app-side-menu-title">{{ title }}</h2>
      </div>

      <!-- Static Navigation Links -->
      <a class="app-side-menu-link" routerLink="/">Dashboard</a>
      
      <!-- Collapsible Section: Category Reports -->
      <div class="app-side-menu-section" (click)="toggleSection($event, 'categoryReports')">
        <div class="app-side-menu-link">Categories</div>
        @if (sections.categoryReports) {
          <div class="app-side-menu-sub-links">
            @for (link of categoryReports; track link) {
              <a class="app-side-menu-link app-side-menu-sub-link" [routerLink]="link.url">{{ link.name }}</a>
            }
          </div>
        }
      </div>

      <!-- Collapsible Section: Inventory Reports -->
      <div class="app-side-menu-section" (click)="toggleSection($event, 'inventoryReports')">
        <div class="app-side-menu-link">Inventory</div>
        @if (sections.inventoryReports) {
          <div class="app-side-menu-sub-links">
            @for (link of inventoryReports; track link) {
              <a class="app-side-menu-link app-side-menu-sub-link" [routerLink]="link.url">{{ link.name }}</a>
            }
          </div>
        }
      </div>

      <!-- Collapsible Section: Supplier Reports -->
      <div class="app-side-menu-section" (click)="toggleSection($event, 'supplierReports')">
        <div class="app-side-menu-link">Supplier</div>
        @if (sections.supplierReports) {
          <div class="app-side-menu-sub-links">
            @for (link of supplierReports; track link) {
              <a class="app-side-menu-link app-side-menu-sub-link" [routerLink]="link.url">{{ link.name }}</a>
            }
          </div>
        }
      </div>

      <!-- Admin-only: User Management Section -->
      @if (sessionUser.role === 'admin') {
        <div class="app-side-menu-section" (click)="toggleSection($event, 'userManagement')">
        <div class="app-side-menu-link">User Management</div>
        @if (sections.userManagement) {
          <div class="app-side-menu-sub-links">
            @for (link of userManagement; track link) {
              <a class="app-side-menu-link app-side-menu-sub-link" [routerLink]="link.url">{{ link.name }}</a>
            }
          </div>
        }
      </div>
      }
    </nav>

    <!-- Main Content Wrapper -->
    <div class="app-main-content">
      <header class="app-header">
        <div class="app-header-content">
          <div class="app-header-title">Inventory Management System</div>

          <!-- User Profile Dropdown -->
          <div class="app-user-profile" (click)="toggleDropdown()">
            <div class="app-user-avatar">{{ userInitial }}</div>
            <div class="app-user-arrow" [class.up]="dropdownVisible">&#9660;</div>
            <div class="app-user-dropdown" [class.show]="dropdownVisible">
              <span>Welcome {{ sessionUser.username }}!</span>
              <hr class="lighter-hr" />

              @if (sessionUser.role === 'admin') {
                <a class="app-user-dropdown-link" routerLink="/demo">Styling Demo</a>
              }

              <a class="app-user-dropdown-link" (click)="signout();">Sign Out</a>
            </div>
          </div>
        </div>
      </header>

      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>

    <!-- Footer -->
    <footer class="app-footer">
      &copy; 2025 Inventory Management System by Team Apollo
      <!--<p><strong>Server message:</strong> {{ serverMessage }}</p>-->
    </footer>
  </div>
  `,
  styles: [`
    .app {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      font-family: 'Poppins', sans-serif;
      background-color: var(--background-color);
      color: var(--text-primary);
    }

    .app-side-menu {
      width: 250px;
      background-color: var(--primary-dark);
      color: var(--text-white);
      height: 100vh;
      position: fixed;
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
    }

    .app-side-menu-header {
      background-color: var(--primary-dark);
      padding: 20px;
      border-bottom: 1px solid var(--border-color);
    }

    .app-side-menu-title {
      margin: 0;
      color: var(--accent-color);
      font-family: 'Rubik', sans-serif;
      letter-spacing: 1px;
      font-size: 1.4em;
    }

    .app-side-menu-link {
      display: block;
      padding: 12px 20px;
      color: var(--text-white);
      background-color: var(--primary-color);
      font-weight: 500;
      font-size: 1.2em;
      text-decoration: none;
      border: 1px solid var(--primary-light);
      transition: background-color 0.2s ease;
    }

    .app-side-menu-link:hover {
      background-color: var(--primary-light);
      color: var(--text-white);
    }

    .app-side-menu-section {
      cursor: pointer;
    }

    .app-side-menu-sub-links {
      padding-left: 20px;
      background-color: var(--primary-color);
    }

    .app-side-menu-sub-link {
      padding: 8px 20px;
      font-size: 0.95em;
      background-color: var(--primary-color);
      color: var(--text-white);
    }

    .app-side-menu-sub-link:hover {
      background-color: var(--hover-color);
      color: var(--text-white);
    }

    .app-main-content {
      margin-left: 250px;
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: var(--background-color);
    }

    .app-header {
      background-color: var(--primary-light);
      padding-top: 34px;
      padding-bottom: 34px;
      padding-right: 55px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--border-color);
    }

    .app-header-content {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .app-header-title {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.6em;
      font-weight: 600;
      color: var(--surface-color);
      font-family: 'Rubik', sans-serif;
    }

    .app-user-profile {
      position: absolute;
      right: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .app-user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--accent-color);
      color: var(--primary-dark);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1em;
      margin-right: 5px;
      border: 2px solid var(--text-primary);
      font-family: 'Lora', serif;
    }

    .app-user-arrow {
      font-size: 1.5em;
      color: var(--accent-light);
      transition: transform 0.3s ease;
    }

    .app-user-arrow.up {
      transform: rotate(180deg);
    }

    .app-user-dropdown {
      display: none;
      position: absolute;
      right: 0;
      background-color: var(--surface-color);
      box-shadow: 0 2px 4px var(--shadow-color);
      padding: 10px;
      z-index: 10;
      min-width: 160px;
      top: 48px;
      border: 1px solid var(--border-color);
      border-radius: 4px;
    }

    .app-user-dropdown.show {
      display: block;
    }

    .app-user-dropdown-link {
      color: var(--text-primary);
      text-decoration: none;
      display: block;
      padding: 8px 10px;
      border-radius: 4px;
      font-size: 0.95em;
    }

    .app-user-dropdown-link:hover {
      background-color: var(--accent-light);
    }

    .app-main {
      flex: 1;
      padding: 20px;
    }

    .app-footer {
      text-align: center;
      background-color: var(--primary-light);
      color: var(--text-white);
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 250px;
      margin-top: auto;
      font-size: 0.9em;
      border-top: 1px solid var(--border-color);
    }

    .lighter-hr {
      border: none;
      height: 1px;
      background: var(--border-color);
      margin: 8px 0;
    }
  `]
})
export class MainLayoutComponent {
  title="IMS"; // Inventory Management System
  dropdownVisible = false;
  sessionUser: any; // Holds session user object
  userInitial: string; // First Character of username (uppercase)

  // Track open/closed Sections for Collapsible Menus
  sections: any = {
    inventoryReports: false,
    supplierReports: false,
    userManagement: false
  };

  // Admin Menu Items
  userManagement = [
    { name: 'Users', url: '/user-management/users' },
    { name: 'Create User', url: '/user-management/users/create-user' },
    { name: 'Update User', url: '/user-management/users/update-user' },
    { name: 'Delete User', url: '/user-management/users/delete-user'}
  ];

  // Category Report Links
  categoryReports = [
    { name: 'View Categories', url: '/reports/categories/view' },
    { name: 'Create Category', url: '/reports/categories/create-category' },
    { name: 'Update Category', url: '/reports/categories/update-category' },
    { name: 'Delete Category', url: '/reports/categories/delete-category' }
  ];

  // Inventory Report Links
  inventoryReports = [
    { name: 'View Inventory Items', url: '/reports/inventory/view' },
    { name: 'Create Inventory Item', url: '/reports/inventory/create-inventory' },
    { name: 'Update Inventory Item', url: '/reports/inventory/update-inventory' },
    { name: 'Delete Inventory Item', url: '/reports/inventory/delete-inventory' }
  ];

  // Supplier Report Links
  supplierReports = [
    { name: 'View Suppliers', url: '/reports/suppliers/view' },
    { name: 'Create Supplier', url: '/reports/suppliers/create-supplier' },
    { name: 'Update Supplier', url: '/reports/suppliers/update-supplier' },
    { name: 'Delete Supplier', url: '/reports/suppliers/delete-supplier' }
  ];

  constructor(private cookieService: CookieService, private router: Router) {
    // Load Session User from Cookie
    this.sessionUser = JSON.parse(this.cookieService.get('sessionUser') || '{}');
    this.userInitial = this.sessionUser?.username?.charAt(0)?.toUpperCase() || '?';
  }

  // Toggle Profile Dropdown
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  // Toggle Collapsible Menu Sections
  toggleSection(event: MouseEvent, section: string) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('app-side-menu-link') && !target.classList.contains('app-side-menu-sub-link')) {
      this.sections[section] = !this.sections[section];
    }
  }

  // Log Out User
  signout() {
    this.cookieService.deleteAll();
    this.router.navigate(['/signin']);
  }

  /*serverMessage: string;

  constructor(private http: HttpClient) {
    this.serverMessage = '';

    // Simulate a server request that takes 2 seconds to complete
    setTimeout(() => {
      this.http.get(`${environment.apiBaseUrl}/api`).subscribe({
        next: (res: any) => {
          this.serverMessage = res['message'];
        },
        error: (err) => {
          this.serverMessage = 'Error loading server message';
        }
      });
    }, 2000);
  }*/
}
