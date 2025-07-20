// Import statements
import { Component, OnInit } from '@angular/core';
import { CalendarComponent } from '../../shared/calendar/calendar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ChartComponent } from '../../shared/chart/chart.component';
import { TableComponent } from '../../shared/table/table.component';
import { FormComponent, FormInputConfig } from '../../shared/form/form.component';


@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CalendarComponent, CommonModule, ChartComponent, TableComponent, FormComponent],
  providers: [DatePipe],
  template: `
    <h1 class="page-title">Global CSS Styles Demo</h1>
    <hr class="hr-light" />
    <!-- Card Demo -->
    <div class="card-container">
    <h2>Card</h2>
    <div class="card">
        <div class="card-header">Card Header</div>
        <div class="card-body">
          <p>This is a card body content.</p>
        </div>
      </div>
      <button class="card-button" (click)="toggleProperty('showCardHtml')">Toggle Card HTML</button>
      <div *ngIf="showCardHtml">
        <pre>
          &lt;div class="card"&gt;
            &lt;div class="card__header"&gt;Card Header&lt;/div&gt;
            &lt;div class="card__body"&gt;
              &lt;p&gt;This is a card body content.&lt;/p&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        </pre>
      </div>
    </div>
    <hr class="hr-light" />
    <!-- Button Demo -->
    <div class="button-container">
      <h2>Buttons</h2>
      <div>
        <button class="button button-primary">Primary Button</button>&nbsp;
        <button class="button button-secondary">Secondary Button</button>&nbsp;
        <button class="button button-warning">Warning Button</button>
      </div>
      <br />
      <button class="button-button" (click)="toggleProperty('showButtonsHtml')">Toggle Buttons HTML</button>
      <div *ngIf="showButtonsHtml">
        <pre>
          &lt;div&gt;
            &lt;button class="button button-primary"&gt;Primary Button&lt;/button&gt;&nbsp;
            &lt;button class="button button-secondary"&gt;Secondary Button&lt;/button&gt;&nbsp;
            &lt;button class="button button-warning"&gt;Warning Button&lt;/button&gt;
          &lt;/div&gt;
        </pre>
      </div>
    </div>
    <hr class="hr-light" />

    <!-- Calendar Demo -->
    <div class="calendar-container">
      <h2>Calendar</h2>
      <div class="calendar-form">
        <div class="calendar-form-group">
          <div class="calendar-form-item">
            <label class="calendar-form-label" for="startDate">Start Date:</label>
            <app-calendar (dateSelected)="onStartDateSelected($event)"></app-calendar>
          </div>
          <div class="calendar-form-item">
            <label class="calendar-form-label" for="endDate">End Date:</label>
            <app-calendar (dateSelected)="onEndDateSelected($event)"></app-calendar>
          </div>
        </div>
        <div class="calendar-form-dates">
          <p *ngIf="startDate">Start Date: <span class="calendar-form-date">{{ startDate | date }}</span></p>
          <p *ngIf="endDate">End Date: <span class="calendar-form__date">{{ endDate | date }}</span></p>
        </div>
      </div>
      <button class="calendar-button" (click)="toggleProperty('showCalendarHtml')">Toggle Calendar HTML</button>
      <div *ngIf="showCalendarHtml">
        <pre>
          &lt;div class="calendar-form"&gt;
            &lt;div class="calendar-form-group"&gt;
              &lt;div class="calendar-form-item"&gt;
                &lt;label class="calendar-form-label" for="startDate"&gt;Start Date:&lt;/label&gt;
                &lt;app-calendar (dateSelected)="onStartDateSelected($event)"&gt;&lt;/app-calendar&gt;
              &lt;/div&gt;
              &lt;div class="calendar-form-item"&gt;
                &lt;label class="calendar-form-label" for="endDate"&gt;End Date:&lt;/label&gt;
                &lt;app-calendar (dateSelected)="onEndDateSelected($event)"&gt;&lt;/app-calendar&gt;
              &lt;/div&gt;
            &lt;/div&gt;
            &lt;div class="calendar-form-dates"&gt;
              &lt;p *ngIf="startDate"&gt;Start Date: &lt;span class="calendar-form-date"&gt;{{ startDate | date }}&lt;/span&gt;&lt;/p&gt;
              &lt;p *ngIf="endDate"&gt;End Date: &lt;span class="calendar-form-date"&gt;{{ endDate | date }}&lt;/span&gt;&lt;/p&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        </pre>
      </div>
    </div>
    <hr class="hr-light" />

    <!-- Messages Demo -->
    <div class="messages-container">
      <h2>Messages</h2>
      <!-- Message Examples -->
      <div class="message error-message">This is an error message.</div>
      <div class="message info-message">This is an info message.</div>
      <div class="message success-message">This is a success message.</div>
      <br />
      <button class="message-button"(click)="toggleProperty('showMessagesHtml')">Toggle Messages HTML</button>
      <div *ngIf="showMessagesHtml">
        <pre>
          &lt;div class="message message-error"&gt;This is an error message.&lt;/div&gt;
          &lt;div class="message message-info"&gt;This is an info message.&lt;/div&gt;
          &lt;div class="message message-success"&gt;This is a success message.&lt;/div&gt;
        </pre>
      </div>
    </div>
    <hr class="hr-light" />

    <!-- Form Demo -->
    <div class="demo-form-container">
      <h2>Form</h2>
      <!-- Reusable Form Component Usage -->
      <app-form
        [title]="'User Registration'"
        [submitLabel]="'Submit'"
        [inputs]="formInputs"
        (formSubmit)="onFormSubmit($event)">
      </app-form>

      <!-- Toggle Button for showing HTML -->
      <br />
      <button (click)="toggleProperty('showFormHtml')">Toggle Form HTML</button>

      <!-- Display Raw HTML if toggled -->
      <div *ngIf="showFormHtml">
        <pre>
          &lt;app-form
            [title]="'User Registration'"
            [submitLabel]="'Submit'"
            [inputs]="formInputs"
            (formSubmit)="onFormSubmit($event)"&gt;
          &lt;/app-form&gt;
        </pre>
      </div>
    </div>
    <hr class="hr-light" />

    <!-- Data Table Demo -->
    <div class="data-table-container">
      <h2>Data Table</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>Admin</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>User</td>
          </tr>
        </tbody>
      </table>
      <button class="table-button" (click)="toggleProperty('showDataTableHtml')">Toggle Data Table HTML</button>
      <div *ngIf="showDataTableHtml">
        <pre>
          &lt;table class="table"&gt;
            &lt;thead&gt;
              &lt;tr&gt;
                &lt;th&gt;Name&lt;/th&gt;
                &lt;th&gt;Role&lt;/th&gt;
              &lt;/tr&gt;
            &lt;/thead&gt;
            &lt;tbody&gt;
              &lt;tr&gt;
                &lt;td&gt;John Doe&lt;/td&gt;
                &lt;td&gt;Admin&lt;/td&gt;
              &lt;/tr&gt;
              &lt;tr&gt;
                &lt;td&gt;Jane Smith&lt;/td&gt;
                &lt;td&gt;User&lt;/td&gt;
              &lt;/tr&gt;
            &lt;/tbody&gt;
          &lt;/table&gt;
        </pre>
      </div>
    </div>
    <hr class="hr-light" />

    <!-- chart Demo -->
    <div class="chart-container">
      <h2>Charts</h2>
      <!-- Chart example -->
      <div class="charts-container">
        <div class="card">
          <app-chart
            [type]="'bar'"
            [label]="'Revenue by Timeframe'"
            [data]="[10000, 20000, 30000]"
            [labels]="['Monthly', 'Quarterly', 'Yearly']">
          </app-chart>
        </div>
        <div class="card">
          <app-chart
            [type]="'pie'"
            [label]="'Sales by Region'"
            [data]="[3000, 2000, 1000, 4000]"
            [labels]="['North', 'South', 'East', 'West']">
          </app-chart>
        </div>
      </div>
      <button class="chart-button" (click)="toggleProperty('showChartsHtml')">Toggle Charts HTML</button>
      <div *ngIf="showChartsHtml">
        <pre>
          &lt;div class="charts-container"&gt;
            &lt;div class="card"&gt;
              &lt;app-chart
                [type]="'bar'"
                [label]="'Revenue by Timeframe'"
                [data]="[10000, 20000, 30000]"
                [labels]="['Monthly', 'Quarterly', 'Yearly']"&gt;
              &lt;/app-chart&gt;
            &lt;/div&gt;
            &lt;div class="card"&gt;
              &lt;app-chart
                [type]="'pie'"
                [label]="'Sales by Region'"
                [data]="[3000, 2000, 1000, 4000]"
                [labels]="['North', 'South', 'East', 'West']"&gt;
              &lt;/app-chart&gt;
            &lt;/div&gt;
          &lt;/div&gt;
        </pre>
      </div>
    </div>
    <hr class="hr-light" />

    <!-- Table with Pagination Demo -->
    <div class="table-pagination-container">
      <h2>Data table with sorting and pagination</h2>
      <app-table
        [title]="'Inventory'"
        [data]="dataByRegion"
        [headers]="['Inventory Id', 'Description', 'Quantity']"
        [recordsPerPage]="10"
        [sortableColumns]="['Inventory Id', 'Description', 'Quantity']"
        [headerBackground]="'default'"> <!-- background color accepts: default, primary, secondary -->
      </app-table>
      <br />
      <button (click)="toggleProperty('showTableHtml')">Toggle Table HTML</button>
      <div *ngIf="showTableHtml">
        <pre>
          &lt;app-table
            [title]="'Sales by Region'"
            [data]="dataByRegion"
            [headers]="['Region', 'Sales']"
            [recordsPerPage]="10"
            [sortableColumns]="['Region', 'Sales']"
            [headerBackground]="'default'"&gt;
          &lt;/app-table&gt;
        </pre>
      </div>
    </div>
  `,
  styles: [`
    .page-title {
      text-align: center;
    }

    .charts-container {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      width: 100%;
      align-items: center;
      justify-content: center;
    }

    .card-container {
      display: flex;
      width: 100%;
      align-items: center;
      padding: 3rem 0;
    }

    .card {
      width: calc(50% - 10px);
      height: 400px;
      padding: 10px;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .card app-chart {
      width: 100%;
      height: 100%;
    }

    .button-secondary {
      margin: 0 20px;
    }

    .calendar-form {
      width: 50%;
      background: #fff;
      border: 1px solid #ddd;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 20px;
      box-sizing: border-box;
      margin: 20px 0;
      min-height: 200px;
    }

    .calendar-form-group {
      display: flex;
      gap: 10px;
    }

    .calendar-form-item {
      flex: 1;
    }

    .calendar-form-label {
      padding-right: 10px;
    }

    .calendar-form-dates {
      margin-top: 20px;
    }

    .calendar-form-date {
      color: green; /* Set the text color to green */
    }

    .button-container,
    .messages-container,
    .calendar-container,
    .demo-form-container,
    .data-table-container {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 3rem 0;
    }

    .table {
      max-width: 800px;
      padding: 3rem auto;
      text-align: center;
    }

    .table td, th, tr {
      padding-right: 50px;
    }

    .table-button,
    .chart-button,
    .card-button,
    .button-button,
    .calendar-button,
    .message-button {
      margin-top: 3rem;
    }

    .chart-container {
      display: block;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 0;
    }

    .table-pagination-container {
      display: block;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 0;
    }
  `]
})
export class DemoComponent {
  startDate: Date | null = null;
  endDate: Date | null = null;
  showCardHtml = false;
  showButtonsHtml = false;
  showCalendarHtml = false;
  showMessagesHtml = false;
  showFormHtml = false;
  showDataTableHtml = false;
  showChartsHtml = false;
  showTableHtml = false;

