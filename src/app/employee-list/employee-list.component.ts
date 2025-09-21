import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../models/employee.model';


@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  @Input() employees: Employee[] = [];
  @Input() disabled: boolean = false;
  @Output() editEmployee: EventEmitter<Employee> = new EventEmitter<Employee>();
  @Output() deleteEmployee: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  onEdit(empEmployee: Employee): void {
    if (!this.disabled) {
      this.editEmployee.emit(empEmployee);
    }
  }

  onDelete(employeeId: number): void {
    if (!this.disabled && confirm('Are you sure you want to delete this employee?')) {
      this.deleteEmployee.emit(employeeId);
    }
  }
}
