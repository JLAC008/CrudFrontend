import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import {FormsModule}from '@angular/forms';
import {Service} from '../app/Service/service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.html',
  providers: [Service],
  styleUrls: ['./app.css']  // corregido a styleUrls
})
export class App {
  protected title = 'CrudJLAC';

  constructor(private router: Router) {}

  Listar() {
    this.router.navigate(['listar']);
  }

  Nuevo() {
    this.router.navigate(['add']);
  }
}
