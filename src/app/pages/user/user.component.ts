import { Component, OnInit } from '@angular/core';
import { sesioncosntans } from '../../constans/sesion.constans';
import { log } from 'console';
import { Router } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
import { DetalleVentaService } from '../../Service/detalle-venta.service';
import { DetalleVenta } from '../../Interface/detalle_venta';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  detallesVentaInversos: any[] = [];
  vernombre: boolean = true;
  displayname: string = "";
  photoURL: string = "";
  email:string="";
  currentSection: 'profile' | 'addirec' | 'pedidos'|'misfav'= 'profile';
  detallesVenta: DetalleVenta[] = [];
  usuarioId: number=0;
  constructor(
    private detalleVentaService: DetalleVentaService,
    private router:Router,
    private authService:AuthService
  ) {}
  mostrarSeccion(seccion: 'profile' | 'addirec' | 'pedidos'|'misfav'): void {
    this.currentSection = seccion;
  }

  ngOnInit(): void {
    const usuarioData = JSON.parse(localStorage.getItem('usuarioData') || '{}');
    this.usuarioId = usuarioData.idPersona; 
    this.obtenerDetallesVenta();
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

  obtenerDetallesVenta(): void {
    this.detalleVentaService.getDetalleVentaporPersonaId(this.usuarioId).subscribe(
      (detalles: DetalleVenta[]) => {
        this.detallesVenta = Array.isArray(detalles) ? detalles : [detalles]; 
        this.detallesVentaInversos = this.detallesVenta.reverse();
      },
      
      (error) => {
        console.error('Error al obtener los detalles de venta:', error);
      }
    );
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

