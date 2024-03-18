import { Component } from '@angular/core';
import { AutorService } from '../../Service/autor.service';
import { Autor } from '../../Interface/autor';
import { HttpHeaders } from '@angular/common/http';

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
