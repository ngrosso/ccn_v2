import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from '../components/inicio/inicio.component';
import { NuevaComponent } from '../orders/nueva/nueva.component';
import { SeguimientoComponent } from '../orders/seguimiento/seguimiento.component';

const routes: Routes = [
  {path: '', component:InicioComponent},
  {path: 'nueva', component:NuevaComponent},
  {path: 'seguimiento', component:SeguimientoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }