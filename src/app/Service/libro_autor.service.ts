import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LibroAutor } from '../Interface/libro_autor';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class LibroAutorService {
    private apiUrl: string = `${environment.endPoint}LibroAutor`;
  
    constructor(private http: HttpClient) {}
  
    getAutores(): Observable<LibroAutor[]> {
      return this.http.get<LibroAutor[]>(this.apiUrl).pipe(
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
  
    getAutoresDeLibro(idLibro: number): Observable<LibroAutor[]> {
      // Modificar la URL para incluir el ID del libro como parámetro de la consulta
      const url = `${this.apiUrl}?idLibro=${idLibro}`;
      
      return this.http.get<LibroAutor[]>(url).pipe(
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
  