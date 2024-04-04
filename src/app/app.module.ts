import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CarruselComponent } from './pages/inicio/carrusel/carrusel.component';
import { HeaderComponent } from './pages/inicio/header/header.component';
import { HeadComponent } from './pages/inicio/head/head.component';
import { DetalleProductoComponent } from './pages/detalle-producto/detalle-producto.component';
import { FooterComponent } from './pages/inicio/footer/footer.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { LogInComponent } from './pages/auth/log-in/log-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClientModule } from '@angular/common/http';
import { AutorComponent } from './autor/autor.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { CarroComponent } from './pages/detalle-venta/carro/carro.component';
import { UserComponent } from './pages/user/user.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { DetalleVentaComponent } from './pages/detalle-venta/detalle-venta.component';
import { PagoComponent } from './pages/detalle-venta/pago/pago.component';
import { RespuestasComponent } from './pages/detalle-venta/respuestas/respuestas.component';
import { ResBusquedadComponent } from './pages/inicio/head/res-busquedad/res-busquedad.component';




@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    CarruselComponent,
    HeaderComponent,
    HeadComponent,
    SignUpComponent,
    LogInComponent,
    DetalleProductoComponent,
    FooterComponent,
    AutorComponent,
    CarroComponent,
    UserComponent,
    CategoriaComponent,
    DetalleVentaComponent,
    PagoComponent,
    RespuestasComponent,   
    ResBusquedadComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    OAuthModule.forRoot(),
    HttpClientModule,

  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }