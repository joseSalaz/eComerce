import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibroService } from '../../Service/libro.service';
import { Libro } from '../../Interface/libro';
import { Categorium } from '../../Interface/categorium';
import { switchMap } from 'rxjs/operators';
import { CategoriaService } from '../../Service/categoria.service';
import { LibroAutorService } from '../../Service/libro_autor.service';
import { CarroService } from '../../Service/carro.service';
import { SubCategoriaService } from '../../Service/subcategoria.service';
import { SubCategoria } from '../../Interface/subcategoria';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss']
})
export class DetalleProductoComponent implements OnInit {
  libro: any;
  subcategoria: any;
  autores: any[] = []; 
  idLibro: string = '';
  cantidad: number = 1;
  altura: number = 0;
  ancho: number = 0;

  constructor(
    private route: ActivatedRoute,
    private libroService: LibroService,
    private categoriaService: CategoriaService,
    private subCategoriaService: SubCategoriaService,
    private libroAutorService: LibroAutorService,
    private carroService:CarroService
  ) { 
    this.subcategoria = undefined;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.obtenerLibro(id);
      } else {
        console.error('El ID del libro no está definido.');
      }
    });
  }

  obtenerLibro(id: string): void {
    this.libroService.getLibroPorId(id).subscribe(
      (libro: Libro) => {
        this.libro = libro;
        console.log('Detalles del libro:', this.libro);
        this.obtenerSubCategoria(libro.idSubCategoria);
      },
      (error: any) => {
        console.error('Error al obtener los detalles del libro:', error);
      }
    );
  }

  obtenerSubCategoria(idSubCategoria: number): void {
    if (idSubCategoria) {
      this.subCategoriaService.getSubCategoriaPorId(idSubCategoria).subscribe(
        (subcategoria: SubCategoria) => {
          this.subcategoria = subcategoria;
          console.log('Subcategoría del libro:', this.subcategoria);
        },
        (error: any) => {
          console.error('Error al obtener los detalles de la subcategoría:', error);
        }
      );
    }
  }
 agregarAlCarrito(libro: Libro) {
        this.carroService.addNewProduct(libro);
  }
  
  obtenerAutoresDeLibro(idLibro: string): void {
    this.libroAutorService.getAutoresDeLibro(parseInt(idLibro)).subscribe(
      (autores: any[]) => {
        autores.forEach(autor => {
          if (autor.idLibro === parseInt(idLibro)) {
            this.libroAutorService.getAutorPorId(autor.idAutor).subscribe(
              (autorDetalle: any) => {
                this.autores.push(autorDetalle);
              },
              (error: any) => {
                console.error('Error al obtener los detalles del autor:', error);
              }
            );
          }
        });
      },
      (error: any) => {
        console.error('Error al obtener los autores del libro:', error);
      }
    );
  }
  
  incrementarCantidad(): void {
    this.cantidad++;
  }

  decrementarCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--; 
    }
  }
}
