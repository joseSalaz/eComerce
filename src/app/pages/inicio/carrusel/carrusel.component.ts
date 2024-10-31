import { Component, AfterViewInit, ViewChild, ElementRef, Input,Output,EventEmitter } from '@angular/core';
import { Libro } from '../../../Interface/libro';
import { Router } from '@angular/router';
import { LibroService } from '../../../Service/libro.service';
import { CategoriaService } from '../../../Service/categoria.service';
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
    private CategoriaService: CategoriaService,
    private router: Router,
    private _libroServicio:LibroService
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
  
    this.CategoriaService.getLibrosPorCategoriaId(idSubcategoria).subscribe((libros: Libro[]) => {
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
  ngOnDestroy(): void {
    
    clearInterval(this.intervalId);
  }
  
  comprar(libroId: number) {
    this.router.navigate(['/detalle-producto', libroId]);
  }
  getSlidesPerView(): number {
    const width = window.innerWidth;
    if (width >= 1200) return 5;
    if (width >= 992) return 4;
    if (width >= 768) return 3;
    if (width >= 576) return 2;
    return 1;
  }
  
}
