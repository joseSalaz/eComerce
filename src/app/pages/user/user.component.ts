import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Service/auth.service';
import { DetalleVentaService } from '../../Service/detalle-venta.service';
import { DireccionService } from '../../Service/direccion.service';
import { VentaService } from '../../Service/venta.service';
import { PersonaService } from '../../Service/persona.service';
import { DetalleVenta } from '../../Interface/detalle_venta';
import { Direccion } from '../../Interface/direccion';
import { Venta } from '../../Interface/venta';
import { Persona } from '../../Interface/persona';
import { EstadoPedido } from '../../Interface/estado_pedido';
import { DetalleVentaModalComponent } from './detalle-venta-modal/detalle-venta-modal.component';
import Swal from 'sweetalert2';

declare var google: any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild(DetalleVentaModalComponent) detalleVentaModalRef!: DetalleVentaModalComponent;
  
  ventas: Venta[] = [];
  detallesVenta: DetalleVenta[] = [];
  direcciones: Direccion[] = [];
  
  persona: Persona = {
    idPersona: 0,
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    tipoDocumento: '',
    numeroDocumento: '',
    telefono: ''
  };

  cargando = false;
  editando = false;
  usuarioId = 0;
  estadosPedidos: { [idDetalleVenta: number]: EstadoPedido } = {};
  
  // Información de usuario
  vernombre: boolean = true;
  displayname: string = "";
  photoURL: string = "";
  email: string = "";

  mostrarModal = false;
  currentSection: string = 'profile';
  mensajeError: string = '';
  detalleVentaSeleccionado: number | null = null;

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
    private ventaService: VentaService,
    private personaService: PersonaService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['section']) {
        this.currentSection = params['section'];
      }
    });

    const usuarioData = typeof window !== 'undefined' && localStorage.getItem('usuarioData')
      ? JSON.parse(localStorage.getItem('usuarioData') || '{}')
      : {};
    
    this.usuarioId = this.authService.getUsuarioId() || usuarioData.idPersona || 0;
    this.persona.idPersona = this.usuarioId;

    if (this.usuarioId) {
      this.obtenerVentas();
      this.cargarDatosPersona();
      this.cargarDirecciones();
    }

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

    this.checkSession();
  }

  validarFormulario(): void {
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

  abrirModal(): void {
    this.mostrarModal = true;
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      this.inicializarMapa();
    }, 100);
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    document.body.style.overflow = '';
    this.mensajeError = '';
  }
