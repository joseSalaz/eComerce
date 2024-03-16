import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
@Component({
  selector: 'app-carrusel',
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.scss'
})
export class CarruselComponent {
  @ViewChild('carousel') carouselElement!: ElementRef;

  constructor() {}

  ngAfterViewInit(): void {
    const multipleItemCarousel = this.carouselElement.nativeElement;

    // Verificar si window está disponible
    if (typeof window !== 'undefined' && window.matchMedia("(min-width:576px)").matches) {
      multipleItemCarousel.classList.remove('slide');

      // Usar arrow function para mantener el contexto 'this'
      multipleItemCarousel.addEventListener('click', (event: Event) => {
        if (event.target instanceof HTMLElement && event.target.classList.contains('carousel-control-prev')) {
          this.prevSlide();
        } else if (event.target instanceof HTMLElement && event.target.classList.contains('carousel-control-next')) {
          this.nextSlide();
        }
      });
    } else {
      multipleItemCarousel.classList.add('slide');
    }
  }

  nextSlide(): void {
    const carousel = this.carouselElement.nativeElement;
    const carouselInner = carousel.querySelector('.carousel-inner');
    if (carouselInner) {
      // Obtener el ancho de la primera carta
      const firstItem = carouselInner.querySelector('.carousel-item');
      if (firstItem) {
        const itemWidth = firstItem.getBoundingClientRect().width;
        carouselInner.scrollLeft += itemWidth + 30; // Ajuste para el margen entre cartas
      }
    }
  }

  prevSlide(): void {
    const carousel = this.carouselElement.nativeElement;
    const carouselInner = carousel.querySelector('.carousel-inner');
    if (carouselInner) {
      // Obtener el ancho de la primera carta
      const firstItem = carouselInner.querySelector('.carousel-item');
      if (firstItem) {
        const itemWidth = firstItem.getBoundingClientRect().width;
        carouselInner.scrollLeft -= itemWidth + 30; // Ajuste para el margen entre cartas
      }
    }
  }
}
