import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { LogInComponent } from './pages/auth/log-in/log-in.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { DetalleProductoComponent } from './pages/detalle-producto/detalle-producto.component';
import { AutorComponent } from './autor/autor.component';
import { UserComponent } from './pages/user/user.component';
import { DetalleVentaComponent } from './pages/carro/detalle-venta/detalle-venta.component'

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/inicio' },
  { path: 'inicio', component: InicioComponent },
  {path:'detalle-producto/:id', component:DetalleProductoComponent},
  {path:'autor', component:AutorComponent},
  {path:'user',component:UserComponent},
  {path:'detale-venta',component:DetalleVentaComponent},
  {
    path: 'auth',
    children: [
      { path: 'sign-up', component: SignUpComponent },
      { path: 'log-in', component: LogInComponent }
    ]
  },
  // Agregar una ruta para redirigir al inicio si la ruta no está definida
  { path: '**', redirectTo: '/inicio' }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
