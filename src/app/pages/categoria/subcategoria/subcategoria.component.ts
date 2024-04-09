import { Component, OnInit } from '@angular/core';
import { Libro } from '../../../Interface/libro';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SubCategoriaService } from '../../../Service/subcategoria.service';
@Component({
  selector: 'app-subcategoria',
  templateUrl: './subcategoria.component.html',
  styleUrl: './subcategoria.component.scss'
})
export class SubcategoriaComponent implements OnInit {
    datas: Libro[] = [];
  
    constructor(
       private subcategoriaService: SubCategoriaService,
       private router: Router,
       private route: ActivatedRoute
     ) {}
  
     ngOnInit(): void {
       this.route.paramMap.pipe(
         switchMap(params => {
           const idSubCategoria = Number(params.get('idSubCategoria'));
           return this.subcategoriaService.getLibrosPorSubCategoriaId(idSubCategoria);
         })
       ).subscribe(libros => {
         this.datas = libros; 
       });
     }
  
     redireccionarAlDetalleProducto(libroId: number) {
       this.router.navigate(['/detalle-producto', libroId]);
     }
}
