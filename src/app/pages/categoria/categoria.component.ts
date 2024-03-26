import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../Service/categoria.service';
import { Libro } from '../../Interface/libro';
import { switchMap } from 'rxjs/operators'; // Importa switchMap

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent implements OnInit {
  datas: Libro[] = [];

  constructor(
     private categoriaService: CategoriaService,
     private router: Router,
     private route: ActivatedRoute
   ) {}

   ngOnInit(): void {
     // Utiliza paramMap para suscribirte a los cambios de parámetros de ruta
     this.route.paramMap.pipe(
       switchMap(params => {
         const idCategoria = Number(params.get('idCategoria'));
         return this.categoriaService.getLibrosPorCategoriaId(idCategoria);
       })
     ).subscribe(libros => {
       this.datas = libros; 
     });
   }

   redireccionarAlDetalleProducto(libroId: number) {
     this.router.navigate(['/detalle-producto', libroId]);
   }
}
