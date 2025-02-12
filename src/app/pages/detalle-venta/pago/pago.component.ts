import { Component, OnInit } from '@angular/core';
import { CarroService } from '../../../Service/carro.service';
import { HttpClient } from '@angular/common/http';
import { PagoService } from '../../../Service/pago.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss'] // Asegúrate de que la extensión sea .scss si estás usando SASS/SCSS
})
export class PagoComponent implements OnInit {

  isLoading = false;
  mostrarOpcionesEnvio: boolean = false;
  idDireccionSeleccionada: number | null = null;
  constructor(
    private carroService: CarroService, 
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private pago: PagoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      // Obtener la dirección del servicio
      const direccionSeleccionada = this.carroService.getDireccionSeleccionada();
      if (direccionSeleccionada && direccionSeleccionada.idDireccion) {
        this.idDireccionSeleccionada = Number(direccionSeleccionada.idDireccion);
       
      } else {
        this.idDireccionSeleccionada = null;
     
      }
      
      const paymentId = params['paymentId'];
      const payerId = params['PayerID'];
      const preferenceId = params['preferenceId'];
  
      // Lógica de procesamiento de pagos...
      if (paymentId && payerId) {
        this.isLoading = true;
        this.pago.executePayment(paymentId, payerId).subscribe({
          next: (response) => {
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error al confirmar el pago de PayPal:', error);
            this.router.navigate(['']);
            this.isLoading = false;
          }
        });
      } else if (preferenceId) {
        this.isLoading = true;
        this.pago.executePaymentMercadoPago(preferenceId, '').subscribe({
          next: (response) => {
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error al confirmar el pago de Mercado Pago:', error);
            this.router.navigate(['']);
            this.isLoading = false;
          }
        });
      }
    });
  }

  toggleOpcionesEnvio(): void {
    this.mostrarOpcionesEnvio = !this.mostrarOpcionesEnvio;
  }

  procesarPago(metodo: 'paypal' | 'mercadoPago'): void {
    this.isLoading = true;

    if (!this.idDireccionSeleccionada) {
      console.error('No se ha seleccionado una dirección.');
      this.isLoading = false;
      return;
    }

    if (metodo === 'paypal') {
      this.carroService.enviarCarritoAlBackend(this.idDireccionSeleccionada).subscribe({
        next: (response) => {
          const approvalUrl = response.approvalUrl;
      
        
          this.idDireccionSeleccionada;
          window.location.href = approvalUrl;
        },
        error: (error) => {
          console.error('Error al procesar el pago con PayPal:', error);
        }
      });
    } else if (metodo === 'mercadoPago') {
      this.carroService.enviarCarritoAlBackendParaMercadoPago(this.idDireccionSeleccionada).subscribe({
        next: (response) => {
          const urlDePago = response.urlDePago;
          window.location.href = urlDePago;
        },
        error: (error) => {
          console.error('Error al procesar el pago con Mercado Pago:', error);
        }
      });
    }
  }
}