import { Routes } from '@angular/router';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';


export const routes: Routes = [
  { path: '', component: EmployeeManagementComponent },
  { path: 'employee-management', component: EmployeeManagementComponent },
  { path: '**', redirectTo: '' }
];

