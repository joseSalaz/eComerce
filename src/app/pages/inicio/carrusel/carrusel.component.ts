import { Component, AfterViewInit, ViewChild, ElementRef, Input,Output,EventEmitter } from '@angular/core';
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
  @Output() comprarLibro: EventEmitter<number> = new EventEmitter<number>();
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
    let idSubcategoria: number;
  
    if (typeof this.categoria === 'string') {
      idSubcategoria = parseInt(this.categoria, 10);
    } else {
      idSubcategoria = this.categoria;
    }
  
    this._libroServicio.getLibrosPorSubcategoria(idSubcategoria).subscribe((libros: Libro[]) => {
      this.datas = libros;
      
      // Si hay libros en la respuesta, asignamos el ID del primero para la lógica del carrusel
      if (this.datas.length > 0) {
        this.firstItemId = this.datas[0].idLibro;
      }
  
      // Llamamos a obtener el precio para cada libro
      this.datas.forEach((libro, index) => {
        this._libroServicio.getPreciosPorIdLibro(libro.idLibro).subscribe(precios => {
          if (precios.length > 0 && precios[0].precioVenta != null) {
            // Asignamos el precio al libro correspondiente
            this.datas[index].precioVenta = precios[0].precioVenta;
          }
        });
      });
    });
  }
    ngAfterViewInit(): void {
   
    const multipleItemCarousel = this.carouselElement.nativeElement;


    if (typeof window !== 'undefined' && window.matchMedia("(min-width:576px)").matches) {
      this.carousel = new bootstrap.Carousel(multipleItemCarousel, {
        interval: false, 
      });
    } else {
      multipleItemCarousel.classList.add('slide');
    }
  }

  
  
  nextSlide(): void {
    const items = this.carouselElement.nativeElement.querySelectorAll('.carousel-item');

    if (items.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % items.length;
      items[this.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }
  

  prevSlide(): void {
    const items = this.carouselElement.nativeElement.querySelectorAll('.carousel-item');

    if (items.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + items.length) % items.length;
      items[this.currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }
  
  ngOnDestroy(): void {
    
    clearInterval(this.intervalId);
  }
  
  comprar(libroId: number) {
    this.router.navigate(['/detalle-producto', libroId]);
  }
}
