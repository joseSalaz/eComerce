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

  constructor(
    private http: HttpClient
    ) { 
    this.fetchLibros();
  }

  getLibros(): Observable<Libro[]> {
    return this.libros$;
  }
  getLibroPorId(id: string): Observable<Libro> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Libro>(url);
  }
  private fetchLibros(): void {
    this.http.get<Libro[]>(`${this.apiUrl}`).subscribe(libros => {
      this.librosSubject.next(libros);
    });
  }
  getLibrosPorSubcategoria(idSubcategoria: number): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}?idSubcategoria=${idSubcategoria}`);
  }

  getLibrosPorPrecio(id: string): Observable<Libro[]>
  {
    return this.http.get<Libro[]>(`${this.apiUrl}/Precio/?idPrecio=${id}`);
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
  getStockPorIdLibro(libroId: number): Observable<number> { // Cambia any por tu tipo de dato de stock
    return this.http.get<number>(`${this.apiUrl}/stock/${libroId}`)
  }
  
  getLibrosAutoComplete(titulo: string): Observable<Libro[]> {
    return this.http.get<Libro[]>(`${this.apiUrl}/filtroComplete?titulo=${encodeURIComponent(titulo)}`)
  }



}
