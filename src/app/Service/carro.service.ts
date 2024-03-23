import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Libro } from '../Interface/libro';

@Injectable({
  providedIn: 'root'
})
export class CarroService {

  private _libro: BehaviorSubject<Libro[]>;
  private storageKey = 'carroLibros';


  private libro: Libro [] = [];


  constructor(){
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



  private updateStorage(libros: Libro[]) {
    this._libro.next(libros);
    localStorage.setItem(this.storageKey, JSON.stringify(libros));
    console.log(libros);
    
  }

  deleteLibro(index: number){
    this.libro.splice(index,1)
    this._libro.next(this.libro);
  }  

  

}


