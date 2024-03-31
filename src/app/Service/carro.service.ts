  import { Injectable } from '@angular/core';
  import { BehaviorSubject, Observable } from 'rxjs';
  import { ItemCarrito } from '../Interface/carrito';
  import { HttpClient } from '@angular/common/http';
  import { Datallecarrito } from '../Interface/detallecarrito';
  import { ExchangeRateService } from './exchange-rate.service';
  import { switchMap } from 'rxjs/operators';
  import { tap } from 'rxjs/operators';

  @Injectable({
    providedIn: 'root'
  })
  export class CarroService {
    private storageKey = 'carroItems';
    private _itemsCarrito: BehaviorSubject<ItemCarrito[]>;
    private executePaymentUrl = 'https://localhost:7143/api/Paypal/execute-payment';
    constructor(
      private http: HttpClient,
      private exchangeRateService: ExchangeRateService
    ) {
      const storedItems = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
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
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
    enviarCarritoAlBackend(): Observable<any> {
      
      return this.exchangeRateService.getExchangeRate().pipe(
        switchMap(tasaDeCambio => {
          const carritoActual = this._itemsCarrito.value.map(item => ({
            ...item,
            precioVenta: item.precioVenta * tasaDeCambio 
          }));
          const totalAmount = carritoActual.reduce((acc, item) => acc + (item.precioVenta * item.cantidad), 0);
    
          const detalleCarrito: Datallecarrito = {
            Items: carritoActual,
            TotalAmount: totalAmount 
          };
    
          return this.http.post('https://localhost:7143/api/Cart', detalleCarrito);
        })
      );
    }


    confirmarPago(paymentId: string, payerId: string): Observable<any> {
      // Recuperar el carrito del almacenamiento local
      const carritoActual = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const totalAmount = carritoActual.reduce((acc:any, item:any) => acc + (item.precioVenta * item.cantidad), 0);
    
      // Preparar el cuerpo de la solicitud incluyendo el ID de pago, ID del pagador y el carrito
      const body = {
        PaymentId: paymentId,
        PayerID: payerId,
        Carrito: {
          Items: carritoActual,
          TotalAmount: totalAmount
        }
      };
    
      console.log('Cuerpo de la solicitud para confirmar el pago:', body);
    
      // Hacer la petición POST al backend para ejecutar el pago
      return this.http.post(this.executePaymentUrl, body).pipe(
        tap(response => {
          // Si el pago se confirma exitosamente, limpia el carrito
          this.limpiarCarrito();
        })
      ); 
    }
    private limpiarCarrito(): void {
      // Limpia el carrito del almacenamiento local
      localStorage.removeItem(this.storageKey);
      // Actualiza el BehaviorSubject con un carrito vacío
      this._itemsCarrito.next([]);
    }
  
  }
