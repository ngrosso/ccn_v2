
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { InicioComponent } from './components/inicio/inicio.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MaterialModule } from './material/material.module';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { FooterComponent } from './components/navbar/footer/footer.component';
import { NuevaComponent } from './orders/nueva/nueva.component';
import { SeguimientoComponent } from './orders/seguimiento/seguimiento.component';
import { LoginComponent } from './auth/login/login.component';
import { DetailsComponent } from './orders/details/details.component';
import { VerificacionComponent } from './auth/verificacion/verificacion.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ConfirmOrderComponent } from './orders/confirm-order/confirm-order.component';
import { MobileUserComponent } from './components/mobile-user/mobile-user.component';
import { SpinerComponent } from './components/spiner/spiner.component';
import { LoadingInterceptor } from './loading';

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
    MobileUserComponent,
    SpinerComponent,

    
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
  {provide: HTTP_INTERCEPTORS, useClass:LoadingInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
  constructor() {
  }
}