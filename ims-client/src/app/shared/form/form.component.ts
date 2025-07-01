// Angular core imports for component, input/output bindings, lifecycle hooks
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
// Common module for ngIf/ngFor and base Angular directives
import { CommonModule } from '@angular/common';
// Reactive form-related modules and utilities
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true, // This component doesn't rely on an NgModule
  imports: [CommonModule, ReactiveFormsModule], // Standalone imports for common and reactive form features
  template: `
  <!-- Reactive form binding to form group instance -->
  <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-container">
    <!-- Dynamic form title -->
    <h2 class="form-title">{{ title }}</h2>

    <!-- Loop through dynamic field inputs to generate form controls -->
    <div *ngFor="let field of inputs; trackBy: trackByName" class="form-group">
      <!-- Label for each input field -->
      <label [for]="field.name" class="form-label">{{ field.label }}</label>

      <!-- Standard input types except textarea/select -->
      <input
        *ngIf="field.type !== 'textarea' && field.type !== 'select'"
        [type]="field.type"
        class="form-input"
        [id]="field.name"
        [placeholder]="field.placeholder"
        [formControlName]="field.name"
      />

      <!-- Textarea input -->
      <textarea
        *ngIf="field.type === 'textarea'"
        class="form-input"
        [id]="field.name"
        [placeholder]="field.placeholder"
        [formControlName]="field.name"
      ></textarea>

      <!-- Dropdown/select input -->
      <select
        *ngIf="field.type === 'select'"
        class="form-input"
        [id]="field.name"
        [formControlName]="field.name"
      >
        <option *ngFor="let option of field.options" [value]="option.value">
          {{ option.label }}
        </option>
      </select>

      <!-- Inline validation error display -->
      <div class="error-message" *ngIf="form.get(field.name)?.invalid && form.get(field.name)?.touched">
        {{ field.errorMessage || 'This field is required.' }}
      </div>
    </div>

    <!-- Submit button aligned to the right -->
    <div class="form-actions">
      <button class="form-button" type="submit" [disabled]="form.invalid">
        {{ submitLabel }}
      </button>
    </div>
  </form>
  `,
  styles: [`
  /* Form wrapper styles */
  .form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 75%;
    margin: 2rem auto;
    padding: 2rem;
    background-color: var(--surface-color);
    border-radius: 8px;
    box-shadow: 0 4px 8px var(--shadow-color);
  }

  /* Form title */
  .form-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--text-primary);
    text-align: center;
    width: 100%;
  }

  /* Each form field */
  .form-group {
    width: 100%;
    margin-bottom: 1.25rem;
    color: var(--text-secondary);
  }

  /* Field label */
  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-secondary);
  }

  /* Input, textarea, and select styles */
  .form-input {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 1rem;
    font-family: 'Rubik', sans-serif;
    background-color: var(--surface-color);
    color: var(--text-primary);
  }

  /* Button wrapper to align button to the right */
  .form-actions {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  /* Submit button styling */
  .form-button {
    padding: 10px 20px;
    background-color: var(--primary-color);
    color: var(--text-white);
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }

  /* Disabled button state */
  .form-button:disabled {
    background-color: var(--primary-light);
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Hover state for active buttons */
  .form-button:hover:not(:disabled) {
    background-color: var(--hover-color);
  }

  /* Error message styling */
  .error-message {
    margin-top: 4px;
    color: var(--error-color);
    font-size: 0.875rem;
  }
  `]
})
export class FormComponent implements OnInit, OnChanges {
  // Title shown at the top of the form
  @Input() title: string = 'Form';

  // Submit button label
  @Input() submitLabel: string = 'Submit';
  
  // Field configurations passed in from parent
  @Input() inputs: {
    label: string;
    name: string;
    type: 'text' | 'email' | 'password' | 'textarea' | 'select';
    placeholder?: string;
    required?: boolean;
    options?: { label: string; value: any } [];
    errorMessage?: string;
  } [] = [];

  // Emits form values to parent component on submit
  @Output() formSubmit = new EventEmitter<any>();

  // Reactive form group instance
  form!: FormGroup;

  // Inject Angular's FormBuilder service
  constructor(private fb: FormBuilder) {}

  // TrackBy function for performance optimization
  trackByName(index: number, field: any): string {
    return field.name
  }

  // Lifecycle hook to build form initially
  ngOnInit() {
    this.buildForm();
  }

  // Rebuild the form if input configuration changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputs']) {
      this.buildForm();
    }
  }

  // Dynamically build form controls based on inputs
  buildForm() {
    const group: any = {};
    for (const field of this.inputs) {
      const validators = field.required ? [Validators.required] : [];
      group[field.name] = this.fb.control('', validators);
    }
    this.form = this.fb.group(group);
  }

  // Handle form submission
  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched(); // Show validation messages
    }
  }
}
