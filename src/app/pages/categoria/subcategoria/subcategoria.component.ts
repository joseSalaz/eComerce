import { Component, OnInit } from '@angular/core';
import { ApiResponseLibros, LibroCatalogo, LibroFiltroResponse } from '../../../Interface/libro';
import { ActivatedRoute, Router } from '@angular/router';
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

  filtros: AutorCategoria[] = [];
  proveedores: Proveedor[] = [];

  idCategoria!: number;
  idSubCategoria!: number;

  listaLibros: LibroCatalogo[] = [];

  librosFiltrados: LibroFiltroResponse[] = [];

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


      console.log("Categoria:", this.idCategoria);
      console.log("Subcategoria:", this.idSubCategoria);


      this.obtenerLibros();
      this.obtenerAutores();
      this.obtenerProveedores();

    });

  }



  obtenerLibros(): void {

    this.subcategoriaService
      .getLibrosPorSubCategoriaId(this.idSubCategoria)
      .subscribe({

        next: (response: ApiResponseLibros) => {

          console.log("Respuesta libros:", response);

          this.listaLibros = response.data;

        },

        error: err => {
          console.error(err);
        }

      });

  }


  obtenerAutores(): void {

    this.autor
      .getListAutorCategoria(
        this.idCategoria,
        this.idSubCategoria
      )
      .subscribe(data => {

        this.filtros = data;

      });

  }



  obtenerProveedores(): void {

    this.proveedor
      .getListProveedorCategoria(
        this.idCategoria,
        this.idSubCategoria
      )
      .subscribe(data => {

        this.proveedores = data;

      });

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
      .subscribe({

        next: (response: LibroFiltroResponse[]) => {


          console.log("Resultado filtro:", response);


          this.librosFiltrados = response;


        },


        error: err => {

          console.error(err);

        }

      });


  }



  redireccionarAlDetalleProducto(idLibro: number) {

    this.router.navigate([
      '/detalle-producto',
      idLibro
    ]);

  }

}