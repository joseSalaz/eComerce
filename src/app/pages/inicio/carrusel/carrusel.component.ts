import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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

  constructor() {}

  ngAfterViewInit(): void {
    const multipleItemCarousel = this.carouselElement.nativeElement;

    // Verificar si window está disponible
    if (typeof window !== 'undefined' && window.matchMedia("(min-width:576px)").matches) {
      this.carousel = new bootstrap.Carousel(multipleItemCarousel, {
        interval: false, // Deshabilitar el desplazamiento automático por defecto
      });

      // Iniciar el intervalo para desplazar automáticamente cada 3 segundos
      this.intervalId = setInterval(() => {
        this.nextSlide();
      }, 5000);
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
}