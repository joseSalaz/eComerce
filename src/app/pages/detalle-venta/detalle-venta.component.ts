import { Component, OnInit } from '@angular/core';
import { Libro } from '../../Interface/libro';
import { CarroService } from '../../Service/carro.service';
import { ItemCarrito } from '../../Interface/carrito';
import { ActivatedRoute, Router } from '@angular/router';
import { Direccion } from '../../Interface/direccion';
import { DireccionService } from '../../Service/direccion.service';
import { log } from 'console';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrls: ['./detalle-venta.component.scss']
})
export class DetalleVentaComponent implements OnInit {
  isLoading = false;
  librosCarro: Libro[] = [];
  itemsCarrito: ItemCarrito[] = [];
  paymentId: string | null = null;
  payerId: string | null = null;
  preferenceId: string | null = null;
  collectionId: string | null = null;
  showModalRespuestas = false;
  isSuccess = false;
  showModalPago: boolean = false;
  direcciones: Direccion[] = []; // Lista de direcciones
  direccionSeleccionada: Direccion | null = null;

  constructor(
    private route: ActivatedRoute,
    private carroService: CarroService,
    private router: Router,
    private direccionService: DireccionService,
  ) { }

  ngOnInit(): void {
    this.obtenerDireccionesUsuario();

    this.carroService.itemsCarrito.subscribe((items: any) => {
      this.itemsCarrito = items;
    });

    // Depuración: Imprimir parámetros de la URL
    this.route.queryParamMap.subscribe(params => {
      // Para PayPal
      this.paymentId = params.get('paymentId');
      this.payerId = params.get('PayerID');

      // Para Mercado Pago
      this.paymentId = this.paymentId || params.get('payment_id');
      this.preferenceId = params.get('preference_id');
      this.collectionId = params.get('collection_id');

      // Validación de parámetros antes de confirmar pago
      if (this.paymentId && this.payerId) {
     
        this.confirmarPagoPayPal();
      } else if (this.paymentId && this.preferenceId) {
        this.confirmarPagoMercadoPago();
      } else {
        console.error('No se proporcionaron los IDs necesarios para confirmar el pago.');
      }
    });
  }
  delete(indice: number) {
    this.carroService.deleteLibro(indice);
  }

  calcularTotalCarrito(): number {
    return this.itemsCarrito.reduce((total, item) => total + (item.cantidad * item.precioVenta), 0);
  }
  // Obtener direcciones del usuario
  obtenerDireccionesUsuario(): void {
    if (typeof window !== 'undefined') {
    const usuarioData = JSON.parse(localStorage.getItem('usuarioData') || '{}');
    const usuarioId = usuarioData.idPersona; // Asegurar que el usuario tiene un ID válido

    if (!usuarioId) {
      console.error('Error: No se encontró un ID de usuario en localStorage.');
      return;
    }

    this.direccionService.getDireccionesByUsuario(usuarioId).subscribe({
      next: (data) => {
        this.direcciones = data;
        if (this.direcciones.length > 0) {
          this.direccionSeleccionada = this.direcciones[0]; // Seleccionar la primera dirección por defecto
        }
      },
      error: (err) => console.error('Error al obtener direcciones:', err),
    });
    }
  }

  // Cambiar la dirección seleccionada
  seleccionarDireccion(direccion: Direccion): void {
    debugger
    this.direccionSeleccionada = direccion;
    this.carroService.setDireccionSeleccionada(direccion); // ✅ Guardar en el servicio
  }
  

  // Redirigir a la página de pago con la dirección seleccionada
  irAPago() {
    if (!this.direccionSeleccionada || !this.direccionSeleccionada.idDireccion) {
      Swal.fire({
        title: '⚠️ Atención',
        text: 'Por favor, selecciona una dirección antes de continuar.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#d33'
      });
      return;
    }
  
    this.router.navigate(['/pago'], {
      queryParams: { direccionId: this.direccionSeleccionada.idDireccion }
    });
  }
  

  // Confirmar pago PayPal
  confirmarPagoPayPal() {
    if (this.paymentId && this.payerId) {
      
      this.isLoading = true;
      this.carroService.confirmarPago(this.paymentId, this.payerId).subscribe({
        next: () => {
          this.isLoading = false;
          this.showModalRespuestas = true;
          this.isSuccess = true;
        },
        error: (err) => {
          console.error("Error en confirmación de PayPal:", err);
          this.isLoading = false;
          this.showModalRespuestas = true;
          this.isSuccess = false;
        }
      });
    }
  }

  // Confirmar pago Mercado Pago
  confirmarPagoMercadoPago() {
    if (this.paymentId && this.preferenceId) {
      this.isLoading = true;
      this.carroService.confirmarPagoConMercadoPago(this.paymentId, this.preferenceId).subscribe({
        next: () => {
          this.isLoading = false;
          this.showModalRespuestas = true;
          this.isSuccess = true;
        },
        error: (err) => {
          console.error("Error en confirmación de MercadoPago:", err);
          this.isLoading = false;
          this.showModalRespuestas = true;
          this.isSuccess = false;
        }
      });
    }
  }

  abrirModalPago() {
    if (!this.direccionSeleccionada || !this.direccionSeleccionada.idDireccion) {
      Swal.fire({
        title: '📍 Selecciona una dirección',
        text: 'Debes elegir una dirección de envío antes de proceder.',
        icon: 'warning',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#d33'
      });
      return;
    }
  
    this.carroService.setDireccionSeleccionada(this.direccionSeleccionada);
    this.showModalPago = true;
  }
  
  

  cerrarModalPago() {
    this.showModalPago = false;
  }
}