  dataByRegion: any[] = [
    { 'Inventory Id': 'inv001', 'Description': '27 inch computer monitor', 'Quantity': 22 },
    { 'Inventory Id': 'inv002', 'Description': '32 inch computer monitor', 'Quantity': 15 },
    { 'Inventory Id': 'inv003', 'Description': 'HDMI cable 10 feet', 'Quantity': 56 },
    { 'Inventory Id': 'inv004', 'Description': '16 outlet power strip', 'Quantity': 21 }
  ]

  formInputs: FormInputConfig[] = [
    {
      label: 'Username',
      name: 'username',
      type: 'text',
      placeholder: 'Enter username',
      required: true,
      errorMessage: 'Username is required.'
    },
    {
      label: 'Password',
      name: 'password',
      type: 'password',
      placeholder: 'Enter password',
      required: true,
      errorMessage: 'Password is required.'
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
      errorMessage: 'Role selection is required.'
    }
  ];

  constructor() { }

  onStartDateSelected(date: Date) {
    this.startDate = date;
    this.logDate(date);
  }

  toggleProperty(propertyName: string) {
    (this as any)[propertyName] = !(this as any)[propertyName];
  }

  onEndDateSelected(date: Date) {
    if (this.startDate && date < this.startDate) {
      alert('End date must be after the start date.');
      return;
    }
    this.endDate = date;
    this.logDate(date);
  }

  logDate(date: Date) {
    console.log('Date selected:', date);
  }

  onFormSubmit(formValue: any) {
    console.log('Form submitted:', formValue);
  }
}

