import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';

// Import the shared form component and input config
import { FormComponent, FormInputConfig } from '../../../shared/form/form.component';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, RouterLink, FormComponent],
  template: `
    <div class="signin-container">
      <h1 class="signin-title">Inventory Management System</h1>
      <h2 class="signin-dev">Developed by Team Apollo</h2>
      <div *ngIf="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>

      <app-form class="signin-form"
        [title]="'Sign In'"
        [submitLabel]="'Sign in'"
        [inputs]="formFields"
        (formSubmit)="signin($event)">
      </app-form>
    </div>
  `,
  styles: [`
.signin-container {
  background-color: var(--primary-light);
  
  width: auto;
  height: 100vh;
  margin: auto;
  font-family: 'Rubik', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.signin-title {
  font-family: 'Poppins', sans-serif;
  font-size: 3rem;
  font-weight: bold;
  color: var(--accent-light);
}

.signin-dev {
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  color: var(--accent-dark);
  margin-top: -1.5rem;
}

.signin-form {
  display: flex;
  margin-top: 1rem;
}

.error-banner {
  width: 100%;
  background-color: var(--error-color);
  color: var(--text-white);
  padding: 0.75rem 1rem;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.signin-return-link {
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-white);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
}

.signin-return-link:hover {
  color: var(--info-color);
  text-decoration: underline;
}

.signin-info {
  margin-top: 0.75rem;
  font-size: 1rem;
  text-align: center;
  color: var(--text-white);
}

.asterisk {
  color: var(--error-color);
  font-weight: bold;
}
  `]
})
export class SigninComponent {
  errorMessage = '';

  // Define input fields using the shared FormInputConfig interface
  formFields: FormInputConfig[] = [
    {
      name: 'username',
      label: 'Username',
      type: 'text',
      placeholder: 'Enter your username',
      required: true,
      errorMessage: 'Username is required'
    },
    {
      name: 'password',
      label: 'Password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
      errorMessage: 'Password must be at least 8 characters, with uppercase, lowercase, and a number'
    }
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  signin(formData: { username: string; password: string }) {
    const { username, password } = formData;

    // Additional check (defensive)
    if (!username || !password) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    this.http.post(`${environment.apiBaseUrl}/api/security/signin`, { username, password }).subscribe({
      next: (response: any) => {
        const sessionUser = {
          username: response.username,
          role: response.role,
        };
        this.cookieService.set('sessionUser', JSON.stringify(sessionUser));
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Signin Error', error);
        this.errorMessage = 'Invalid username or password';
      }
    });
  }
}
