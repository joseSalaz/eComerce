import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Libro } from '../Interface/libro';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LibroService {
  private endPoint: string = environment.endPoint;
  private apiUrl: string = `${this.endPoint}Libro`;
  private librosSubject: BehaviorSubject<Libro[]> = new BehaviorSubject<Libro[]>([]);
  public libros$: Observable<Libro[]> = this.librosSubject.asObservable();

  constructor(private http: HttpClient) { 
    this.fetchLibros();
  }

  getLibros(): Observable<Libro[]> {
    return this.libros$;
  }
  getLibroPorId(id: string): Observable<Libro> {
    const url = `${this.apiUrl}/${id}`;
    console.log('Solicitando libro por ID:', url);
    return this.http.get<Libro>(url);
  }
  private fetchLibros(): void {
    this.http.get<Libro[]>(`${this.apiUrl}`).subscribe(libros => {
      console.log('Libros obtenidos del servidor:', libros);
      this.librosSubject.next(libros);
    });
  }
  getLibrosPorSubcategoria(idSubcategoria: number): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}?idSubcategoria=${idSubcategoria}`);
  }
  
}
