import { Component } from '@angular/core';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss']
})
export class DetalleProductoComponent {
  cantidad: number = 1; // Valor inicial de la cantidad

  incrementarCantidad(): void {
    this.cantidad++; // Incrementa la cantidad en 1
  }

  decrementarCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--; // Decrementa la cantidad en 1, siempre y cuando sea mayor que 1
    }
  }
}
