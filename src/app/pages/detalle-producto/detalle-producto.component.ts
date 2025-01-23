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
import Swal from 'sweetalert2';

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
  bloquearInput: boolean = false;  
  defaultImageUrl: string = "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
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
  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultImageUrl; // Asignamos la URL de imagen por defecto
  }
  mostrarError(mensaje: string): void {
    Swal.fire({
      title: 'Atención',
      text: mensaje,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#3085d6'
    });
  }
  
  mostrarExito(mensaje: string): void {
    Swal.fire({
      title: '¡Genial!',
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'Continuar comprando',
      confirmButtonColor: '#28a745'
    });
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
       
        
        // Asumiendo que el servicio devuelve un objeto que se ajusta a la interfaz Kardex
        this.stockDisponible = kardex.stock;
      },
      (error: any) => {
        console.error('Error al obtener el kardex del libro:', error);
      }
    );
  }
  agregarAlCarrito(): void {
    const cantidadEnCarrito = this.carroService.getCantidadPorProducto(this.idLibro); // Método que calcula la cantidad total del producto en el carrito.
  
    if (cantidadEnCarrito + this.cantidad > this.stockDisponible) {
      this.mostrarError('Ya has alcanzado el máximo permitido de este producto en el carrito.');
      return;
    }
  
    if (!this.libro || this.precioVenta <= 0 || this.cantidad <= 0 || this.stockDisponible <= 0) {
      this.mostrarError('Datos inválidos. No se puede agregar al carrito.');
      return;
    }
  
    const itemCarrito: ItemCarrito = {
      libro: this.libro,
      precioVenta: this.precioVenta,
      cantidad: this.cantidad
    };
  
    this.mostrarExito('Libro Agregado al Carrito con Éxito');
    this.carroService.addNewProduct(itemCarrito);
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
    if (this.cantidad < this.stockDisponible) {
      this.cantidad++;
    }
    this.verificarStock();
  }
  
  decrementarCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
    this.verificarStock();
  }
  verificarStock(): void {
    if (this.cantidad >= this.stockDisponible) {
      this.mostrarError('La cantidad no puede superar el stock disponible.');
      this.cantidad = this.stockDisponible;
      this.bloquearInput = true; // Bloquea el input si excede el stock.
    } else if (this.cantidad < this.stockDisponible) {
      this.bloquearInput = false; // Reactiva el input si está dentro del rango permitido.
    }
  }
}