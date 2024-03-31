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
     this.authService.sesion$.subscribe(userProfile => {
      if (userProfile && userProfile.usu && userProfile.usu.length > 0) {
        // Asumiendo que 'usu' es un arreglo y que los datos de perfil están en el primer elemento
        const profileData = userProfile.usu[0];
        this.vernombre = !!profileData.name; 
        this.displayname = profileData.name || '';
        this.email=profileData.email;
        this.photoURL=profileData.picture
        
      } else {
        this.vernombre = false;
        this.displayname = '';
      }
    });
  }


  checkSession(): void {
    const userProfile: any = this.authService.getProfile(); 
    if (userProfile && userProfile['name']) {  
      this.vernombre = true; 
      this.displayname = userProfile.name; 
    } 
  }
  prevpage():void{
    this.router.navigate(['/inicio']);
  }
}

