import { Component, OnInit } from '@angular/core';
import { Libro } from '../../../Interface/libro';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SubCategoriaService } from '../../../Service/subcategoria.service';
import { LibroService } from '../../../Service/libro.service';
import { AutorService } from '../../../Service/autor.service';
import { ProvedorService } from '../../../Service/provedor.service';
import { AutorCategoria } from '../../../Interface/autor';
import { Proveedor } from '../../../Interface/proveedor';
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
  proveedores: Proveedor[] = [];
  constructor(
    private subcategoriaService: SubCategoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private libroService: LibroService,
    private autor: AutorService,
    private proveedor: ProvedorService
  ) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      this.idCategoria = Number(params.get('idCategoria'));

      this.idSubCategoria = Number(params.get('idSubCategoria'));

      console.log('Categoria:', this.idCategoria);

      console.log('Subcategoria:', this.idSubCategoria);

      this.obtenerLibros();

      this.obtenerAutores();

      this.obtenerProveedores();

    });

  }


  obtenerLibros(): void {

    this.subcategoriaService
      .getLibrosPorSubCategoriaId(this.idSubCategoria)
      .subscribe(libros => {

        this.datas = libros;

        this.obtenerPrecios();

      });

  }
  obtenerAutores(): void {

    this.autor
      .getListAutorCategoria(
        this.idCategoria,
        this.idSubCategoria
      )
      .subscribe(autores => {

        this.filtros = autores;
      });

  }
  obtenerProveedores(): void {

    this.proveedor
      .getListProveedorCategoria(
        this.idCategoria,
        this.idSubCategoria
      )
      .subscribe(proveedores => {
        this.proveedores = proveedores;
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

  filtrarLibros(filtro: any): void {

    const request = {
      idCategoria: this.idCategoria,
      idSubcategoria: this.idSubCategoria,
      autores: filtro.autores,
      proveedores: filtro.proveedores,
      precioMinimo: filtro.precioMinimo,
      precioMaximo: filtro.precioMaximo
    };

    this.libroService.filtrarLibros(request)
      .subscribe(data => {

        this.datas = data;

      });

  }
}
