import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibroService } from '../../Service/libro.service';
import { Libro } from '../../Interface/libro';
import { Categorium } from '../../Interface/categorium';
import { CategoriaService } from '../../Service/categoria.service';
import { LibroAutorService } from '../../Service/libro_autor.service';
import { CarroService } from '../../Service/carro.service';
import { Precio } from '../../Interface/precio';
import { SubCategoria } from '../../Interface/subcategoria';
import { SubCategoriaService } from '../../Service/subcategoria.service';
import { ItemCarrito } from '../../Interface/carrito';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss']
})
export class DetalleProductoComponent implements OnInit {
  libro: Libro | null = null;
  subcategoria: SubCategoria | null = null;  
  autores: any[] = []; 
  idLibro: number = 0; // Cambié el tipo de 'idLibro' de string a number
  cantidad: number = 1;
  altura: number = 0;
  ancho: number = 0;
  precioVenta: number=0; // Inicializado precioVenta a 0

  constructor(
    private route: ActivatedRoute,
    private libroService: LibroService,
    private categoriaService: CategoriaService,
    private libroAutorService: LibroAutorService,
    private carroService:CarroService,
    private subCategoriaService: SubCategoriaService,
  ) { 
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.obtenerLibro(id);
        console.log(this.libro);
        
      } else {
        console.error('El ID del libro no está definido.');
      }
    });
  }

  obtenerLibro(id: string): void {
    this.libroService.getLibroPorId(id).subscribe(
      (libro: Libro) => {
        this.libro = libro;
        this.idLibro = libro.idLibro; // Asegurándonos de que idLibro tenga el valor correcto
        this.obtenerSubCategoria(libro.idSubCategoria);
        this.obtenerPrecioVenta(); // Ahora llamamos a obtenerPrecioVenta aquí
      },
      (error: any) => {
        console.error('Error al obtener los detalles del libro:', error);
      }
    );
  }
  obtenerSubCategoria(idSubCategoria: number): void {
    if (idSubCategoria) {
      this.subCategoriaService.getSubCategoriaPorId(idSubCategoria).subscribe(
        (subCategoria: SubCategoria) => {
          this.subcategoria = subCategoria;
          console.log('Subcategoría del libro:', this.subcategoria);
        },
        (error: any) => {
          console.error('Error al obtener los detalles de la subcategoría:', error);
        }
      );
    }
  }


  agregarAlCarrito(): void {
    if (!this.libro || this.precioVenta <= 0 || this.cantidad <= 0) {
      this.mostrarError('Datos inválidos. No se puede agregar al carrito.');
      return;
    }
  
    const itemCarrito: ItemCarrito = {
      libro: this.libro,
      precioVenta: this.precioVenta,
      cantidad: this.cantidad
    };
    this.carroService.addNewProduct(itemCarrito);
  }
mostrarError(mensaje: string): void {
  alert(mensaje);
}



  obtenerAutoresDeLibro(idLibro: number): void {
    this.libroAutorService.getAutoresDeLibro(idLibro).subscribe(
      (autores: any[]) => {
        autores.forEach(autor => {
          if (autor.idLibro === idLibro) {
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
  obtenerPrecioVenta(): void {
    if (!this.idLibro) return;
    
    this.libroService.getPreciosPorIdLibro(this.idLibro).subscribe(
      (precios: Precio[]) => {
        const precioConVenta = precios.find(precio => precio.precioVenta != null);
        this.precioVenta = precioConVenta!.precioVenta ?? 0;
      },
      error => {
        console.error('Error al obtener el precio de venta:', error);
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