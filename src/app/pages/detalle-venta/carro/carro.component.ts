import { Component, Injectable, Input } from '@angular/core';
import { Libro } from '../../../Interface/libro'; 

import { CarroService } from '../../../Service/carro.service';
import { BehaviorSubject } from 'rxjs';
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

  constructor(private carroService: CarroService
) { 

}


  mostrarCarro = true;

  // Método para abrir el componente Carro
  abrirCarro() {
    this.mostrarCarro = true;
  }

  // Método para cerrar el componente Carro
  cerrarCarro() {
    this.mostrarCarro = false;
  }

  ngOnInit(){
    this.carroService.Libro.subscribe(libros =>{
      this.libros = libros;
    })
  }

  delete(indice:number){
    this.carroService.deleteLibro(indice);
  }

}
