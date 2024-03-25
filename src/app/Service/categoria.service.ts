import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

import { identifierName } from '@angular/compiler';
import { Categorium } from '../Interface/categorium';
import { Libro } from '../Interface/libro';
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private endPoint:string = environment.endPoint; 
  private apiUrl:string = this.endPoint + "Categoria";
  constructor(private http: HttpClient) {}

  getList(): Observable<Categorium[]> {
    return this.http.get<Categorium[]>(this.apiUrl);
  } 
  getCategoriaPorId(idCategoria: number): Observable<Categorium> {
    return this.http.get<Categorium>(`${this.apiUrl}/${idCategoria}`);
  }
  getLibrosPorCategoriaId(idCategoria: number): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/${idCategoria}/libros`);
  }
  
}

