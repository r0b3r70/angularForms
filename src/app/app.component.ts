import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span> {{ title }} </span>
    </mat-toolbar>

    <div class="main">
     <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
  title = 'Brand New Application 🎉';
}
