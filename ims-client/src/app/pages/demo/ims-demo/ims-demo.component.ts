// ims-demo.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ims-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-container">
      <h1>IMS Style Guide Demo</h1>
      <hr class="hr--light" />

      <!-- Inventory Card -->
      <section> 
        <h2>Inventory Item Cards</h2>
        <div class="card">
        <div class="card-header">Sample Inventory Item</div>
          <div class="card-body">
            <p><strong>ID:</strong> inv1</p>
            <p><strong>Name:</strong> Bluetooth Speaker</p>
            <p><strong>Quantity:</strong> 140</p>
          </div>
        </div>
        <button class="button button--primary" (click)="toggle('showCardHtml')">
          Toggle Card HTML
        </button>
        <pre *ngIf="showCardHtml">
&lt;div class="card"&gt;
  &lt;div class="card-header"&gt;Sample Inventory Item&lt;/div&gt;
  &lt;div class="card-body"&gt;
    &lt;p&gt;&lt;strong&gt;ID:&lt;/strong&gt; inv1&lt;/p&gt;
    &lt;p&gt;&lt;strong&gt;Name:&lt;/strong&gt; Bluetooth Speaker&lt;/p&gt;
    &lt;p&gt;&lt;strong&gt;Quantity:&lt;/strong&gt; 140&lt;/p&gt;
  &lt;/div&gt;
&lt;/div&gt;
        </pre>
      </section>
      
      <hr class="hr--light" />

      <!-- Button Styles -->
      <section>
        <h2> Action Buttons</h2>
        <button class="button button-primary">Add Item</button>
        <button class="button button-secondary">Cancel</button>
        <button class="button button-warning">Delete</button>
        <br/><br/>
        <button class="button button-info" (click)="toggle('showButtonsHtml')">
          Toggle Buttons HTML
        </button>
        <pre *ngIf="showButtonsHtml">
  &lt;button class="button button-primary"&gt;Add Item&lt;/button&gt;
  &lt;button class="button button-secondary"&gt;Cancel&lt;/button&gt;
  &lt;button class="button button-warning"&gt;Delete&lt;/button&gt;
        </pre>
      </section>


      <hr class="hr--light" />

      <!-- Table --> 
        <section>
        <h2>Inventory Table</h2>
        <table class="table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Qty</th></tr>
          </thead>
          <tbody>
            <tr><td>inv1</td><td>Bluetooth Speaker</td><td>140</td></tr>
            <tr><td>inv2</td><td>Wireless Mouse</td><td>230</td></tr>
          </tbody>
        </table>
        <button class="button button--secondary" (click)="toggle('showTableHtml')">
          Toggle Table HTML
        </button>
        <pre *ngIf="showTableHtml">
&lt;table class="table"&gt;…&lt;/table&gt;
        </pre>
      </section>

      <hr class="hr--light" />

      <!-- Messages -->
      <section>
        <h2>Messages</h2>
        <div class="message message--success">Item added successfully.</div>
        <div class="message message--error">Failed to add item.</div>
        <div class="message message--info">Loading inventory…</div>
        <button class="button button--info" (click)="toggle('showMessagesHtml')">
          Toggle Messages HTML
        </button>
        <pre *ngIf="showMessagesHtml">
&lt;div class="message message-success"&gt;…&lt;/div&gt;
&lt;div class="message message-error"&gt;…&lt;/div&gt;
&lt;div class="message message-info"&gt;…&lt;/div&gt;
        </pre>
      </section>

      <hr class="hr--light" />

      <!-- Simple Form -->
      <section>
        <h2>Quick Add Form</h2>
        <form class="form">
          <div class="form__group">
            <label class="label" for="itemName">Name</label>
            <input class="input" id="itemName" name="itemName" type="text" placeholder="Enter name">
          </div>
          <div class="form__group">
            <label class="label" for="itemQty">Quantity</label>
            <input class="input" id="itemQty" name="itemQty" type="number" placeholder="Enter qty">
          </div>
          <div class="form__actions">
            <button class="button button--secondary" type="button">Cancel</button>
            <button class="button button--primary" type="submit">Submit</button>
          </div>
        </form>
        <button class="button button--info" (click)="toggle('showFormHtml')">
          Toggle Form HTML
        </button>
        <pre *ngIf="showFormHtml">
&lt;form class="form"&gt;…&lt;/form&gt;
        </pre>
      </section>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      font-family: Poppins, sans-serif;
      color: var(--text-primary);
    }
    section { margin-bottom: 30px; }
    pre {
      background: var(--surface-color);
      border: 1px solid var(--border-color);
      border-radius: 4px;
      padding: 15px;
      overflow-x: auto;
      font-size: 0.9em;
      margin-top: 10px;
    }
  `]
})
export class ImsDemoComponent {
  showCardHtml     = false;
  showButtonsHtml  = false;
  showTableHtml    = false;
  showMessagesHtml = false;
  showFormHtml     = false;

  toggle(prop: keyof ImsDemoComponent) {
    this[prop] = !this[prop];
  }
}