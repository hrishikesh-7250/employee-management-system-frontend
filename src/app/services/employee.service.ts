import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8080/api/employees'; // Replace with your actual backend URL

  constructor(private http: HttpClient) {}

  // Fetch all employees
  getEmployees(): Observable<Employee[]> {
    console.log('📡 Fetching all employees from backend...');
    return this.http.get<Employee[]>(this.apiUrl).pipe(
      tap(employees =>
        console.log(`✅ Successfully retrieved ${employees.length} employees from backend`)
      ),
      catchError(this.handleError<Employee[]>('getEmployees', []))
    );
  }

  // Create new employee
  createEmployee(employee: Employee): Observable<Employee> {
    console.log('➕ Creating new employee in backend:', employee.name);
    return this.http.post<Employee>(this.apiUrl, employee).pipe(
      tap(newEmployee =>
        console.log(
          `✅ Successfully created employee: ${newEmployee.name} with ID: ${newEmployee.id}`
        )
      ),
      catchError(this.handleError<Employee>('createEmployee'))
    );
  }

  // Update existing employee
  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    console.log(`✏️ Updating employee ID ${id} in backend...`);
    return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee).pipe(
      tap(updatedEmployee =>
        console.log(`✅ Successfully updated employee: ${updatedEmployee.name}`)
      ),
      catchError(this.handleError<Employee>('updateEmployee'))
    );
  }

  // Delete employee
  deleteEmployee(id: number): Observable<void> {
    console.log(`🗑️ Deleting employee ID ${id} from backend...`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => console.log(`✅ Successfully deleted employee ID ${id} from backend`)),
      catchError(this.handleError<void>('deleteEmployee'))
    );
  }

  // Error handler
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`❌ ${operation} failed:`, error);

      let errorMessage = 'An unknown error occurred';
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Client Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Server Error: ${error.status} - ${error.message}`;
      }

      console.error(`❌ Error details: ${errorMessage}`);

      // Let the app keep running by returning a fallback result
      if (result !== undefined) {
        console.log(`ℹ️ Returning fallback result for ${operation}`);
        return new Observable<T>((observer) => {
          observer.next(result as T);
          observer.complete();
        });
      }

      return throwError(() => error);
    };
  }
}
