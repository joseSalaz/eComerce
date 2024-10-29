import { Component, OnInit } from '@angular/core';
import { Libro } from '../../Interface/libro';
import { CarroService } from '../../Service/carro.service';
import { ItemCarrito } from '../../Interface/carrito';
import { ActivatedRoute, Router } from '@angular/router';

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

  constructor(
    private route: ActivatedRoute,
    private carroService: CarroService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.carroService.itemsCarrito.subscribe((items: any) => {
      this.itemsCarrito = items;
    });

    // Suscribirse a los parámetros de la consulta
    this.route.queryParamMap.subscribe(params => {
      // Para PayPal
      let paypalPaymentId = params.get('paymentId');
      let payerId = params.get('PayerID');

      // Para Mercado Pago
      let mercadoPagoPaymentId = params.get('payment_id');
      let preferenceId = params.get('preference_id');
      let collectionId = params.get('collection_id');

      console.log('PayPal Payment ID:', paypalPaymentId);
      console.log('PayPal Payer ID:', payerId);
      console.log('Mercado Pago Payment ID:', mercadoPagoPaymentId);
      console.log('Preference ID:', preferenceId);
      console.log('Collection ID:', collectionId);

      // Confirmar pago según los parámetros disponibles
      if (paypalPaymentId && payerId) {
        this.paymentId = paypalPaymentId;
        this.payerId = payerId;
        this.confirmarPagoPayPal();
      } else if (mercadoPagoPaymentId && preferenceId) {
        this.paymentId = mercadoPagoPaymentId;
        this.preferenceId = preferenceId;
        this.collectionId = collectionId;
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

  irAPago() {
    this.router.navigate(['/pago']);
  }

   // Método para confirmar el pago de PayPal
   confirmarPagoPayPal() {
    if (this.paymentId && this.payerId) {
      this.isLoading = true;
      this.carroService.confirmarPago(this.paymentId!, this.payerId!).subscribe({
        next: () => {
          this.isLoading = false;
          this.showModalRespuestas = true;
          this.isSuccess = true;
        },
        error: () => {
          this.isLoading = false;
          this.showModalRespuestas = true;
          this.isSuccess = false;
        }
      });
    }
  }

  // Método para confirmar el pago de Mercado Pago
  confirmarPagoMercadoPago() {
    if (this.paymentId && this.preferenceId) {
      this.isLoading = true;
      this.carroService.confirmarPagoConMercadoPago(this.paymentId!, this.preferenceId!).subscribe({
        next: () => {
          this.isLoading = false;
          this.showModalRespuestas = true;
          this.isSuccess = true;
        },
        error: () => {
          this.isLoading = false;
          this.showModalRespuestas = true;
          this.isSuccess = false;
        }
      });
    }
  }
}
