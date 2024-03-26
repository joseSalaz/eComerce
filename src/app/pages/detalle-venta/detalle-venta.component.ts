import { Component } from '@angular/core';
<<<<<<< HEAD
import { CarroService } from '../../Service/carro.service';
import { Libro } from '../../Interface/libro';
=======
import { Libro } from '../../Interface/libro';
import { CarroService } from '../../Service/carro.service';
>>>>>>> José

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrl: './detalle-venta.component.scss'
})
export class DetalleVentaComponent {

<<<<<<< HEAD
  librosEnCarrito: Libro[] = [];
=======
  librosCarro: Libro[] = [];
>>>>>>> José

  constructor(private carroService: CarroService) { }

  ngOnInit(): void {
<<<<<<< HEAD
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
=======
    this.obtenerLibrosCarro();
  }

  obtenerLibrosCarro() {
    this.carroService.Libro.subscribe(libros => {
      this.librosCarro = libros;
    });
  }

  delete(indice:number){
    this.carroService.deleteLibro(indice);
>>>>>>> José
  }
}
