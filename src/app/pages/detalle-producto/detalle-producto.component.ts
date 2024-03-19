import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibroService } from '../../Service/libro.service';
import { Libro } from '../../Interface/libro';
import { Categorium } from '../../Interface/categorium';
import { CategoriaService } from '../../Service/categoria.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss']
})
export class DetalleProductoComponent implements OnInit {
  libro: any;
  categoria: any;
  idLibro: string = '';
  cantidad: number = 1;
  altura: number = 0;
  ancho: number = 0;

  constructor(
    private route: ActivatedRoute,
    private libroService: LibroService,
    private categoriaService: CategoriaService
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
        // Manejar el caso en el que no se recibe un ID
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
      },
      (error: any) => {
        console.error('Error al obtener los detalles del libro:', error);
      }
    );
  }

  obtenerCategoriaPorId(id: number): void {
    this.categoriaService.getCategoriaPorId(id).subscribe(
      (categoriaData: Categorium) => {
        if (categoriaData) {
          this.categoria = categoriaData;
          console.log(this.categoria); 
        } else {
          console.error('La categoría devuelta es nula o indefinida.');
        }
      },
      (categoriaError: any) => {
        console.error('Error al obtener los detalles de la categoría:', categoriaError);
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
