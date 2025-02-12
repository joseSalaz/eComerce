import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
import { DetalleVentaService } from '../../Service/detalle-venta.service';
import { DireccionService } from '../../Service/direccion.service';
import { DetalleVenta } from '../../Interface/detalle_venta';
import { Direccion } from '../../Interface/direccion';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  detallesVentaInversos: any[] = [];
  detallesVenta: DetalleVenta[] = [];
  direcciones: Direccion[] = [];
  usuarioId: number = 0;

  // Información de usuario
  vernombre: boolean = true;
  displayname: string = "";
  photoURL: string = "";
  email: string = "";

  // Secciones del perfil
  currentSection: 'profile' | 'addirec' | 'pedidos' | 'misfav' = 'profile';

  // Modelo de la dirección
  nuevaDireccion: Direccion = {
    idPersona: 0,
    direccion1: '',
    referencia: '',
    departamento: '',
    provincia: '',
    distrito: '',
    codigoPostal: '',
    esPredeterminada: false
  };

  constructor(
    private detalleVentaService: DetalleVentaService,
    private direccionService: DireccionService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
    this.route.queryParams.subscribe(params => {
      if (params['section']) {
        this.currentSection = params['section'];
      }
    });
    const usuarioData = typeof window !== 'undefined' && localStorage.getItem('usuarioData')
    ? JSON.parse(localStorage.getItem('usuarioData') || '{}')
    : {};
  this.usuarioId = usuarioData.idPersona || 0;
  

    
    this.obtenerDetallesVenta();
    this.cargarDirecciones();
    this.checkSession();

    this.authService.sesion$.subscribe(userProfile => {
      if (userProfile && userProfile.usu && userProfile.usu.length > 0) {
        const profileData = userProfile.usu[0];
        this.vernombre = !!profileData.name;
        this.displayname = profileData.name || '';
        this.email = profileData.email;
        this.photoURL = profileData.picture;
      } else {
        this.vernombre = false;
        this.displayname = '';
      }
    });
  }, 0);
}

  // Obtener los pedidos del usuario
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

  // Obtener las direcciones del usuario
  cargarDirecciones(): void {
    this.direccionService.getDireccionesByUsuario(this.usuarioId).subscribe({
      next: (data) => this.direcciones = data,
      error: (err) => console.error('Error al cargar direcciones:', err)
    });
  }

  // Agregar una nueva dirección
  agregarDireccion(): void {
    this.nuevaDireccion.idPersona = this.usuarioId;
    
    this.direccionService.createDireccion(this.nuevaDireccion).subscribe({
      next: () => {
        this.cargarDirecciones();
        this.nuevaDireccion = { 
          idPersona: this.usuarioId,
          direccion1: '',
          referencia: '',
          departamento: '',
          provincia: '',
          distrito: '',
          codigoPostal: '',
          esPredeterminada: false
        };
      },
      error: (err) => console.error('Error al agregar dirección:', err)
    });
  }

  // Eliminar una dirección
  eliminarDireccion(idDireccion: number): void {
    this.direccionService.deleteDireccion(idDireccion).subscribe({
      next: () => this.cargarDirecciones(),
      error: (err) => console.error('Error al eliminar dirección:', err)
    });
  }

  // Establecer una dirección como predeterminada
  establecerPredeterminada(idDireccion: number): void {
    this.direccionService.setDireccionPredeterminada(idDireccion).subscribe({
      next: () => this.cargarDirecciones(),
      error: (err) => console.error('Error al establecer dirección predeterminada:', err)
    });
  }

  // Cambiar de sección en la interfaz
  mostrarSeccion(seccion: 'profile' | 'addirec' | 'pedidos' | 'misfav'): void {
    this.currentSection = seccion;
  }

  // Validar si el usuario tiene sesión activa
  checkSession(): void {
    const userProfile: any = this.authService.getProfile();
    if (userProfile && userProfile['name']) {
      this.vernombre = true;
      this.displayname = userProfile.name;
    }
  }

  prevpage(): void {
    this.router.navigate(['/inicio']);
  }
}
