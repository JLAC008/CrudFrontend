import { Routes } from '@angular/router';
import { Listar } from './Empleado/listar/listar';
import { Add } from './Empleado/add/add';
import { Edit } from './Empleado/edit/edit';

export const routes: Routes = [
    {path: '', redirectTo: 'listar', pathMatch: 'full' },
    {path: 'listar', component:Listar},
    {path: 'add', component:Add},
    {path: 'edit', component:Edit}
];
