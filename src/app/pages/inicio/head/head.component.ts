import { Component, OnInit } from '@angular/core';
import { sesioncosntans } from '../../../constans/sesion.constans';
import { AuthService } from '../../../Service/auth.service';
import { error } from 'console';
import { Router } from '@angular/router';



@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrl: './head.component.scss'
})
export class HeadComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  vernombre: boolean = false;
  displayname: string = "";

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
}

