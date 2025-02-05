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

  constructor(
    private carroService: CarroService, 
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private pago: PagoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const paymentId = params['paymentId'];
      const payerId = params['PayerID'];
      const preferenceId = params['preferenceId']; // Nuevo para Mercado Pago

      // Verifica si la URL contiene los parámetros esperados de PayPal
      if (paymentId && payerId) {
        this.isLoading = true; // Activa el indicador de carga al iniciar el proceso de ejecución del pago
        this.pago.executePayment(paymentId, payerId).subscribe({
          next: (response) => {
            this.isLoading = false; // Desactiva el indicador de carga después de completar el proceso
          },
          error: (error) => {
            console.error('Error al confirmar el pago de PayPal:', error);
            this.router.navigate(['']);
            this.isLoading = false;
          }
        });
      } else if (preferenceId) { // Verifica si hay un preferenceId para Mercado Pago
        this.isLoading = true; // Activa el indicador de carga
        this.pago.executePaymentMercadoPago(preferenceId, '').subscribe({
          next: (response) => {
            this.isLoading = false; // Desactiva el indicador de carga después de completar el proceso
            // Manejar la respuesta de Mercado Pago aquí si es necesario
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

    if (metodo === 'paypal') {
      this.carroService.enviarCarritoAlBackend().subscribe({
        next: (response) => {
          const approvalUrl = response.approvalUrl;
          window.location.href = approvalUrl; // Redirige al usuario a PayPal
        },
        error: (error) => {
          console.error('Error al procesar el pago con PayPal:', error);
        }
      });
    } else if (metodo === 'mercadoPago') {
      this.carroService.enviarCarritoAlBackendParaMercadoPago().subscribe({
        next: (response) => {
          const urlDePago = response.urlDePago; // Asegúrate de que la propiedad coincida con lo que envía tu backend
          window.location.href = urlDePago; // Redirige al usuario a Mercado Pago
        },
        error: (error) => {
          console.error('Error al procesar el pago con Mercado Pago:', error);
        }
      });
    }
  }
}
