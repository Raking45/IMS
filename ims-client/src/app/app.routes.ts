import { Routes } from '@angular/router';
import { MainLayoutComponent} from './layouts/main-layout/main-layout.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CreateCategoryComponent } from './pages/categories/create-category/create-category.component';
import { DeleteCategoryComponent } from './pages/categories/delete-category/delete-category.component';
import { UpdateCategoryComponent } from './pages/categories/update-category/update-category.component';
import { ViewCategoriesComponent } from './pages/categories/view-categories/view-categories.component';
import { CreateInventoryItemComponent } from './pages/inventory/create-inventory-item/create-inventory-item.component';
import { DeleteInventoryItemComponent } from './pages/inventory/delete-inventory-item/delete-inventory-item.component';
import { UpdateInventoryItemComponent } from './pages/inventory/update-inventory-item/update-inventory-item.component';
import { ViewInventoryItemsComponent } from './pages/inventory/view-inventory-items/view-inventory-items.component';
import { CreateSupplierComponent } from './pages/supplier/create-supplier/create-supplier.component';
import { DeleteSupplierComponent } from './pages/supplier/delete-supplier/delete-supplier.component';
import { UpdateSupplierComponent } from './pages/supplier/update-supplier/update-supplier.component';
import { ViewSuppliersComponent } from './pages/supplier/view-suppliers/view-suppliers.component';
import { ViewInventoryItemByIdComponent } from './pages/inventory/view-inventory-item-by-id/view-inventory-item-by-id.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { UsersComponent } from './pages/user-management/users/users.component';
import { UserCreateComponent } from './pages/user-management/user-create/user-create.component';
import { UserDetailsComponent } from './pages/user-management/user-details/user-details.component';
import { authGuard } from './pages/security/auth.guard';
import { SigninComponent } from './pages/security/signin/signin.component';
import { UnauthorizedComponent } from './pages/security/unauthorized/unauthorized.component';
import { DemoComponent } from './pages/demo/demo.component';
import { SearchBarComponent } from './shared/search-bar/search-bar.component';
import { ViewCategoryByIdComponent } from './pages/categories/view-category-by-id/view-category-by-id.component';
import { ViewSupplierByIdComponent } from './pages/supplier/view-supplier-by-id/view-supplier-by-id.component';

// Export the Routes
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent, data: { roles: ['admin', 'manager', 'staff', 'viewer'] } },

      // Demo
      { path: 'demo', component: DemoComponent, data: { roles: ['admin', 'manager', 'staff', 'viewer'] } },

      // User Management (Admins only)
      { path: 'user-management', component: UserManagementComponent, data: { roles: ['admin'] } },
      { path: 'user-management/users', component: UsersComponent, data: { roles: ['admin'] } },
      { path: 'user-management/users/new', component: UserCreateComponent, data: { roles: ['admin'] } },
      { path: 'user-management/users/:id', component: UserDetailsComponent, data: { roles: ['admin'] } },

      // Categories
      { path: 'reports/categories/create-category', component: CreateCategoryComponent, data: { roles: ['admin', 'manager'] } },
      { path: 'reports/categories/delete-category', component: DeleteCategoryComponent, data: { roles: ['admin', 'manager'] } },
      { path: 'reports/categories/update-category', component: UpdateCategoryComponent, data: { roles: ['admin', 'manager'] } },
      { path: 'reports/categories/view', component: ViewCategoriesComponent, data: { roles: ['admin', 'manager', 'staff', 'viewer'] } },
      { path: 'reports/categories/view-category-by-id', component: ViewCategoryByIdComponent, data: { roles: ['admin', 'manager', 'staff', 'viewer'] } },

      // Inventory
      { path: 'reports/inventory/create-inventory', component: CreateInventoryItemComponent, data: { roles: ['admin', 'manager'] } },
      { path: 'reports/inventory/delete-inventory', component: DeleteInventoryItemComponent, data: { roles: ['admin', 'manager'] } },
      { path: 'reports/inventory/update-inventory', component: UpdateInventoryItemComponent, data: { roles: ['admin', 'manager'] } },
      { path: 'reports/inventory/view', component: ViewInventoryItemsComponent, data: { roles: ['admin', 'manager', 'staff', 'viewer'] } },
      { path: 'reports/inventory/view-inventory-item-by-id', component: ViewInventoryItemByIdComponent, data: { roles: ['admin', 'manager', 'staff', 'viewer'] } },

      // Suppliers
      { path: 'reports/suppliers/create-supplier', component: CreateSupplierComponent, data: { roles: ['admin', 'manager'] } },
      { path: 'reports/suppliers/delete-supplier', component: DeleteSupplierComponent, data: { roles: ['admin', 'manager'] } },
      { path: 'reports/suppliers/update-supplier', component: UpdateSupplierComponent, data: { roles: ['admin', 'manager'] } },
      { path: 'reports/suppliers/view', component: ViewSuppliersComponent, data: { roles: ['admin', 'manager', 'staff', 'viewer'] } },
      { path: 'reports/suppliers/view-supplier-by-id', component: ViewSupplierByIdComponent, data: { roles: ['admin', 'manager', 'staff', 'viewer'] } },

      // Search
      { path: 'reports/search', component: SearchBarComponent },
    ]
  },
  { path: 'signin', component: SigninComponent },
  { path: 'unauthorized', component: UnauthorizedComponent }
];
