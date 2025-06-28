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
  this.service.createEmpleado(this.empleado).subscribe(
    data => {
      const modalEl = document.getElementById('exampleModal');
      if (modalEl) {
        const bootstrap = (window as any).bootstrap;
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    },
    error => {
        const modalError = document.getElementById('modalError');
      if (modalError) {
        const bootstrap = (window as any).bootstrap;
        const modal = new bootstrap.Modal(modalError);
        modal.show();
      }
    }
  );
}
  Volver(){
  this.router.navigate(['listar']).then(() => {
        window.location.reload();
      })
  }

  CerrarModal() {
  const modalEl = document.getElementById('modalError');
  if (modalEl) {
    const bootstrap = (window as any).bootstrap;
    const modal = new bootstrap.Modal(modalEl);
    modal.hide(); // Cierra el modal
  }
}


}
