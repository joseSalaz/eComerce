import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Libro } from '../Interface/libro';

@Injectable({
  providedIn: 'root'
})
export class CarroService {
  private libro: Libro [] = [];
  
  private _libro:BehaviorSubject<Libro[]>;

  constructor(){
    this._libro = new BehaviorSubject<Libro[]>
    ([])
  }

  obtenerCantidadProductos(): number {
    return this.libro.length;
  }

  get Libro (){
    return this._libro.asObservable();
  }

  addNewProduct(libro : Libro) {
    this.libro.push(libro);
    this._libro.next(this.libro);
  }

  deleteLibro(index: number){
    this.libro.splice(index,1)
    this._libro.next(this.libro);
  }

  
}

