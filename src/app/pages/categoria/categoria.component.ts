import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LibroService } from '../../Service/libro.service';
import { Libro } from '../../Interface/libro';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent {
  datas: Libro[] = [];
  firstItemId: number = 0;

  @Input() categoria: string=""; 

  // constructor(
  //   private _libroServicio: LibroService,
  //   private router: Router
  // ) {
  //   this.obtenerLibrosPorCategoria();
  // }

  // obtenerLibrosPorCategoria() {
  //   this._libroServicio.getLibrosPorCategoria(this.categoria).subscribe(libros => {
  //     this.datas = libros;
  //     if (this.datas.length > 0) {
  //       this.firstItemId = this.datas[0].idLibro;
  //     }
  //   });
  // }

  // comprar(libroId: number) {
  //   this.router.navigate(['/detalle-producto', libroId]);
  // }
}

