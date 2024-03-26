import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, throwError } from 'rxjs';
import { Libro } from '../Interface/libro';
import { environment } from '../../environments/environment';
import { Precio } from '../Interface/precio';

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

  private fetchLibros(): void {
    this.http.get<Libro[]>(`${this.apiUrl}`).subscribe(libros => {
      this.librosSubject.next(libros);
    });
  }

  getLibros(): Observable<Libro[]> {
    return this.libros$;
  }
  getLibroPorId(id: string): Observable<Libro> {
    return this.http.get<Libro>(`${this.apiUrl}/${id}`);
  }
  getLibrosPorSubcategoria(idSubcategoria: number): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}?idSubcategoria=${idSubcategoria}`);
  }
  
  getPreciosPorIdLibro(libroId: number): Observable<Precio[]> {
    const url = `${this.apiUrl}/precios/${libroId}`;
    return this.http.get<Precio[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error desconocido';
        if (error.error instanceof ErrorEvent) {
          // Error del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del servidor
          errorMessage = `Código de error ${error.status}: ${error.error}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
      })
    );
  }
  
}
