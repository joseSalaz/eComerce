import { Component } from '@angular/core';
import { CarroService } from '../../Service/carro.service';
import { Libro } from '../../Interface/libro';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrl: './detalle-venta.component.scss'
})
export class DetalleVentaComponent {

  librosEnCarrito: Libro[] = [];

  constructor(private carroService: CarroService) { }

  ngOnInit(): void {
    this.carroService.Libro.subscribe(libros => {
      this.librosEnCarrito = libros;
    });
  }

  calcularPrecioTotal(): number {
    let total = 0;
    for (const libro of this.librosEnCarrito) {
      // total += libro.precio;
    }
    return total;
  }
}
