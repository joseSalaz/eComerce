import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Proveedor } from '../Interface/proveedor';

@Injectable({
  providedIn: 'root'
})
export class ProvedorService {

  constructor(private _http: HttpClient) { }
  private endPoint: string = environment.endPoint;
  private apiUrl: string = this.endPoint + "Proveedor";

  getListProveedorCategoria(idCategoria: number, idSubcategoria?: number): Observable<Proveedor[]> {
    let url = `${this.apiUrl}/ProvvedorCategoria?idCategoria=${idCategoria}`;
    if (idSubcategoria) {
      url += `&idSubcategoria=${idSubcategoria}`;
    }
    return this._http.get<Proveedor[]>(url);
  }

}
