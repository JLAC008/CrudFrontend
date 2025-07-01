import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { EmpleadoListComponent } from './components/empleado-list.component';

@Component({
  selector: 'app-root',
  template: `<app-empleado-list></app-empleado-list>`,
  standalone: true,
  imports: [EmpleadoListComponent]
})
export class App {}

bootstrapApplication(App, {
  providers: [
    provideHttpClient()
  ]
});