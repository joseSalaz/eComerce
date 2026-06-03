import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../Service/categoria.service';
import { Libro } from '../../Interface/libro';
import { switchMap } from 'rxjs/operators'; // Importa switchMap
import { LibroService } from '../../Service/libro.service';
import { AutorService } from '../../Service/autor.service';
import { ProvedorService } from '../../Service/provedor.service';
import { log } from 'console';
import { AutorCategoria } from '../../Interface/autor';
import { Proveedor } from '../../Interface/proveedor';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent implements OnInit {
  datas: Libro[] = [];

  mostrarContenido = false;
  filtros: AutorCategoria[] = [];
  proveedores: Proveedor[] = [];
  idCategoria!: number;
  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute,
    private libroService: LibroService,
    private autor: AutorService,
    private proveedor: ProvedorService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {

      this.idCategoria = Number(params.get('idCategoria'));

      this.obtenerLibros();

      this.obtenerAutores();

      this.obtenerProveedores();

    });
  }

  obtenerLibros(): void {

    this.categoriaService
      .getLibrosPorCategoriaId(this.idCategoria)
      .subscribe(libros => {

        this.datas = libros;

        this.obtenerPrecios();

      });

  }
  obtenerAutores(): void {

    this.autor
      .getListAutorCategoria(this.idCategoria)
      .subscribe(autores => {

        this.filtros = autores;

        console.log(this.filtros);

      });

  }
  obtenerProveedores(): void {

    this.proveedor
      .getListProveedorCategoria(this.idCategoria)
      .subscribe(proveedores => {
        this.proveedores = proveedores;
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

  redireccionarAlDetalleProducto(libroId: number): void {
    this.router.navigate(['/detalle-producto', libroId]);
  }
}









