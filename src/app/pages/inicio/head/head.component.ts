import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Service/auth.service';
import { Router } from '@angular/router';
import { sesioncosntans } from '../../../constans/sesion.constans';
import { Console, error, log } from 'console';
import { CarroService } from '../../../Service/carro.service';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {
  vernombre: boolean = false;
  displayname: string = "";
  mostrarCarrito = false;
  totalItems: number = 0;
  constructor(
    private authService: AuthService,
    private router: Router,
    private carroService:CarroService
  ) {}

  ngOnInit(): void {
    this.checkSession();
    this.totalItems = this.carroService.obtenerCantidadProductos();
    this.carroService.Libro.subscribe(libros => {
      this.totalItems = libros.length;
    });
  }

checkSession(): void {
  const userProfile: any = this.authService.getProfile(); 

  if (userProfile && userProfile['name']) { 
    console.log(userProfile['name']); 
    this.vernombre = true; 
    this.displayname = userProfile['name']; 
  } else {
    this.vernombre = false; 
  }
  console.log(this.authService.getProfile());
  
}


  onSelectOption(event: any): void {
    const option = event?.target?.value; 
    if (option !== null && option !== undefined) {
      if (option === 'miperfil') {
        // Redirigir a la página de perfil
        this.router.navigate(['/user']);
      } else if (option === 'cerrarSesion') {
        // Cerrar sesión
        this.onClick();
      }
    }
  }


  toggleCarrito() {
    this.mostrarCarrito = !this.mostrarCarrito;
  }

  showData() {
    const data = JSON.stringify(this.authService.getProfile())
    console.log(data);
  }

  onClick() {
    this.authService.logout();
    this.router.navigate(['/inicio']);
  }
}

