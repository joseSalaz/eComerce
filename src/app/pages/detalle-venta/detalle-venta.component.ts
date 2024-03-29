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

  librosCarro: Libro[] = [];
  itemsCarrito: ItemCarrito[] = [];
  paymentId: string | null = null;
  payerId: string | null = null;
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
      this.carroService.confirmarPago(this.paymentId, this.payerId).subscribe({
        next: (response:any) => {
          // Aquí podrías redirigir al usuario a una página de éxito o mostrar un mensaje
          console.log('Pago confirmado con éxito:', response);
          // this.router.navigate(['/exito']); // Redirige a una ruta de éxito en tu app
        },
        error: (error:any) => {
          // Aquí manejas los errores, como mostrar un mensaje al usuario
          console.error('Error al confirmar el pago:', error);
        }
      });
    } else {
      console.error('Payment ID o Payer ID no están disponibles.');
    }
  }

}