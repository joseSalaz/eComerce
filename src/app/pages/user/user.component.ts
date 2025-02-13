import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
import { DetalleVentaService } from '../../Service/detalle-venta.service';
import { DireccionService } from '../../Service/direccion.service';
import { DetalleVenta } from '../../Interface/detalle_venta';
import { Direccion } from '../../Interface/direccion';
import bootstrap, { Modal } from 'bootstrap';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';


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
  currentSection: string = 'profile';
  //error direccion
  mensajeError: string = '';


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
  direccionModal: any;
  constructor(
    private detalleVentaService: DetalleVentaService,
    private direccionService: DireccionService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
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
validarFormulario() {
  this.mensajeError = '';

  if (!this.nuevaDireccion.direccion1.trim() || 
      !this.nuevaDireccion.distrito.trim() || 
      !this.nuevaDireccion.provincia.trim() || 
      !this.nuevaDireccion.departamento.trim()) {
    this.mensajeError = 'Por favor, completa todos los campos obligatorios.';
    return;
  }
  this.agregarDireccion();
}

abrirModal() {
  if (typeof window !== 'undefined') {
    const modalElement = document.getElementById('direccionModal');
    if (modalElement) {
      import('bootstrap').then(({ Modal }) => {
        const modal = new Modal(modalElement);
        modal.show();
      });
    }
  }
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
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          const modalElement = document.getElementById('direccionModal');
          if (modalElement) {
            import('bootstrap').then(({ Modal }) => {
              const modal = Modal.getInstance(modalElement);
              if (modal) {
                modal.hide();
              }
            });
          }
        }
  
        Swal.fire({
          title: '✅ Dirección agregada',
          text: 'La dirección ha sido guardada correctamente.',
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      },
      error: (err) => {
        console.error('Error al agregar dirección:', err);

        Swal.fire({
          title: '⚠️ Error',
          text: err.error || 'Hubo un problema al agregar la dirección.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }
  

  eliminarDireccion(idDireccion: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la dirección permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.direccionService.deleteDireccion(idDireccion).subscribe({
          next: (response) => {
            this.cargarDirecciones();
            Swal.fire({
              title: '✅ Dirección eliminada',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
          },
          error: (err) => {
            console.error('Error al eliminar dirección:', err);
  
            let mensajeError = 'Ocurrió un error al eliminar la dirección.';
            if (typeof err.error === 'string') {
              mensajeError = err.error; // ✅ Ahora obtendremos el texto del backend correctamente
            }
  
            Swal.fire({
              title: '⚠️ No se puede eliminar',
              text: mensajeError,
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        });
      }
    });
  }
  
  
  
  

  // Establecer una dirección como predeterminada
  establecerPredeterminada(idDireccion: number): void {
    this.direccionService.setDireccionPredeterminada(idDireccion).subscribe({
      next: () => {
        // 🔥 Volver a cargar la lista desde el backend
        this.cargarDirecciones();
  
        // ✅ Mostrar notificación
        this.mostrarToast("✅ Dirección predeterminada actualizada correctamente.");
      },
      error: (err) => {
        console.error('Error al establecer dirección predeterminada:', err);
      }
    });
  }
  
  
  mostrarToast(mensaje: string): void {
    const toast = document.createElement("div");
    toast.innerText = mensaje;
    toast.className = "fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-md";
    document.body.appendChild(toast);
      toast.remove();
   
  }
  // Cambiar de sección en la interfaz
  mostrarSeccion(seccion: string): void {
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
