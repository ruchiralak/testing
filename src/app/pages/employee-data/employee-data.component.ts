import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-data',
  imports: [FormsModule, CommonModule],
  templateUrl: './employee-data.component.html',
  styleUrl: './employee-data.component.css',
})
export class EmployeeDataComponent implements OnInit {
  //to store the employee data
  employeeList: any[] = [];

  selectedCity: any = null;

  selectedEmployee: any = null;

  selectedEmployeeToDelete: any = null;

  //to get the count of employees
  get employeeCount() {
    return this.employeeList.length;
  }

  //to add a employee to database
  employeeObj: any = {
    employeeId: 0,
    firstName: '',
    lastName: '',
    email: '',
    contactNo: '',
    city: '',
    address: '',
  };

  resetEmployeeForm() {
    this.employeeObj = {
      employeeId: 0,
      firstName: '',
      lastName: '',
      email: '',
      contactNo: '',
      city: '',
      address: '',
    };
  }

  http = inject(HttpClient);

  ngOnInit(): void {
    this.getAllEmployeeData();
  }

  //to get the employee data from the API
  getAllEmployeeData() {
    this.http
      .get('https://localhost:7208/api/EmployeeMaster')
      .subscribe((res: any) => {
        this.employeeList = res; //to store the employee data in employeeList array
      });
  }

  //post API to add employee data
  onSave() {
    //this will refresh the employee data after adding a new employee
    this.http
      .post('https://localhost:7208/api/EmployeeMaster', this.employeeObj)
      .subscribe((res: any) => {
        this.getAllEmployeeData();
        this.resetEmployeeForm();
      });
  }
  // to view employee data in database table based employee id
  onView(employeeId: number) {
    this.http
      .get<any>(`https://localhost:7208/api/EmployeeMaster/${employeeId}`)
      .subscribe((data) => (this.selectedEmployee = data));
  }
  //to update employee data in database table
  onUpdate(employeeId: number) {
    if (!this.selectedEmployee) {
      console.error('No employee selected for update.');
      return;
    }

    this.http
      .put(
        `https://localhost:7208/api/EmployeeMaster/${employeeId}`,
        this.selectedEmployee
      )
      .subscribe(
        () => {
          console.log('Employee updated successfully.');
          this.getAllEmployeeData();
          this.selectedEmployee = null; // Reset selected employee
          // Close the modal by unchecking the checkbox
          const modalCheckbox = document.getElementById(
            'modal-edit'
          ) as HTMLInputElement;
          if (modalCheckbox) {
            modalCheckbox.checked = false; // This will close the modal
          }
        },
        (error) => {
          console.error('Error updating employee:', error);
        }
      );
  }

  //to delete employee data from database table
  onDelete(employeeId: number) {
    this.http
      .delete(`https://localhost:7208/api/EmployeeMaster/${employeeId}`)
      .subscribe(() => {
        this.getAllEmployeeData();
      });
  }
}
