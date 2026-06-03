import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Autor, AutorCategoria } from '../Interface/autor';
import { identifierName } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class AutorService {
  private endPoint: string = environment.endPoint;
  private apiUrl: string = this.endPoint + "Autor";
  constructor(private http: HttpClient) { }

  getList(): Observable<Autor[]> {
    return this.http.get<Autor[]>(`${this.apiUrl}`);
  }

  getListAutorCategoria(idCategoria: number, idSubcategoria?: number): Observable<AutorCategoria[]> {
    let url = `${this.apiUrl}/CatAutor?idCategoria=${idCategoria}`;
    if (idSubcategoria) {
      url += `&idSubcategoria=${idSubcategoria}`;
    }
    return this.http.get<AutorCategoria[]>(url);
  }
}
