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
import { Autor } from '../../Interface/autor';
import { switchMap } from 'rxjs/operators';
import { Kardex } from '../../Interface/kardex';

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
  idSubCategoria: number =0;
  stockDisponible: number = 0;
  kardex: Kardex | null = null;  
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
        this.obtenerAutoresDeLibro(+id);
        this.obtenerKardex(+id);
      } else {
        console.error('El ID del libro no está definido.');
      }
    });
    
  }
  mostrarError(mensaje: string): void {
    alert(mensaje);
  }
  obtenerLibro(id: string): void {
    this.libroService.getLibroPorId(id).subscribe(
      (libro: Libro) => {
        this.libro = libro;
        this.idSubCategoria = libro.idSubcategoria;
        if (libro.tamanno) {
          this.extraerDimensiones(libro.tamanno);
        }
        this.idLibro = libro.idLibro; // Asegurándonos de que idLibro tenga el valor correcto
        this.obtenerSubCategoria(libro.idSubcategoria);
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
        },
        (error: any) => {
          console.error('Error al obtener los detalles de la subcategoría:', error);
        }
      );
    }
  }

 
  obtenerKardex(libroId: number): void {
    this.libroService.getKardexPorIdLibro(libroId).subscribe(
      (kardex: Kardex) => {
        console.log(kardex);
        
        // Asumiendo que el servicio devuelve un objeto que se ajusta a la interfaz Kardex
        this.stockDisponible = kardex.stock;
      },
      (error: any) => {
        console.error('Error al obtener el kardex del libro:', error);
      }
    );
  }
  agregarAlCarrito(): void {
    if (!this.libro || this.precioVenta <= 0 || this.cantidad <= 0 || this.cantidad > this.stockDisponible || this.stockDisponible <= 0) {
      this.mostrarError('Datos inválidos. No se puede agregar al carrito o la cantidad excede el stock disponible.');
      return;
    }
    const itemCarrito: ItemCarrito = {
      libro: this.libro,
      precioVenta: this.precioVenta,
      cantidad: this.cantidad
    };
    this.carroService.addNewProduct(itemCarrito);
  }
  verificarStock() {
    if (this.cantidad > this.stockDisponible) {
      this.mostrarError('La cantidad excede el stock disponible.');
      this.cantidad = this.stockDisponible;
    }
  }
obtenerAutoresDeLibro(idLibro: number): void {
  this.libroAutorService.getAutoresDeLibro(idLibro).subscribe(
    (autores: Autor[]) => {
      this.autores = autores;
    },
    (error: any) => {
      console.error('Error al obtener los autores del libro:', error);
    }
  );
}
private extraerDimensiones(tamanno: string): void {
  const tamannoConPuntos = tamanno.replace(/,/g, '.');
  const dimensiones = tamannoConPuntos.match(/(\d+(\.\d+)?)/g);
  if (dimensiones) {
    this.ancho = parseFloat(dimensiones[0]);
    this.altura = dimensiones.length > 1 ? parseFloat(dimensiones[1]) : this.altura;
  }
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