import { Component, OnInit } from '@angular/core';
import { Libro } from '../../../Interface/libro';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SubCategoriaService } from '../../../Service/subcategoria.service';
import { LibroService } from '../../../Service/libro.service';
import { AutorService } from '../../../Service/autor.service';
import { ProvedorService } from '../../../Service/provedor.service';
import { AutorCategoria } from '../../../Interface/autor';
@Component({
  selector: 'app-subcategoria',
  templateUrl: './subcategoria.component.html',
  styleUrl: './subcategoria.component.scss'
})
export class SubcategoriaComponent implements OnInit {
  datas: Libro[] = [];
  mostrarContenido = false;
  filtros: AutorCategoria[] = [];
  idCategoria!: number;
  idSubCategoria!: number;
  constructor(
    private subcategoriaService: SubCategoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private libroService: LibroService,
    private autor: AutorService,
    private proveedor: ProvedorService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const idSubCategoria = Number(params.get('idSubCategoria'));
        return this.subcategoriaService.getLibrosPorSubCategoriaId(idSubCategoria);
      })
    ).subscribe(libros => {
      this.datas = libros;
      this.obtenerPrecios();
    });
    this.obtenerAutores();
    this.obtenerProveedores();
  }
  obtenerAutores(): void {

    this.autor
      .getListAutorCategoria(
        this.idCategoria,
        this.idSubCategoria
      )
      .subscribe(autores => {

        this.filtros = autores;

        console.log(this.filtros);

      });

  }
  obtenerProveedores(): void {

    this.proveedor
      .getListProveedorCategoria(
        this.idCategoria,
        this.idSubCategoria
      )
      .subscribe(proveedores => {

        console.log(proveedores);

      });

  }
  obtenerPrecios(): void {
    this.datas.forEach((libro, index) => {
      this.libroService.getPreciosPorIdLibro(libro.idLibro).subscribe(precios => {
        if (precios.length > 0 && precios[0].precioVenta != null) {
          this.datas[index].precioVenta = precios[0].precioVenta;
        }
      });
    });
  }
  redireccionarAlDetalleProducto(libroId: number) {
    this.router.navigate(['/detalle-producto', libroId]);
  }
}
