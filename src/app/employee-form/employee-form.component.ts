import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit, OnChanges {
  @Input() editModeEmployee: Employee | null = null;
  @Input() disabled = false;
  @Output() employeeSubmitted = new EventEmitter<Employee>();

  employeeForm: FormGroup;
  departments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales'];
  isEditMode = false;

  constructor(private formBuilder: FormBuilder) {
    this.employeeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      address: ['', [Validators.required]],
      department: ['', [Validators.required]],
      salary: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editModeEmployee'] && this.editModeEmployee) {
      this.isEditMode = true;
      this.populateForm(this.editModeEmployee);
    }

    if (changes['disabled']) {
      if (this.disabled) {
        this.employeeForm.disable();
      } else {
        this.employeeForm.enable();
      }
    }
  }

  private populateForm(employee: Employee): void {
    this.employeeForm.patchValue({
      name: employee.name,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      address: employee.address,
      department: employee.department,
      salary: employee.salary
    });
  }

  onSubmit(): void {
    if (this.employeeForm.valid && !this.disabled) {
      const employee: Employee = this.employeeForm.value;
      this.employeeSubmitted.emit(employee);
      this.employeeForm.reset();
      this.isEditMode = false;

      const message = this.isEditMode ? 'Employee updated successfully!' : 'Employee added successfully!';
      alert(message);
    } else if (!this.disabled) {
      this.markFormGroupTouched();
    }
  }

  onReset(): void {
    if (!this.disabled) {
      this.employeeForm.reset();
      this.isEditMode = false;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.employeeForm.controls).forEach(key => {
      const control = this.employeeForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }

      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }

      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }

      if (field.errors['pattern']) {
        if (fieldName === 'phoneNumber') {
          return 'Phone number must be 10 digits';
        }
      }

      if (field.errors['min']) {
        return 'Salary must be greater than 0';
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      name: 'Full Name',
      email: 'Email Address',
      phoneNumber: 'Phone Number',
      address: 'Address',
      department: 'Department',
      salary: 'Salary'
    };
    return displayNames[fieldName] || fieldName;
  }
}

