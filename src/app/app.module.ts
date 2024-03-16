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
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp({"projectId":"ecomercesa-3c1ff","appId":"1:600924951861:web:cdafa4c00800d3f6d0287c","storageBucket":"ecomercesa-3c1ff.appspot.com","apiKey":"AIzaSyDalTAm9ttdXOJll_8B89SHHyNCP8Jm_rM","authDomain":"ecomercesa-3c1ff.firebaseapp.com","messagingSenderId":"600924951861"})),
    provideAuth(() => getAuth())
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }