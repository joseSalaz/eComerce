import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../Service/auth.service';
import { Router } from '@angular/router';
import { sesioncosntans } from '../../../constans/sesion.constans';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {
  vernombre: boolean = false;
  displayname: string = "";
  mostrarCarrito = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkSession();
  }

  checkSession(): void {
    let username = sessionStorage.getItem(sesioncosntans.username); 
    if (username != null && username != "") {
      let usuariotext = sessionStorage.getItem(sesioncosntans.user);
      if (usuariotext) {
        let objusuario = JSON.parse(usuariotext)
        console.log(objusuario);
      }
      this.vernombre = true;
      this.displayname = username;
    } else {
      this.vernombre = false;
    }
  }

  onClick() {
    this.authService.logout()
      .then(() => {
        this.vernombre = false;
        this.router.navigate(['/inicio']);
        console.log("Sesión cerrada correctamente");
      })
      .catch(error => console.error('Error al hacer logout:', error));
  }

  onSelectOption(event: any): void {
    const option = event?.target?.value; // Utiliza el operador de encadenamiento opcional (?.) para evitar errores si event, target o value son null
    if (option !== null && option !== undefined) {
      if (option === 'miPerfil') {
        // Redirigir a la página de perfil
        this.router.navigate(['/perfil']);
      } else if (option === 'cerrarSesion') {
        // Cerrar sesión
        this.onClick();
      }
    }
  }

  toggleCarrito() {
    this.mostrarCarrito = !this.mostrarCarrito;
  }
}

