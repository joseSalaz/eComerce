import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Libro } from '../Interface/libro';

@Injectable({
  providedIn: 'root'
})
export class CarroService {
  private _libro: BehaviorSubject<Libro[]>;
  private storageKey = 'carroLibros';

  constructor() {
    const storedLibros = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    this._libro = new BehaviorSubject<Libro[]>(storedLibros);
  }

  obtenerCantidadProductos(): number {
    return this._libro.value.length;
  }

  get Libro() {
    return this._libro.asObservable();
  }

  addNewProduct(libro: Libro) {
    const libros = [...this._libro.value, libro];
    this.updateStorage(libros);
  }

  deleteLibro(index: number) {
    const libros = this._libro.value.filter((_, i) => i !== index);
    this.updateStorage(libros);
  }

  private updateStorage(libros: Libro[]) {
    this._libro.next(libros);
    localStorage.setItem(this.storageKey, JSON.stringify(libros));
    console.log(libros);
    
  }
}


