  import { Injectable } from '@angular/core';
  import { BehaviorSubject, Observable, throwError } from 'rxjs';
  import { ItemCarrito } from '../Interface/carrito';
  import { HttpClient } from '@angular/common/http';
  import { Datallecarrito } from '../Interface/detallecarrito';
  import { ExchangeRateService } from './exchange-rate.service';
  import { catchError, switchMap } from 'rxjs/operators';
  import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LocalStorageService } from './local-storage.service';
  @Injectable({
    providedIn: 'root'
  })
  export class CarroService {
    private storageKey = 'carroItems';
    private endPoint: string = environment.endPoint;
    private _itemsCarrito: BehaviorSubject<ItemCarrito[]>;
    private executePaymentUrl = 'http://localhost:5229/api/Paypal/execute-payment';
    constructor(
      private http: HttpClient,
      private exchangeRateService: ExchangeRateService,
      private localStorageService: LocalStorageService
    ) {
      const storedItems = this.localStorageService.getItem<ItemCarrito[]>(this.storageKey) || [];
      this._itemsCarrito = new BehaviorSubject<ItemCarrito[]>(storedItems);
    }

    obtenerCantidadProductos(): number {
      return this._itemsCarrito.value.reduce((acc, curr) => acc + curr.cantidad, 0);
    }

    get itemsCarrito() {
      return this._itemsCarrito.asObservable();
    }

    addNewProduct(item: ItemCarrito) {
      const itemsActualizados = [...this._itemsCarrito.value, item];
      this.updateStorage(itemsActualizados);
    }

    deleteLibro(index: number) {
      const itemsActualizados = this._itemsCarrito.value.filter((_, i) => i !== index);
      this.updateStorage(itemsActualizados);
    }

    private updateStorage(items: ItemCarrito[]) {
      this._itemsCarrito.next(items);
      this.localStorageService.setItem(this.storageKey, items);
    }
    enviarCarritoAlBackend(): Observable<any> {
      const usuarioData = JSON.parse(localStorage.getItem('usuarioData') || '{}');
      return this.exchangeRateService.getExchangeRate().pipe(
        switchMap(tasaDeCambio => {
          const carritoActual = this._itemsCarrito.value.map(item => ({
            ...item,
            precioVenta: parseFloat((item.precioVenta * tasaDeCambio).toFixed(2))
          }));
          const totalAmount = parseFloat(carritoActual.reduce((acc, item) => acc + (item.precioVenta * item.cantidad), 0).toFixed(2));
          const detalleCarrito: Datallecarrito = {
            Items: carritoActual,
            TotalAmount: totalAmount,
            Persona: usuarioData //idCliente 
          };  
          return this.http.post('http://localhost:5229/api/Cart', detalleCarrito);
        })
      );
    }
    getCantidadPorProducto(idLibro: number): number {
      const item = this._itemsCarrito.value.find(item => item.libro.idLibro === idLibro);
      return item ? item.cantidad : 0;
    }
    


    

    confirmarPago(paymentId: string, payerId: string): Observable<any> {
      // Recuperar el carrito del almacenamiento local
      const carritoActual = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const totalAmount = carritoActual.reduce((acc:any, item:any) => acc + (item.precioVenta * item.cantidad), 0);
      const usuarioData = JSON.parse(localStorage.getItem('usuarioData') || '{}');
      // Preparar el cuerpo de la solicitud incluyendo el ID de pago, ID del pagador y el carrito
      const body = {
        PaymentId: paymentId,
        PayerID: payerId,
        Carrito: {
          Items: carritoActual,
          TotalAmount: totalAmount,
          Persona: usuarioData,
        }
      };    
      return this.http.post(this.executePaymentUrl, body).pipe(
        tap(response => {
          // Si el pago se confirma exitosamente, limpia el carrito
          this.limpiarCarrito();
        })
      ); 
    }
    private limpiarCarrito(): void {
      localStorage.removeItem(this.storageKey);
      this._itemsCarrito.next([]);
    }
  

    enviarCarritoAlBackendParaMercadoPago(): Observable<any> {
      const usuarioData = JSON.parse(localStorage.getItem('usuarioData') || '{}');
      const carritoActual = this._itemsCarrito.value.map(item => ({
          ...item,
          precioVenta: item.precioVenta // Asumiendo que ya está en soles
      }));
      
      const totalAmount = carritoActual.reduce((acc, item) => acc + (item.precioVenta * item.cantidad), 0);
      
      const detalleCarrito: Datallecarrito = {
          Items: carritoActual,
          TotalAmount: totalAmount,
          Persona: usuarioData
      };
  
      return this.http.post(`${this.endPoint}api/Cart/mercadopago`, detalleCarrito).pipe(
          tap(response => {
              console.log('Respuesta del backend Mercado Pago:', response); // Para depuración
          }),
          catchError(error => {
              console.error('Error al enviar el carrito a Mercado Pago:', error);
              return throwError(error); // Lanza el error
          })
      );
  }


  confirmarPagoConMercadoPago(paymentId: string, preferenceId: string): Observable<any> {
    // Recuperar el carrito del almacenamiento local
    const carritoActual = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const totalAmount = carritoActual.reduce((acc: any, item: any) => acc + (item.precioVenta * item.cantidad), 0);
    const usuarioData = JSON.parse(localStorage.getItem('usuarioData') || '{}');
  
    // Preparar el cuerpo de la solicitud incluyendo el ID de la preferencia y el carrito
    const body = {
      PaymentID: paymentId,
      PreferenceId: preferenceId,
      Carrito: {
        Items: carritoActual,
        TotalAmount: totalAmount,
        Persona: usuarioData,
      }
    };
  
    return this.http.post(`${this.endPoint}api/MercadoPago/execute-payment`, body).pipe(
      tap(response => {
        // Si el pago se confirma exitosamente, limpia el carrito
        this.limpiarCarrito();
      }),
      catchError(error => {
        console.error('Error al ejecutar el pago en Mercado Pago:', error);
        return throwError(error); // Lanza el error
      })
    );
  }
  
  
    
  }

