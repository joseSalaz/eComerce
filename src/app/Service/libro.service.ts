import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Libro } from '../Interface/libro';
import { map } from 'rxjs/operators';
import { Categorium } from '../Interface/categorium';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private endPoint:string = environment.endPoint; 
  private apiUrl:string = this.endPoint + 'Libro';

  constructor(private http: HttpClient) {}
  getLibros(): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}`);
  }
  getLibroPorId(id: string): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`);
  }
}
