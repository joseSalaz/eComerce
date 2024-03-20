import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibroService } from '../../Service/libro.service';
import { Libro } from '../../Interface/libro';
import { Categorium } from '../../Interface/categorium';
import { CategoriaService } from '../../Service/categoria.service';
<<<<<<< HEAD
import { CarroService } from '../../Service/carro.service';
=======
import { LibroAutorService } from '../../Service/libro_autor.service';
>>>>>>> 790e8a7c51a052ffc59d242d2e1bd5f4071b8157

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
<<<<<<< HEAD
  libroSeleccionado: Libro | undefined;
  
=======
>>>>>>> 790e8a7c51a052ffc59d242d2e1bd5f4071b8157

  constructor(
    private route: ActivatedRoute,
    private libroService: LibroService,
    private categoriaService: CategoriaService,
<<<<<<< HEAD
    private carroService : CarroService
=======
    private libroAutorService: LibroAutorService
>>>>>>> 790e8a7c51a052ffc59d242d2e1bd5f4071b8157
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
        this.obtenerAutoresDeLibro(this.libro.id);
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

  obtenerAutoresDeLibro(idLibro: string): void {
    this.libroAutorService.getAutores().subscribe(
      (autores: any[]) => {
        // Filtrar los autores por el ID del libro
        const idLibroNumero = parseInt(idLibro, 10); // Convertir idLibro a número
        this.autores = autores.filter(autor => autor.idLibro === idLibroNumero);
        console.log('Autores del libro:', this.autores); 
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


  agregarAlCarrito(libro: Libro) {
        this.carroService.addNewProduct(libro);
  }
}

