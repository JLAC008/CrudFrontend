import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EmpleadoService } from '../services/empleado.service';
import { Empleado } from '../models/empleado.model';

@Component({
  selector: 'app-empleado-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="empleados-container">
      <!-- Header -->
      <div class="header">
        <h1 class="main-title">Gestión de Empleados</h1>
        <button class="btn-primary" (click)="showForm = !showForm">
          <span class="btn-icon">{{showForm ? '✕' : '+'}}</span>
          {{showForm ? 'Cancelar' : 'Nuevo Empleado'}}
        </button>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando empleados...</p>
      </div>

      <!-- Form -->
      <div *ngIf="showForm" class="form-container">
        <div class="form-card">
          <h2 class="form-title">{{editingEmpleado ? 'Editar' : 'Nuevo'}} Empleado</h2>
          
          <form class="empleado-form" (ngSubmit)="saveEmpleado()">
            <div class="form-row">
              <div class="form-group">
                <label for="nombre">Nombre</label>
                <input 
                  type="text" 
                  id="nombre" 
                  [(ngModel)]="currentEmpleado.nombre" 
                  name="nombre"
                  placeholder="Ingresa el nombre"
                  required>
              </div>
              <div class="form-group">
                <label for="apellido">Apellido</label>
                <input 
                  type="text" 
                  id="apellido" 
                  [(ngModel)]="currentEmpleado.apellido" 
                  name="apellido"
                  placeholder="Ingresa el apellido"
                  required>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  [(ngModel)]="currentEmpleado.email" 
                  name="email"
                  placeholder="ejemplo@correo.com"
                  required>
              </div>
              <div class="form-group">
                <label for="telefono">Teléfono</label>
                <input 
                  type="tel" 
                  id="telefono" 
                  [(ngModel)]="currentEmpleado.telefono" 
                  name="telefono"
                  placeholder="1234567890">
              </div>
            </div>

            <div class="form-group">
              <label for="direccion">Dirección</label>
              <input 
                type="text" 
                id="direccion" 
                [(ngModel)]="currentEmpleado.direccion" 
                name="direccion"
                placeholder="Calle, número, colonia, ciudad">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="puesto">Puesto</label>
                <input 
                  type="text" 
                  id="puesto" 
                  [(ngModel)]="currentEmpleado.puesto" 
                  name="puesto"
                  placeholder="Cargo o posición">
              </div>
              <div class="form-group">
                <label for="salario">Salario</label>
                <input 
                  type="text" 
                  id="salario" 
                  [(ngModel)]="currentEmpleado.salario" 
                  name="salario"
                  placeholder="$0.00">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="fechaNacimiento">Fecha de Nacimiento</label>
                <input 
                  type="date" 
                  id="fechaNacimiento" 
                  [(ngModel)]="currentEmpleado.fecha_nacimiento" 
                  name="fechaNacimiento">
              </div>
              <div class="form-group">
                <label for="fechaIngreso">Fecha de Ingreso</label>
                <input 
                  type="date" 
                  id="fechaIngreso" 
                  [(ngModel)]="currentEmpleado.fecha_ingreso" 
                  name="fechaIngreso">
              </div>
            </div>

            <div class="form-group" *ngIf="editingEmpleado">
              <label for="fechaSalida">Fecha de Salida</label>
              <input 
                type="date" 
                id="fechaSalida" 
                [(ngModel)]="currentEmpleado.fecha_salida" 
                name="fechaSalida">
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-primary">
                {{editingEmpleado ? 'Actualizar' : 'Guardar'}} Empleado
              </button>
              <button type="button" class="btn-secondary" (click)="resetForm()">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Statistics -->
      <div class="stats-container" *ngIf="!loading">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>{{empleados.length}}</h3>
            <p>Total Empleados</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💼</div>
          <div class="stat-info">
            <h3>{{getActiveEmployees()}}</h3>
            <p>Empleados Activos</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h3>{{getUniquePositions()}}</h3>
            <p>Puestos Diferentes</p>
          </div>
        </div>
      </div>

      <!-- Search and Filter -->
      <div class="search-container" *ngIf="!loading && empleados.length > 0">
        <div class="search-box">
          <input 
            type="text" 
            placeholder="Buscar empleado..." 
            [(ngModel)]="searchTerm"
            (input)="filterEmpleados()">
          <span class="search-icon">🔍</span>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && empleados.length === 0" class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No hay empleados registrados</h3>
        <p>Comienza agregando tu primer empleado</p>
        <button class="btn-primary" (click)="showForm = true">
          Agregar Primer Empleado
        </button>
      </div>

      <!-- Employees Grid -->
      <div *ngIf="!loading && filteredEmpleados.length > 0" class="empleados-grid">
        <div *ngFor="let empleado of filteredEmpleados" class="empleado-card">
          <div class="card-header">
            <div class="employee-avatar">
              {{getInitials(empleado.nombre, empleado.apellido)}}
            </div>
            <div class="employee-info">
              <h3>{{empleado.nombre}} {{empleado.apellido}}</h3>
              <p class="employee-position">{{empleado.puesto}}</p>
            </div>
            <div class="employee-status" [class.active]="!empleado.fecha_salida">
              {{empleado.fecha_salida ? 'Inactivo' : 'Activo'}}
            </div>
          </div>

          <div class="card-body">
            <div class="info-item">
              <span class="info-label">📧 Email:</span>
              <span class="info-value">{{empleado.email}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📱 Teléfono:</span>
              <span class="info-value">{{empleado.telefono}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">🏠 Dirección:</span>
              <span class="info-value">{{empleado.direccion}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">💰 Salario:</span>
              <span class="info-value">{{empleado.salario}}</span>
            </div>
            <div class="info-item">
              <span class="info-label">📅 Ingreso:</span>
              <span class="info-value">{{formatDate(empleado.fecha_ingreso)}}</span>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn-edit" (click)="editEmpleado(empleado)">
              ✏️ Editar
            </button>
            <button class="btn-delete" (click)="confirmDelete(empleado)">
              🗑️ Eliminar
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay" (click)="showDeleteModal = false">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Confirmar Eliminación</h3>
            <button class="modal-close" (click)="showDeleteModal = false">✕</button>
          </div>
          <div class="modal-body">
            <p>¿Estás seguro de que deseas eliminar a <strong>{{empleadoToDelete?.nombre}} {{empleadoToDelete?.apellido}}</strong>?</p>
            <p class="warning-text">Esta acción no se puede deshacer.</p>
          </div>
          <div class="modal-actions">
            <button class="btn-danger" (click)="deleteEmpleado()">
              Eliminar
            </button>
            <button class="btn-secondary" (click)="showDeleteModal = false">
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div *ngIf="successMessage" class="success-message">
        <span>✅ {{successMessage}}</span>
        <button (click)="successMessage = ''" class="close-btn">✕</button>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="error-message">
        <span>❌ {{errorMessage}}</span>
        <button (click)="errorMessage = ''" class="close-btn">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .empleados-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #FFF8E7 0%, #FFE4B5 100%);
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding: 20px 0;
    }

    .main-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #C44536;
      margin: 0;
      text-shadow: 2px 2px 4px rgba(196, 69, 54, 0.1);
    }

    .btn-primary {
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 25px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
    }

    .btn-icon {
      font-size: 1.2rem;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #C44536;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #FFE4B5;
      border-top: 4px solid #FF6B35;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .form-container {
      margin-bottom: 30px;
    }

    .form-card {
      background: white;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 10px 30px rgba(196, 69, 54, 0.1);
      border: 2px solid #FFE4B5;
    }

    .form-title {
      font-size: 1.8rem;
      color: #C44536;
      margin-bottom: 25px;
      text-align: center;
      font-weight: 600;
    }

    .empleado-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 600;
      color: #C44536;
      margin-bottom: 8px;
      font-size: 0.95rem;
    }

    .form-group input {
      padding: 12px 16px;
      border: 2px solid #FFE4B5;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #FFFBF5;
    }

    .form-group input:focus {
      outline: none;
      border-color: #FF6B35;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
      background: white;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 20px;
    }

    .btn-secondary {
      background: #F5F5F5;
      color: #666;
      border: 2px solid #DDD;
      padding: 12px 24px;
      border-radius: 25px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-secondary:hover {
      background: #E0E0E0;
      transform: translateY(-1px);
    }

    .stats-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      border-radius: 15px;
      padding: 25px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 8px 25px rgba(196, 69, 54, 0.1);
      border: 2px solid #FFE4B5;
      transition: transform 0.3s ease;
    }

    .stat-card:hover {
      transform: translateY(-5px);
    }

    .stat-icon {
      font-size: 2.5rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
      border-radius: 50%;
      filter: grayscale(0.2);
    }

    .stat-info h3 {
      font-size: 2rem;
      color: #C44536;
      margin: 0;
      font-weight: 700;
    }

    .stat-info p {
      color: #666;
      margin: 5px 0 0 0;
      font-weight: 500;
    }

    .search-container {
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
    }

    .search-box {
      position: relative;
      max-width: 400px;
      width: 100%;
    }

    .search-box input {
      width: 100%;
      padding: 15px 50px 15px 20px;
      border: 2px solid #FFE4B5;
      border-radius: 25px;
      font-size: 1rem;
      background: white;
      transition: all 0.3s ease;
    }

    .search-box input:focus {
      outline: none;
      border-color: #FF6B35;
      box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    }

    .search-icon {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.2rem;
      color: #999;
    }

    .empty-state {
      text-align: center;
      padding: 80px 20px;
      color: #999;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      color: #C44536;
      margin-bottom: 10px;
    }

    .empleados-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 25px;
    }

    .empleado-card {
      background: white;
      border-radius: 20px;
      padding: 25px;
      box-shadow: 0 8px 25px rgba(196, 69, 54, 0.1);
      border: 2px solid #FFE4B5;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .empleado-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(196, 69, 54, 0.15);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
      position: relative;
    }

    .employee-avatar {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .employee-info {
      flex: 1;
    }

    .employee-info h3 {
      margin: 0;
      color: #C44536;
      font-size: 1.2rem;
      font-weight: 600;
    }

    .employee-position {
      margin: 2px 0 0 0;
      color: #666;
      font-style: italic;
    }

    .employee-status {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      background: #FFE4E1;
      color: #DC143C;
    }

    .employee-status.active {
      background: #E8F5E8;
      color: #228B22;
    }

    .card-body {
      margin-bottom: 20px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #FFE4B5;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-label {
      font-weight: 600;
      color: #666;
      font-size: 0.9rem;
    }

    .info-value {
      color: #333;
      font-weight: 500;
      text-align: right;
      flex: 1;
      margin-left: 10px;
    }

    .card-actions {
      display: flex;
      gap: 10px;
    }

    .btn-edit {
      flex: 1;
      background: linear-gradient(135deg, #F7931E 0%, #FFB347 100%);
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-edit:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(247, 147, 30, 0.3);
    }

    .btn-delete {
      flex: 1;
      background: linear-gradient(135deg, #DC143C 0%, #FF6B6B 100%);
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 12px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-delete:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 20, 60, 0.3);
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 20px;
      padding: 30px;
      max-width: 400px;
      width: 90%;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .modal-header h3 {
      color: #C44536;
      margin: 0;
      font-size: 1.3rem;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #999;
      cursor: pointer;
    }

    .modal-body {
      margin-bottom: 25px;
    }

    .warning-text {
      color: #DC143C;
      font-style: italic;
      margin-top: 10px;
    }

    .modal-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
    }

    .btn-danger {
      background: linear-gradient(135deg, #DC143C 0%, #FF6B6B 100%);
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-danger:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 20, 60, 0.3);
    }

    .success-message, .error-message {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 25px;
      border-radius: 12px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .success-message {
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    }

    .error-message {
      background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0.8;
    }

    .close-btn:hover {
      opacity: 1;
    }

    @media (max-width: 768px) {
      .empleados-container {
        padding: 15px;
      }

      .header {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }

      .main-title {
        font-size: 2rem;
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .stats-container {
        grid-template-columns: 1fr;
      }

      .empleados-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }

      .modal-content {
        margin: 20px;
      }
    }
  `]
})
export class EmpleadoListComponent implements OnInit {
  empleados: Empleado[] = [];
  filteredEmpleados: Empleado[] = [];
  currentEmpleado: Empleado = new Empleado();
  editingEmpleado: Empleado | null = null;
  empleadoToDelete: Empleado | null = null;
  showForm = false;
  showDeleteModal = false;
  loading = true;
  searchTerm = '';
  successMessage = '';
  errorMessage = '';

  constructor(private empleadoService: EmpleadoService) {}

  ngOnInit() {
    this.loadEmpleados();
  }

  loadEmpleados() {
    this.loading = true;
    this.empleadoService.getEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.filteredEmpleados = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading empleados:', error);
        this.errorMessage = 'Error al cargar los empleados. Verifica que el servidor esté ejecutándose.';
        this.loading = false;
        this.hideMessage();
      }
    });
  }

  filterEmpleados() {
    if (!this.searchTerm) {
      this.filteredEmpleados = this.empleados;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredEmpleados = this.empleados.filter(emp => 
      emp.nombre?.toLowerCase().includes(term) ||
      emp.apellido?.toLowerCase().includes(term) ||
      emp.email?.toLowerCase().includes(term) ||
      emp.puesto?.toLowerCase().includes(term)
    );
  }

  saveEmpleado() {
    if (this.editingEmpleado) {
      this.empleadoService.updateEmpleado(this.editingEmpleado.id!, this.currentEmpleado).subscribe({
        next: () => {
          this.successMessage = 'Empleado actualizado exitosamente';
          this.loadEmpleados();
          this.resetForm();
          this.hideMessage();
        },
        error: (error) => {
          console.error('Error updating empleado:', error);
          this.errorMessage = 'Error al actualizar el empleado';
          this.hideMessage();
        }
      });
    } else {
      this.empleadoService.createEmpleado(this.currentEmpleado).subscribe({
        next: () => {
          this.successMessage = 'Empleado creado exitosamente';
          this.loadEmpleados();
          this.resetForm();
          this.hideMessage();
        },
        error: (error) => {
          console.error('Error creating empleado:', error);
          this.errorMessage = 'Error al crear el empleado';
          this.hideMessage();
        }
      });
    }
  }

  editEmpleado(empleado: Empleado) {
    this.editingEmpleado = empleado;
    this.currentEmpleado = { ...empleado };
    this.showForm = true;
  }

  confirmDelete(empleado: Empleado) {
    this.empleadoToDelete = empleado;
    this.showDeleteModal = true;
  }

  deleteEmpleado() {
    if (this.empleadoToDelete?.id) {
      this.empleadoService.deleteEmpleado(this.empleadoToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Empleado eliminado exitosamente';
          this.loadEmpleados();
          this.showDeleteModal = false;
          this.empleadoToDelete = null;
          this.hideMessage();
        },
        error: (error) => {
          console.error('Error deleting empleado:', error);
          this.errorMessage = 'Error al eliminar el empleado';
          this.showDeleteModal = false;
          this.hideMessage();
        }
      });
    }
  }

  resetForm() {
    this.currentEmpleado = new Empleado();
    this.editingEmpleado = null;
    this.showForm = false;
  }

  getInitials(nombre?: string, apellido?: string): string {
    const first = nombre?.charAt(0).toUpperCase() || '';
    const last = apellido?.charAt(0).toUpperCase() || '';
    return first + last || '??';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }

  getActiveEmployees(): number {
    return this.empleados.filter(emp => !emp.fecha_salida).length;
  }

  getUniquePositions(): number {
    const positions = new Set(this.empleados.map(emp => emp.puesto).filter(p => p));
    return positions.size;
  }

  hideMessage() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000);
  }
}