inicializarMapa(): void {
    const mapaContenedor = document.getElementById('map');
    
    if (!mapaContenedor) {
      console.error('No se encontró el contenedor con id "map"');
      return;
    }

    // Coordenadas iniciales por defecto (Jauja, Junín o tu ciudad predeterminada)
    const coordenadasIniciales = { lat: -11.7772, lng: -75.5003 };

    const opcionesMapa = {
      center: coordenadasIniciales,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    const mapa = new google.maps.Map(mapaContenedor, opcionesMapa);

    const marcador = new google.maps.Marker({
      position: coordenadasIniciales,
      map: mapa,
      draggable: true,
      title: "Arrastra el pin o haz clic en el mapa"
    });

    // Instanciamos el servicio Geocoder de Google
    const geocoder = new google.maps.Geocoder();

    // 1️⃣ EVENTO: Cuando el usuario hace CLIC en cualquier parte del mapa
    google.maps.event.addListener(mapa, 'click', (evento: any) => {
      const coordenadas = evento.latLng;
      marcador.setPosition(coordenadas); // Movemos el pin al lugar del clic
      this.obtenerDireccionDesdeCoordenadas(coordenadas, geocoder);
    });

    // 2️⃣ EVENTO: Cuando el usuario termina de ARRASTRAR el marcador
    google.maps.event.addListener(marcador, 'dragend', () => {
      const coordenadas = marcador.getPosition();
      this.obtenerDireccionDesdeCoordenadas(coordenadas, geocoder);
    });
  }

  // Método auxiliar que procesa los datos geográficos de Google y actualiza los inputs de Angular
  obtenerDireccionDesdeCoordenadas(latLng: any, geocoder: any): void {
    geocoder.geocode({ location: latLng }, (resultados: any, estado: string) => {
      if (estado === 'OK' && resultados[0]) {
        const componentesDireccion = resultados[0].address_components;
        
        // Inicializamos variables temporales para capturar los datos estructurados
        let calleNumero = '';
        let distrito = '';
        let provincia = '';
        let departamento = '';
        let codigoPostal = '';

        // Recorremos la estructura de dirección que devuelve la API de Google
        for (const componente of componentesDireccion) {
          const tipos = componente.types;

          if (tipos.includes('route')) {
            calleNumero = componente.long_name;
          } else if (tipos.includes('street_number')) {
            calleNumero += ' ' + componente.long_name;
          } else if (tipos.includes('locality') || tipos.includes('sublocality_level_1')) {
            distrito = componente.long_name;
          } else if (tipos.includes('administrative_area_level_2')) {
            provincia = componente.long_name;
          } else if (tipos.includes('administrative_area_level_1')) {
            departamento = componente.long_name;
          } else if (tipos.includes('postal_code')) {
            codigoPostal = componente.long_name;
          }
        }

        // Si la dirección formateada por Google no encontró el nombre de la calle, usamos la dirección larga provista por defecto
        const direccionFormateada = calleNumero.trim() ? calleNumero.trim() : resultados[0].formatted_address.split(',')[0];

        // 💡 Asignamos los valores directamente al objeto vinculado con [(ngModel)]
        this.nuevaDireccion.direccion1 = direccionFormateada;
        this.nuevaDireccion.distrito = distrito;
        this.nuevaDireccion.provincia = provincia;
        this.nuevaDireccion.departamento = departamento;
        this.nuevaDireccion.codigoPostal = codigoPostal;

        // Forzamos a Angular a procesar los cambios de inmediato en la vista del formulario
        this.cdr.detectChanges();

      } else {
        console.warn('No se pudo determinar la dirección para estas coordenadas:', estado);
      }
    });
  }
  cerrarModalAlFondo(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cerrarModal();
    }
  }

  obtenerVentas(): void {
    this.ventaService.obtenerVentasPorPersona(this.usuarioId).subscribe({
      next: (ventas) => {
        this.ventas = ventas;
        if (this.ventas.length > 0) {
          this.obtenerDetallesVenta(this.ventas[0].idVentas);
        }
      },
      error: (error) => console.error('Error al obtener ventas:', error)
    });
  }

  obtenerDetallesVenta(idVenta: number): void {
    this.ventaService.obtenerDetallesVenta(idVenta).subscribe({
      next: (detalles) => {
        this.detallesVenta = detalles;
        this.detallesVenta.forEach(detalle => {
          if (detalle.idDetalleVentas) { 
            this.obtenerEstadoPedido(detalle.idDetalleVentas);
          }
        });
      },
      error: (error) => console.error('🚨 Error al obtener detalles de venta:', error)
    });
  }

  cargarDirecciones(): void {
    this.direccionService.getDireccionesByUsuario(this.usuarioId).subscribe({
      next: (data) => this.direcciones = data,
      error: (err) => console.error('Error al cargar direcciones:', err)
    });
  }

  agregarDireccion(): void {
    this.nuevaDireccion.idPersona = this.usuarioId;

    this.direccionService.createDireccion(this.nuevaDireccion).subscribe({
      next: () => {
        this.cargarDirecciones();
        this.cerrarModal();
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
          next: () => {
            this.cargarDirecciones();
            Swal.fire({
              title: '✅ Dirección eliminada',
              icon: 'success',
              confirmButtonText: 'Ok'
            });
          },
          error: (err) => {
            let msg = 'Ocurrió un error al eliminar la dirección.';
            if (typeof err.error === 'string') { msg = err.error; }
            Swal.fire({
              title: '⚠️ No se puede eliminar',
              text: msg,
              icon: 'error',
              confirmButtonText: 'Ok'
            });
          }
        });
      }
    });
  }

  abrirModalVenta(idVenta: number): void {
    this.obtenerDetallesVenta(idVenta);
    setTimeout(() => {
      if (this.detalleVentaModalRef) {
        this.detalleVentaModalRef.abrirModal();
      }
    }, 300);
  }

  // Métodos reactivados para solucionar el error del HTML
  verEstadoPedido(idDetalleVentas: number): void {
    this.detalleVentaSeleccionado = idDetalleVentas;
  }

  onCerrarEstadoPedido(): void {
    this.detalleVentaSeleccionado = null;
  }

  establecerPredeterminada(idDireccion: number): void {
    this.direccionService.setDireccionPredeterminada(idDireccion).subscribe({
      next: () => {
        this.cargarDirecciones();
        this.mostrarToast("✅ Dirección predeterminada actualizada correctamente.");
      },
      error: (err) => console.error('Error al establecer dirección predeterminada:', err)
    });
  }

  mostrarToast(mensaje: string): void {
    const toast = document.createElement("div");
    toast.innerText = mensaje;
    toast.className = "fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-md z-50 transition-opacity duration-300";
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  mostrarSeccion(seccion: string): void {
    this.currentSection = seccion;
  }

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

  obtenerEstadoPedido(idDetalleVenta: number): void {
    this.ventaService.obtenerEstadoPedido(idDetalleVenta).subscribe({
      next: (estadoPedido) => {
        this.estadosPedidos[idDetalleVenta] = estadoPedido;
      },
      error: () => console.warn(`No se encontró estado de pedido para el detalle ${idDetalleVenta}`)
    });
  }

  irAEstadoPedido(idDetalleVentas: number | undefined): void {
    if (!idDetalleVentas) return;
    this.router.navigate(['/user/detalle-pedido'], { queryParams: { id: idDetalleVentas } });
  }

  cargarDatosPersona(): void {
    this.personaService.obtenerPersonaPorId(this.usuarioId).subscribe({
      next: (persona) => this.persona = persona,
      error: (error) => console.error('Error al obtener datos de la persona:', error)
    });
  }

  toggleEditar(): void {
    this.editando = !this.editando;
    if (!this.editando) {
      this.cargarDatosPersona();
    }
  }

  actualizarUsuario(): void {
    if (!this.persona.idPersona) return;

    this.personaService.actualizarPersona(this.persona).subscribe({
      next: () => {
        Swal.fire({
          title: 'Éxito',
          text: 'Datos actualizados correctamente',
          icon: 'success'
        }).then(() => {
          this.editando = false;
          this.cargarDatosPersona();
        });
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar la información',
          icon: 'error'
        });
      }
    });
  }
}