import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Libro } from '../Interface/libro';

@Injectable({
  providedIn: 'root'
})
export class CarroService {
  private libro: Libro [] = [];
  private storageKey = 'carroLibros';
  
  private _libro:BehaviorSubject<Libro[]>;

  constructor(){
    const storedLibros = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    this._libro = new BehaviorSubject<Libro[]>(storedLibros);
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
  private updateStorage(libros: Libro[]) {
    this._libro.next(libros); // Actualiza el BehaviorSubject con la nueva lista de libros
    localStorage.setItem(this.storageKey, JSON.stringify(libros)); // Almacena la lista de libros en el almacenamiento local del navegador
  }
  
}

