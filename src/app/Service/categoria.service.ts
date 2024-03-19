import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

import { identifierName } from '@angular/compiler';
import { Categorium } from '../Interface/categorium';
@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private endPoint:string = environment.endPoint; 
  private apiUrl:string = this.endPoint + "Categoria";
  constructor(private http: HttpClient) {}

  getList(): Observable<Categorium[]> {
    return this.http.get<Categorium[]>(`${this.apiUrl}/lista`);
  } 
  getCategoriaPorId(idCategoria: number): Observable<Categorium> {
    return this.http.get<Categorium>(`${this.apiUrl}/${idCategoria}`);
  }
}

