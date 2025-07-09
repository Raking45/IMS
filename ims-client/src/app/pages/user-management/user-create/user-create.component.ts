import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormInputConfig, FormComponent } from '../../../shared/form/form.component'; 
import { environment } from '../../../../environments/environment';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, RouterLink, FormComponent, ConfirmDialogComponent],
  template: `
      <!-- Error message if user creation fails -->
      <div *ngIf="errorMessage" class="message message-error">
        {{ errorMessage }}
      </div>

      <!-- Reusable dynamic form component -->
      <app-form
        [title]="'Create New User'"
        [submitLabel]="'Create User'"
        [inputs]="formInputs"
        (formSubmit)="addUser($event)"
      ></app-form>

      <!-- Confirm dialog after user is created -->
      <app-confirm-dialog
        *ngIf="showConfirmDialog"
        [header]="'User Created Successfully!'"
        [message]="'Would you like to return to the dashboard?'"
        (confirmed)="handleDialogConfirm($event)">
      </app-confirm-dialog>

      
      <div class="return-link-container">
        <a class="link link-secondary" routerLink="/user-management/users">Return</a>
      </div>
  `,
  styles: [`
    .message-error {
      color: var(--error-color);
      background-color: #FFE5E5;
      border: 1px solid var(--error-color);
      padding: 1rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .return-link-container {
      margin-top: 2rem;
      text-align: center;
    }

    .link-secondary {
      color: var(--accent-dark);
      text-decoration: underline;
      font-weight: bold;
      cursor: pointer;
    }

    .link-secondary:hover {
      color: var(--hover-color);
    }
  `]
})
export class UserCreateComponent {
  errorMessage: string = '';
  showConfirmDialog: boolean = false;

  // Define form fields using FormInputConfig interface
  formInputs: FormInputConfig[] = [
    {
      label: 'Username',
      name: 'username',
      type: 'text',
      placeholder: 'Enter username',
      required: true,
      errorMessage: 'Username is required'
    },
    {
      label: 'Password',
      name: 'password',
      type: 'password',
      placeholder: 'Enter password',
      required: true,
      errorMessage: 'Password must be at least 8 characters, with upper, lower case and number'
    },
    {
      label: 'Email',
      name: 'email',
      type: 'email',
      placeholder: 'Enter email',
      required: true,
      errorMessage: 'Valid email is required'
    },
    {
      label: 'Role',
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Staff', value: 'staff' },
        { label: 'Viewer', value: 'viewer' }
      ],
      errorMessage: 'Role is required'
    }
  ];

  constructor(private http: HttpClient, private router: Router) {}

  // Receive dynamic form values from FormComponent
  addUser(formData: any) {
    const newUser = {
      username: formData.username,
      passwordHash: formData.password,
      email: formData.email,
      role: formData.role
    };

    this.http.post(`${environment.apiBaseUrl}/api/users`, { user: newUser }).subscribe({
      next: () => {
        this.showConfirmDialog = true;
      },
      error: (error) => {
        console.error('Error creating user', error);
        this.errorMessage = error?.error?.message || 'Failed to create user.';
      }
    });
  }

  // Handle confirmation dialog interaction
  handleDialogConfirm(confirmed: boolean) {
    this.showConfirmDialog = false;
    if (confirmed) {
      this.router.navigate(['/']);
    }
  }
}
