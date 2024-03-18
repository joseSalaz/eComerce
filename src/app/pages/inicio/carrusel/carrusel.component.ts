import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('carousel') carouselElement!: ElementRef;
  private carousel: any;
  private currentIndex: number = 0;
  private intervalId: any;
  datas: Libro[] = [];
  firstItemId: number = 0; // ID del primer elemento que se mostrará como activo

  constructor(
    private _libroServicio: LibroService,
    private router: Router
    ) {
    
    this.mostrarLibro();
  }

  mostrarLibro() {
    this._libroServicio.getLibros().subscribe({
      next: (data: Libro[]) => {
        this.datas = data;
        // Encontrar el índice del primer elemento según su ID
        this.firstItemId = data[0].idLibro;
      },
      error: (err) => {
        console.log("error", err);
      },
      complete: () => {
        // Hacer algo
      },
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
