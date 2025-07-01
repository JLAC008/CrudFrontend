export class Empleado {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: number;
  direccion?: string;
  puesto?: string;
  salario?: string;
  fecha_nacimiento?: string;
  fecha_ingreso?: string;
  fecha_salida?: string;

  constructor(data: Partial<Empleado> = {}) {
    Object.assign(this, data);
  }
}