import { Component } from '@angular/core';
import { Libro } from '../../Interface/libro';
import { CarroService } from '../../Service/carro.service';

@Component({
  selector: 'app-detalle-venta',
  templateUrl: './detalle-venta.component.html',
  styleUrl: './detalle-venta.component.scss'
})
export class DetalleVentaComponent {

  librosCarro: Libro[] = [];

  constructor(private carroService: CarroService) { }

  ngOnInit(): void {
    this.obtenerLibrosCarro();
  }

  obtenerLibrosCarro() {
    this.carroService.Libro.subscribe(libros => {
      this.librosCarro = libros;
    });
  }

  delete(indice:number){
    this.carroService.deleteLibro(indice);
  }
}