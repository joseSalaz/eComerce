import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Libro } from '../../../Interface/libro';
import { Router } from '@angular/router';
import { LibroService } from '../../../Service/libro.service';
import { CategoriaService } from '../../../Service/categoria.service';
import { LoadingStateService } from '../../../Service/loading-state.service';
import { LoadingState } from '../../../Interface/loading-state.enum';


declare var bootstrap: any;

@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrls: ['./carrusel.component.scss']
})
export class CarruselComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @Input() categoria: number | string = '';
  @Output() comprarLibro: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('carousel') carouselElement!: ElementRef;
  private carousel: any;
  private currentIndex: number = 0;
  private intervalId: any;
  datas: Libro[] = [];
  firstItemId: number = 0;
  categoriaFiltrada: number | string = '';
  defaultImageUrl: string = "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";
  
  constructor(
    private CategoriaService: CategoriaService,
    private router: Router,
    private _libroServicio: LibroService,
    public loadingStateService: LoadingStateService 
  ) {}

  ngOnInit(): void {
    setTimeout(()=>{this.mostrarLibro();})
    
  }

  mostrarLibro(): void {
  let idSubcategoria: number;

  if (typeof this.categoria === 'string') {
    idSubcategoria = parseInt(this.categoria, 10);
  } else {
    idSubcategoria = this.categoria;
  }

  // Establecemos el estado de carga a 'waiting'
  this.loadingStateService.setLoading(LoadingState.Waiting);

  // Simula una solicitud retrasada al servidor
 
  this.CategoriaService.getLibrosPorCategoriaId(idSubcategoria).subscribe(
  (respuesta: any) => {
   
    const listaRaw = respuesta && respuesta.data ? respuesta.data : (Array.isArray(respuesta) ? respuesta : []);

    this.datas = listaRaw.map((item: any) => {
      if (item.libro) {
        return {
          ...item.libro,
          precioVenta: item.precio ?? item.libro.precioVenta ?? null
        };
      }
      return item;
    });
    if (this.datas.length > 0) {
      this.firstItemId = this.datas[0].idLibro;
    }
    this.datas.forEach((libro: any, index: number) => {
      if (libro.precioVenta === null || libro.precioVenta === undefined) {
        this._libroServicio.getPreciosPorIdLibro(libro.idLibro).subscribe({
          next: (precios) => {
            if (precios && precios.length > 0 && precios[0].precioVenta != null) {
              this.datas[index].precioVenta = precios[0].precioVenta;
            }
          },
          error: (err) => console.error(`Error al obtener precio para el libro ${libro.idLibro}:`, err)
        });
      }
    });

    this.loadingStateService.setLoading(LoadingState.Successful);
  },
  (error) => {
    console.error('Error al cargar los libros:', error);
    this.loadingStateService.setLoading(LoadingState.Error);
  }
);

}

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined') {
      const multipleItemCarousel = this.carouselElement?.nativeElement;

      if (multipleItemCarousel) {
        if (window.matchMedia("(min-width:576px)").matches) {
          this.carousel = new bootstrap.Carousel(multipleItemCarousel, {
            interval: false,
          });
        } else {
          multipleItemCarousel.classList.add('slide');
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  comprar(libroId: number): void {
    this.router.navigate(['/detalle-producto', libroId]);
  }

  getSlidesPerView(): number {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1200) return 5;
      if (width >= 992) return 4;
      if (width >= 768) return 3;
      if (width >= 576) return 2;
      return 1;
    }
    return 1;
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultImageUrl;
  }
}
