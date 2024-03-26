import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { LogInComponent } from './pages/auth/log-in/log-in.component';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { DetalleProductoComponent } from './pages/detalle-producto/detalle-producto.component';
import { AutorComponent } from './autor/autor.component';
import { UserComponent } from './pages/user/user.component';
import { DetalleVentaComponent } from './pages/detalle-venta/detalle-venta.component'
<<<<<<< HEAD
import { PagoComponent } from './pages/detalle-venta/pago/pago.component';
=======
import { CategoriaComponent } from './pages/categoria/categoria.component';
>>>>>>> 23ba463b8f2820bbd59359a000c746ea2aa1d365

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/inicio' },
  { path: 'inicio', component: InicioComponent },
  {path:'detalle-producto/:id', component:DetalleProductoComponent},
  {path:'autor', component:AutorComponent},
  {path:'user',component:UserComponent},
  {path:'detalle-venta',component:DetalleVentaComponent},
<<<<<<< HEAD
  {path:'pago',component:PagoComponent},
=======
  {path: 'categoria/:idCategoria/libros',component: CategoriaComponent},
>>>>>>> 23ba463b8f2820bbd59359a000c746ea2aa1d365
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
