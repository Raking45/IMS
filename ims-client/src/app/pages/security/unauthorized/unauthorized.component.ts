// src/app/pages/security/unauthorized/unauthorized.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="unauthorized-wrapper">
      <div class="unauthorized-content">
        <svg class="unauthorized-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" stroke="#d9534f" stroke-width="4"/>
          <path d="M20 32h24M32 20v24" stroke="#d9534f" stroke-width="4" stroke-linecap="round"/>
        </svg>
        <h1>403 - Forbidden</h1>
        <p>You do not have the necessary permissions to access this page.</p>
        <a routerLink="/" class="btn-home">← Back to Dashboard</a>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      background-color: #f9f9f9;
      padding: 2rem;
    }

    .unauthorized-content {
      text-align: center;
      background: white;
      padding: 3rem;
      border-radius: 16px;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
      max-width: 400px;
      width: 100%;
    }

    .unauthorized-icon {
      width: 80px;
      height: 80px;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 1.75rem;
      margin: 1rem 0 0.5rem;
      color: #333;
    }

    p {
      font-size: 1rem;
      color: #666;
      margin-bottom: 2rem;
    }

    .btn-home {
      display: inline-block;
      text-decoration: none;
      background-color: #007bff;
      color: white;
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }

    .btn-home:hover {
      background-color: #0056b3;
    }

    @media (max-width: 500px) {
      .unauthorized-content {
        padding: 2rem;
      }

      h1 {
        font-size: 1.5rem;
      }

      .btn-home {
        padding: 0.5rem 1rem;
      }
    }
  `]
})
export class UnauthorizedComponent {}

