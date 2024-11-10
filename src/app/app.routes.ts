import { Routes } from '@angular/router';
import { LoginComponent } from './components/Login/login/login.component';

import { AuthGuard } from './guards/authgards/auth.guard';
import { DashboardComponent } from './components/Dashboard/dashboard/Dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirect root path to login
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' } // Wildcard route to redirect to login if undefined
];
