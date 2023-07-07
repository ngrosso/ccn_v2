import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { LoginComponent } from './auth/login/login.component';
import { VerificacionComponent } from './auth/verificacion/verificacion.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { MobileUserComponent } from './components/mobile-user/mobile-user.component';


const routes: Routes = [
  { path: '', redirectTo: 'verificacion', pathMatch: 'full' },
  { path: 'verificacion', component: VerificacionComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgotPassword', component: ForgotPasswordComponent },
  { path: 'mobileUser', component: MobileUserComponent },
  {
    path: "inicio", loadChildren: () => import('./admin/admin.module')
      .then(mod => mod.AdminModule)
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }