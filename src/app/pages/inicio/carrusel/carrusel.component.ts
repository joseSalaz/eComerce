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
    if (typeof this.categoria === 'string') {
      const idSubcategoria = parseInt(this.categoria.toString(), 10);
      this._libroServicio.getLibrosPorSubcategoria(idSubcategoria).subscribe((libros: Libro[]) => {
        this.datas = libros;
        if (this.datas.length > 0) {
          this.firstItemId = this.datas[0].idLibro;
        }
      });
    } else {
      this._libroServicio.getLibros().subscribe((libros: Libro[]) => {
        this.datas = libros;
        if (this.datas.length > 0) {
          this.firstItemId = this.datas[0].idLibro;
        }
      });
    }
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
