import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibroService } from '../../Service/libro.service';
import { Libro } from '../../Interface/libro';
import { Categorium } from '../../Interface/categorium';
import { CategoriaService } from '../../Service/categoria.service';
import { LibroAutorService } from '../../Service/libro_autor.service';
import { CarroService } from '../../Service/carro.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss']
})
export class DetalleProductoComponent implements OnInit {
  libro: any;
  categoria: any;
  autores: any[] = []; 
  idLibro: string = '';
  cantidad: number = 1;
  altura: number = 0;
  ancho: number = 0;

  constructor(
    private route: ActivatedRoute,
    private libroService: LibroService,
    private categoriaService: CategoriaService,
    private libroAutorService: LibroAutorService,
    private carroService:CarroService
  ) { 
    this.categoria = undefined;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.idLibro = id;
        this.obtenerDatosLibro(this.idLibro);
      } else {
      
      }
    });
  }

  obtenerDatosLibro(id: string): void {
    this.libroService.getLibroPorId(id).subscribe(
      (data: Libro) => {
        this.libro = data; 

        if (this.libro.tamanno) {
          const tamannoSplit = this.libro.tamanno.split('*');
          if (tamannoSplit.length === 2) {
            this.altura = parseFloat(tamannoSplit[0]);
            this.ancho = parseFloat(tamannoSplit[1]);
          }
        }
        
        this.obtenerCategoriaPorId(this.libro.idCategoria.toString());
        this.obtenerAutoresDeLibro(this.idLibro)
      },
      (error: any) => {
        console.error('Error al obtener los detalles del libro:', error);
      }
    );
  }

 agregarAlCarrito(libro: Libro) {
        this.carroService.addNewProduct(libro);
  }
  

  obtenerCategoriaPorId(id: number): void {
    this.categoriaService.getCategoriaPorId(id).subscribe(
      (categoriaData: Categorium) => {
        if (categoriaData) {
          this.categoria = categoriaData;
          console.log('Categoría del libro:', this.categoria);
        } else {
          console.error('La categoría devuelta es nula o indefinida.');
        }
      },
      (categoriaError: any) => {
        console.error('Error al obtener los detalles de la categoría:', categoriaError);
      }
    );
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
