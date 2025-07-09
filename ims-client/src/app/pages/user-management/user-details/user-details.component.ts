import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';
import { User } from '../user.interface';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormComponent],
  template: `
    <div>
      <h1>User Details</h1>

      <div *ngIf="errorMessage" class="message message-error">{{ errorMessage }}</div>

      <app-form
        [title]="'Edit User: ' + user.username "
        [submitLabel]="'Submit'"
        [inputs]="formInputs"
        (formSubmit)="editUser($event)"
      ></app-form>

      <div class="return-link-container">
      <a class="link link-secondary" routerLink="/user-management/users">Return</a>
      </div>
    </div>
  `,
  styles: [`
    h1 {
      text-align: center;
    }

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
export class UserDetailsComponent implements OnInit {
  _id = '';
  user: User = {} as User;
  errorMessage = '';
  formInputs: FormInputConfig[] = [];

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id || id === 'undefined') {
      this.errorMessage = 'Invalid user ID.';
      this.router.navigate(['/user-management/users']);
      return;
    }
    this._id = id;
    this.loadUser();
  }

  loadUser(): void {
    this.http.get<User>(`${environment.apiBaseUrl}/api/users/${this._id}`).subscribe({
      next: (data) => {
        this.user = data;
        this.buildFormInputs(this.user);
        this.patchFormValues();
      },
      error: (err) => {
        console.error('Failed to load user:', err);
        this.errorMessage = 'Failed to load user details.';
      }
    });
  }

  buildFormInputs(user: User): void {
    this.formInputs = [
      {
        label: 'Username',
        name: 'username',
        type: 'text',
        required: true,
        placeholder: 'Enter username',
        errorMessage: 'Username is required and must be between 3-20 characters.',
      },
      {
        label: 'Email',
        name: 'email',
        type: 'email',
        required: true,
        placeholder: 'Enter email',
        errorMessage: 'Valid email is required.',
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
          { label: 'Viewer', value: 'viewer' },
        ],
        errorMessage: 'Role is required.',
      }
    ];
  }

  patchFormValues() {
    // Use a small delay so <app-form> initializes its form group
    setTimeout(() => {
      const formEl = document.querySelector('app-form') as any;
      if (formEl?.form) {
        formEl.form.patchValue({
          username: this.user.username,
          email: this.user.email,
          role: this.user.role,
        });
      }
    }, 0);
  }

  editUser(formValue: any): void {
    if (!formValue || !this._id) return;

    const { username, email, role } = formValue;

    this.http.put(`${environment.apiBaseUrl}/api/users/${this._id}`, {
      username,
      email,
      role
    }).subscribe({
      next: () => {
        this.router.navigate(['/user-management/users']);
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.errorMessage = error.message || 'An error occurred while updating the user.';
      }
    });
  }
}
