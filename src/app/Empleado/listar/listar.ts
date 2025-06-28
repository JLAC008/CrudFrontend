import { Component, OnInit } from '@angular/core';
import { Service } from '../../Service/service';
import { Router } from '@angular/router';               // CORREGIDO: Importar de @angular/router
import { Empleado } from '../../Modelo/Empleado';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-listar',
  standalone: true,                                    // Asegúrate de que es standalone si usas imports aquí
  imports: [CommonModule, HttpClientModule],           // IMPORTANTE: aquí pones estos módulos
  templateUrl: './listar.html',
  styleUrls: ['./listar.css']                           // CORREGIDO: styleUrls (plural)
})
export class Listar implements OnInit {
  empleados!: Empleado[];

  constructor(private service: Service, private router: Router) {}

  ngOnInit() {
    this.service.getEmpleados().subscribe(data => {
      this.empleados = data;
    });
  }
}
