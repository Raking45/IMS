import { Routes } from '@angular/router';
import { MainLayoutComponent} from './layouts/main-layout/main-layout.component'
import { DashboardComponent } from './pages/dashboard/dashboard.component';

// Export the Routes
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ]
  }
];
