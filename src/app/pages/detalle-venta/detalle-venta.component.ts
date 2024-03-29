import { Component } from '@angular/core';
import { Libro } from '../../Interface/libro';
import { CarroService } from '../../Service/carro.service';
import { ItemCarrito } from '../../Interface/carrito';
import { Router } from '@angular/router';
@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrl: './detalle-venta.component.scss'
})
export class DetalleVentaComponent {

  librosCarro: Libro[] = [];
  itemsCarrito: ItemCarrito[] = [];
  constructor(
    private carroService: CarroService,
    private router: Router, 
    ) { }

  ngOnInit(): void {
    this.carroService.itemsCarrito.subscribe((items:any) => {
      this.itemsCarrito = items;});
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
}