import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  constructor(private http: HttpClient ) {}
  iniciarPago(cartItems: any[]){
    return this.http.post('api/pago/iniciar',{cartItems})
  }
}
