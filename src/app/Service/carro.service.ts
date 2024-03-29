  import { Injectable } from '@angular/core';
  import { BehaviorSubject, Observable } from 'rxjs';
  import { ItemCarrito } from '../Interface/carrito';
  import { HttpClient } from '@angular/common/http';
import { Datallecarrito } from '../Interface/detallecarrito';
  @Injectable({
    providedIn: 'root'
  })
  export class CarroService {
    private storageKey = 'carroItems';
    private _itemsCarrito: BehaviorSubject<ItemCarrito[]>;

    constructor(
      private http: HttpClient
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
      const carritoActual = this._itemsCarrito.value;
      const totalAmount = carritoActual.reduce((acc, item) => acc + (item.precioVenta * item.cantidad), 0);
  
      const detalleCarrito: Datallecarrito = {
        Items: carritoActual,
        TotalAmount: totalAmount
      };
  
      return this.http.post('https://localhost:7143/api/Cart', detalleCarrito);
    }
    confirmarPago(paymentId: string, payerId: string) {
      const url = 'https://localhost:7143/api/Paypal/execute-payment'; 
      const body = { PaymentId: paymentId, PayerID: payerId };
      console.log(body);
      
      return this.http.post(url, body);
    }
  
  }
