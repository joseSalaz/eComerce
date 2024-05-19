import { Component } from '@angular/core';
import { Libro } from '../../Interface/libro';
import { CarroService } from '../../Service/carro.service';
import { ItemCarrito } from '../../Interface/carrito';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrl: './detalle-venta.component.scss'
})
export class DetalleVentaComponent {

  isLoading = false;
  librosCarro: Libro[] = [];
  itemsCarrito: ItemCarrito[] = [];
  paymentId: string | null = null;
  payerId: string | null = null;
  showPaymentModal = false;

  constructor(
    private route: ActivatedRoute,
    private carroService: CarroService,
    private router: Router, 
    ) { }

  ngOnInit(): void {
    this.carroService.itemsCarrito.subscribe((items:any) => {
      this.itemsCarrito = items;});
      this.route.paramMap.subscribe(params => {
        this.paymentId = this.route.snapshot.queryParamMap.get('paymentId');
        this.payerId = this.route.snapshot.queryParamMap.get('PayerID');
      });
      this.route.queryParamMap.subscribe(params => {
        this.paymentId = params.get('paymentId');
        this.payerId = params.get('PayerID');
        if (this.paymentId && this.payerId) {
          this.confirmarPago();
        }
      });
  }

  obtenerLibrosCarro() {
    this.carroService.itemsCarrito.subscribe((items:any) => {
      this.itemsCarrito = items;});
  }

  delete(indice:number){
    this.carroService.deleteLibro(indice);
  }
  calcularTotalCarrito(): number {
    return this.itemsCarrito.reduce((total, item) => total + (item.cantidad * item.precioVenta), 0);
  }
  irAPago() {
    this.router.navigate(['/pago']);
  }
  confirmarPago() {
    if (this.paymentId && this.payerId) {

      this.isLoading = true;

      this.carroService.confirmarPago(this.paymentId, this.payerId).subscribe({
        next: (response: any) => {
          this.router.navigate(['/exito']);
          this.showPaymentModal = true;
        },
        error: (error: any) => {
          // Manejo de errores
          console.error('Error al confirmar el pago:', error);
          // Aquí puedes decidir no limpiar el carro y, posiblemente, mostrar un mensaje de error o
          // redirigir a una página de error.
          this.router.navigate(['/error']);
        }
      });
    } else {
      console.error('Payment ID o Payer ID no están disponibles.');
    }
  }
  

}