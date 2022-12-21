
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { InicioComponent } from './components/inicio/inicio.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material/material.module';

import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { FooterComponent } from './components/navbar/footer/footer.component';
import { NuevaComponent } from './orders/nueva/nueva.component';
import { SeguimientoComponent } from './orders/seguimiento/seguimiento.component';
import { LoginComponent } from './auth/login/login.component';
import { DetailsComponent } from './orders/details/details.component';
import { VerificacionComponent } from './auth/verificacion/verificacion.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ConfirmOrderComponent } from './orders/confirm-order/confirm-order.component';
@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    NavbarComponent,
    NuevaComponent,
    SeguimientoComponent,
    LoginComponent,
    VerificacionComponent,
    DetailsComponent,
    ForgotPasswordComponent,
    FooterComponent,
    ConfirmOrderComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    
      ],
  providers: [
  ApiService,
  NuevaComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
  constructor() {
  }
}