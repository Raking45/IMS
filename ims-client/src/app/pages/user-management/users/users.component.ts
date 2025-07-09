import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { User } from '../user.interface';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { TableComponent } from '../../../shared/table/table.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink, ConfirmDialogComponent, TableComponent],
  template: `
    <div>
      <h1>Users</h1>
      <a routerLink="/user-management/users/new" class="link button button-primary">Create User</a>
      <br /><br />

      <div *ngIf="deletionMessage" class="message message-success">{{ deletionMessage }}</div>

      <app-table
        [title]="'User List'"
        [data]="formattedUsers"
        [headers]="['Username', 'Email', 'Role', 'Actions']"
        [sortableColumns]="['Username', 'Email', 'Role']"
        [columnTypes]="{ 'Username': 'alpha', 'Email': 'alpha', 'Role': 'alpha' }"
        [recordsPerPage]="5"
        [headerBackground]="'default'"
      >
        <ng-template #rowActions let-user>
          <a [routerLink]="['/user-management/users', user._id]" title="Edit User">
            <i class="fas fa-edit"></i>
          </a>
          &nbsp;
          <a (click)="confirmDelete(user._id)" title="Delete User" style="cursor:pointer;">
            <i class="fas fa-trash"></i>
          </a>
        </ng-template>
      </app-table>

      <app-confirm-dialog
        *ngIf="showConfirmDialog"
        [header]="dialogHeader"
        [message]="dialogMessage"
        (confirmed)="onConfirm($event)"
      ></app-confirm-dialog>
    </div>
  `,
  styles: []
})
export class UsersComponent {
  users: User[] = [];
  formattedUsers: any[] = [];

  deletionMessage = '';
  dialogHeader = '';
  dialogMessage = '';
  showConfirmDialog = false;
  userIdToDelete: string | null = null;

  constructor(private http: HttpClient) {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<User[]>(`${environment.apiBaseUrl}/api/users`).subscribe({
      next: (users) => {
        this.users = users;
        this.formatUserData();
      },
      error: (error) => {
        console.error('Failed to load users', error);
      }
    });
  }

  formatUserData() {
    // Keep full user object, or at least include _id along with display fields
    this.formattedUsers = this.users.map(user => ({
      _id: user._id,
      Username: user.username,
      Email: user.email,
      Role: user.role
    }));
  }

  confirmDelete(userId: string) {
    this.dialogHeader = 'Confirm Deletion';
    this.dialogMessage = `Are you sure you want to delete this user?`;
    this.userIdToDelete = userId;
    this.showConfirmDialog = true;
  }

  onConfirm(result: boolean) {
    if (result && this.userIdToDelete) {
      this.deleteUser(this.userIdToDelete);
    }
    this.showConfirmDialog = false;
    this.userIdToDelete = null;
  }

  deleteUser(userId: string) {
    this.http.delete(`${environment.apiBaseUrl}/api/users/${userId}`).subscribe({
      next: () => {
        this.users = this.users.filter(user => user._id !== userId);
        this.formatUserData();
        this.deletionMessage = 'User deleted successfully';

        setTimeout(() => {
          this.deletionMessage = '';
        }, 2000);
      },
      error: (error) => {
        console.error('Failed to delete user', error);
      }
    });
  }
}
