import { Component, OnInit } from '@angular/core';
import { sesioncosntans } from '../../constans/sesion.constans';
import { log } from 'console';
import { Router } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  vernombre: boolean = true;
  displayname: string = "";
  photoURL: string = "";
  email:string="";
  currentSection: 'profile' | 'addirec' | 'pedidos'|'misfav'= 'profile';
  constructor(
    private router:Router,
    private authService:AuthService
  ) {}
  mostrarSeccion(seccion: 'profile' | 'addirec' | 'pedidos'|'misfav'): void {
    this.currentSection = seccion;
  }

  ngOnInit(): void {
    this.checkSession();
  }


  checkSession(): void {
    let usuariotext:any = this.authService.getProfile(); 
      console.log("Usuario:", usuariotext.name);
      this.vernombre = true;
      this.displayname = usuariotext.name;
      this.photoURL = usuariotext.picture.replace(/^"(.*)"$/, '$1');
      console.log("foto"+this.photoURL);
      this.email=usuariotext.email;
      console.log("Foto sin comillas"+this.photoURL);
  }
  prevpage():void{
    this.router.navigate(['/inicio']);
  }
}

