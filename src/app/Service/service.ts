import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Empleado } from '../Modelo/Empleado';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Service {
  
  constructor(private http:HttpClient) { }
  Url = 'http://localhost:8080/api/empleados';

  getEmpleados(){
   return this.http.get<Empleado[]>(this.Url);
  }

    createEmpleado(empleado: Empleado): Observable<any> {
    return this.http.post(this.Url, empleado); 
  }
}
