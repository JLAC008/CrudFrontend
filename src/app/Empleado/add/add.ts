import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Service } from '../../Service/service'; // Asegúrate de importar tu servicio
import { Empleado } from '../../Modelo/Empleado'; // Importamos la clase Empleado
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add',
  templateUrl: './add.html',
  imports: [FormsModule],
  styleUrls: ['./add.css'] // Usa `styleUrls` en vez de `styleUrl` si estás trabajando con Angular
})
export class Add {
  // Inicialización del objeto empleado
  empleado: Empleado = new Empleado();

  constructor(private service: Service, private router: Router) {}

  // Método Guardar que toma el objeto empleado
  Guardar() {
    // Aquí pasamos el objeto empleado al servicio para ser guardado
    this.service.createEmpleado(this.empleado).subscribe(
      data => {
        alert('Empleado añadido con éxito');
       this.router.navigate(['listar']).then(() => {
        window.location.reload();
      });},
      error => {
        console.error('Error al añadir el empleado', error);
      }
    );
  }
  Volver(){
  this.router.navigate(['listar']).then(() => {
        window.location.reload();
      })
  }

}
