import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InfraConfigComponent } from './infra-config/infra-config.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', loadComponent: () => import('./dashboard/overview.component').then(m => m.OverviewComponent) },
      { path: 'products', loadComponent: () => import('./products/products.component').then(m => m.ProductsComponent) },
      { path: 'infra', component: InfraConfigComponent },
      { path: 'tenants', loadComponent: () => import('./tenants/tenants.component').then(m => m.TenantsComponent) },
      { path: 'subscriptions', loadComponent: () => import('./subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent) },

    ]
  }
];
