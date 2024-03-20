import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibroService } from '../../Service/libro.service';
import { Libro } from '../../Interface/libro';
import { Categorium } from '../../Interface/categorium';
import { CategoriaService } from '../../Service/categoria.service';
import { CarroService } from '../../Service/carro.service';

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
  libroSeleccionado: Libro | undefined;
  

  constructor(
    private route: ActivatedRoute,
    private libroService: LibroService,
    private categoriaService: CategoriaService,
    private carroService : CarroService
  ) { 
    this.categoria = undefined;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.idLibro = id;
    } else {
      // Manejar el caso en el que no se recibe un ID
    }

    this.libroService.getLibroPorId(this.idLibro).subscribe(
      (data: Libro) => {
        this.libro = data;
        console.log(this.libro); 

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
          console.log('ID del libro:', id); 
          console.log('Datos del libro:', this.libro); 
          console.log('Datos de la categoría:', categoriaData); 
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


  agregarAlCarrito(libro: Libro) {
        this.carroService.addNewProduct(libro);
  }
}

