import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private endPoint:string = environment.endPoint;
  private apiUrl:string = this.endPoint + "Venta";
  constructor(private http: HttpClient) { 
  }
}
//falta
