import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { EmployeeListComponent } from '../employee-list/employee-list.component';
import { Employee } from '../models/employee.model';
import { Inject } from '@angular/core';
import { EmployeeService } from '../services/employee.service';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, EmployeeFormComponent, EmployeeListComponent],
  templateUrl: './employee-management.component.html',
  styleUrls: ['./employee-management.component.css']
})
export class EmployeeManagementComponent implements OnInit {
  employees: Employee[] = [];
  editingEmployee: Employee | null = null;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  onEmployeeSubmit(employee: Employee): void {
    this.isLoading = true;
    this.errorMessage = null;

    if (this.editingEmployee) {
      // Update existing employee
      this.employeeService.updateEmployee(this.editingEmployee.id!, employee).subscribe({
        next: (updatedEmployee) => {
          const index = this.employees.findIndex(emp => emp.id === this.editingEmployee?.id);
          if (index !== -1) {
            this.employees[index] = updatedEmployee;
          }
          this.editingEmployee = null;
          this.isLoading = false;
          console.log('✅ UI updated with modified employee data');
        },
        error: (error) => {
          this.handleError('Failed to update employee', error);
          this.isLoading = false;
        }
      });
    } else {
      // Add new employee
      this.employeeService.createEmployee(employee).subscribe({
        next: (newEmployee) => {
          this.employees.push(newEmployee);
          this.isLoading = false;
          console.log('✅ UI updated with new employee data');
        },
        error: (error) => {
          this.handleError('Failed to create employee', error);
          this.isLoading = false;
        }
      });
    }
  }

  onEditEmployee(employee: Employee): void {
    console.log('✏️ Setting up employee for editing:', employee.name);
    this.editingEmployee = employee;
  }

  onDeleteEmployee(employeeId: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: () => {
        this.employees = this.employees.filter(emp => emp.id !== employeeId);
        this.isLoading = false;
        console.log('🗑️ UI updated - employee removed from list');
      },
      error: (error) => {
        this.handleError('Failed to delete employee', error);
        this.isLoading = false;
      }
    });
  }

  private loadEmployees(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.isLoading = false;
        console.log('✅ UI synchronized with backend data');
      },
      error: (error) => {
        this.handleError('Failed to load employees', error);
        this.isLoading = false;
        // Keep local data if backend fails
        console.log('⚠️ Keeping existing UI data due to backend failure');
      }
    });
  }

  private handleError(message: string, error: any): void {
    this.errorMessage = message;
    console.error(`❌ ${message}:`, error);

    // Show error message for 5 seconds
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }

  // Retry mechanism
  retryLoadEmployees(): void {
    console.log('🔄 Retrying to load employees...');
    this.loadEmployees();
  }
}
