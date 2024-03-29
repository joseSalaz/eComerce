import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private endPoint: string = environment.endPoint;
  private apiUrl: string = `${this.endPoint}paypal`;

  constructor(private http: HttpClient ) {}


  iniciarPago(cartItems: any[]){
    return this.http.post('api/pago/iniciar',{cartItems})
  }

  executePayment(paymentId: string, payerId: string): Observable<any> {
    const url = `${this.apiUrl}/execute-payment`;
    return this.http.post(url, { paymentId, payerId });
  }
}
