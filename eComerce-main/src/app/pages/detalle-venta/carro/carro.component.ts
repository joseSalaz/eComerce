import { Component, Injectable, Input } from '@angular/core';
import { Libro } from '../../../Interface/libro'; 

import { CarroService } from '../../../Service/carro.service';
import { BehaviorSubject } from 'rxjs';
import { LibroService } from '../../../Service/libro.service';
import { ItemCarrito } from '../../../Interface/carrito';
import { AuthService } from '../../../Service/auth.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-carro',
  templateUrl: './carro.component.html',
  styleUrls: ['./carro.component.scss']
})
export class CarroComponent {

  private storageKey = 'carroLibros';
  
  libros: Libro[] = [];
  itemsCarrito: ItemCarrito[] = [];
  constructor(
    private carroService: CarroService,
    private libroService:LibroService,
    private authService: AuthService,
    private router: Router
    ) { }


  mostrarCarro = true;

  finalizarCompra() {
    const profile = this.authService.getProfile();
    if (!profile) {
      // Indicar el intento de compra
      localStorage.setItem('intentoCompra', 'true');
      // Iniciar el flujo de login
      this.router.navigate(['auth/log-in'])
    } else {
   
      // Proceder con la compra
      this.router.navigate(['/detalle-venta']);
    }
  }
  
  

  // Método para abrir el componente Carro
  abrirCarro() {
    this.mostrarCarro = true;
  }

  // Método para cerrar el componente Carro
  cerrarCarro() {
    this.mostrarCarro = false;
  }

  ngOnInit(){
    this.carroService.itemsCarrito.subscribe(items => {
      this.itemsCarrito = items;
    });
  }

  delete(indice:number){
    this.carroService.deleteLibro(indice);
  }
  agregarAlCarrito(libroId: number, cantidad: number): void {
    this.libroService.getLibroPorId(libroId.toString()).subscribe(libro => {
      this.libroService.getPreciosPorIdLibro(libroId).subscribe(precios => {
        if (precios.length > 0) {
          const precioVenta = precios[0].precioVenta;
          if (typeof precioVenta === 'number') {
            const itemCarrito: ItemCarrito = { libro, precioVenta, cantidad };
            this.carroService.addNewProduct(itemCarrito);
          } else {
            console.error('precioVenta no es un número');
          }
        } else {
          console.error('No se encontraron precios para el libro con ID:', libroId);
        }
      });
    });
  }
}