import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import { LibroService } from '../../../Service/libro.service';
import { Libro } from '../../../Interface/libro';
import { Router } from '@angular/router';
declare var bootstrap: any; // Importar Bootstrap globalmente

@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.scss']
})
export class CarruselComponent implements AfterViewInit {
  @Input() categoria: number | string = '';
  @ViewChild('carousel') carouselElement!: ElementRef;
  private carousel: any;
  private currentIndex: number = 0;
  private intervalId: any;
  datas: Libro[] = [];
  firstItemId: number = 0; 
  categoriaFiltrada: number | string = '';

  constructor(
    private _libroServicio: LibroService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mostrarLibro();
  }

  mostrarLibro(): void {
    console.log('ID de categoría:', this.categoria); // Log del ID de categoría

    // Obtener todos los libros
    this._libroServicio.getLibros().subscribe(libros => {
      // Filtrar los libros por categoría si se especifica una categoría
      if (this.categoria) {
        this.datas = libros.filter(libro => libro.idCategoria === parseInt(this.categoria.toString(), 10));
      } else {
        this.datas = libros; // Si no se especifica una categoría, mostrar todos los libros
      }
      
      // Encontrar el índice del primer elemento según su ID
      if (this.datas.length > 0) {
        this.firstItemId = this.datas[0].idLibro;
      }

      console.log('Datos del libro:', this.datas); // Log de los datos de los libros
    });
  }

  ngAfterViewInit(): void {
    // Inicializar el carrusel después de que la vista se haya inicializado completamente
    const multipleItemCarousel = this.carouselElement.nativeElement;

    // Verificar si window está disponible
    if (typeof window !== 'undefined' && window.matchMedia("(min-width:576px)").matches) {
      this.carousel = new bootstrap.Carousel(multipleItemCarousel, {
        interval: false, // Deshabilitar el desplazamiento automático por defecto
      });
    } else {
      multipleItemCarousel.classList.add('slide');
    }
  }

  // Método para avanzar al siguiente slide
  nextSlide(): void {
    const items = this.carouselElement.nativeElement.querySelectorAll('.carousel-item');

    if (items.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % items.length;
      items[this.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }
  
  // Método para retroceder al slide anterior
  prevSlide(): void {
    const items = this.carouselElement.nativeElement.querySelectorAll('.carousel-item');

    if (items.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + items.length) % items.length;
      items[this.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }
  
  ngOnDestroy(): void {
    // Limpiar el intervalo cuando el componente se destruye
    clearInterval(this.intervalId);
  }
  
  comprar(libroId: number) {
    this.router.navigate(['/detalle-producto', libroId]);
  }
}
