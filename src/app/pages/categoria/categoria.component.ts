import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../../Service/categoria.service';
import { ApiResponseLibros, Libro, LibroCatalogo } from '../../Interface/libro';
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
  // Nuestra nueva lista optimizada
  listaLibros: LibroCatalogo[] = [];
  cargando: boolean = true;
  categoriaId!: number;
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

      this.obtenerLibros(this.idCategoria);
      this.obtenerAutores();
      this.obtenerProveedores();

    });

  }

  obtenerLibros(id: number): void {

    this.categoriaService.getLibrosPorCategoriaId(id).subscribe({

      next: response => {

        this.listaLibros = response.data;

      },

      error: err => console.error(err)

    });

  }

  obtenerAutores(): void {

    this.autor
      .getListAutorCategoria(this.idCategoria)
      .subscribe(autores => {

        this.filtros = autores;
      });

  }
  obtenerProveedores(): void {

    this.proveedor
      .getListProveedorCategoria(this.idCategoria)
      .subscribe(proveedores => {
        this.proveedores = proveedores;

      });

  }

  redireccionarAlDetalleProducto(libroId: number): void {
    this.router.navigate(['/detalle-producto', libroId]);
  }

  filtrarLibros(filtro: any): void {

    const request = {
      idCategoria: this.idCategoria,
      idSubcategoria: null,
      autores: filtro.autores,
      proveedores: filtro.proveedores,
      precioMinimo: filtro.precioMinimo,
      precioMaximo: filtro.precioMaximo
    };


    this.libroService.filtrarLibros(request)
      .subscribe({

        next: (response: any) => {

          console.log("Resultado filtro:", response);


          this.listaLibros = response.map((item: any) => ({

            libro: {
              idLibro: item.idLibro,
              titulo: item.titulo,
              imagen: item.imagen,
              precioVenta: item.precioVenta
            },

            precio: item.precioVenta

          }));


          console.log("Lista adaptada:", this.listaLibros);

        },

        error: err => {
          console.error(err);
        }

      });

  }
}