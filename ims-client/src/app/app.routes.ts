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



// Export the Routes
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      
      // Category Routes
      { path: 'reports/categories/create-category', component: CreateCategoryComponent },
      { path: 'reports/categories/delete-category', component: DeleteCategoryComponent },
      { path: 'reports/categories/update-category', component: UpdateCategoryComponent},
      { path: 'reports/categories/view', component: ViewCategoriesComponent},

      // Inventory Routes
      { path: 'reports/inventory/create-inventory', component: CreateInventoryItemComponent},
      { path: 'reports/inventory/delete-inventory', component: DeleteInventoryItemComponent},
      { path: 'reports/inventory/update-inventory', component: UpdateInventoryItemComponent},
      { path: 'reports/inventory/view', component: ViewInventoryItemsComponent},
      { path: 'reports/inventory/view-inventory-item-by-id', component: ViewInventoryItemByIdComponent},

      // Supplier Routes
      { path: 'reports/suppliers/create-supplier', component: CreateSupplierComponent},
      { path: 'reports/suppliers/delete-supplier', component: DeleteSupplierComponent},
      { path: 'reports/suppliers/update-supplier', component: UpdateSupplierComponent},
      { path: 'reports/suppliers/view', component: ViewSuppliersComponent}
    ]
  }
];
