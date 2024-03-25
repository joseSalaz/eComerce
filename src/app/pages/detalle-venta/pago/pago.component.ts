import { Component } from '@angular/core';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.scss'
})
export class PagoComponent {
  mostrarOpcionesEnvio: boolean = false;
  alturaCaja: string = 'auto';

  toggleOpcionesEnvio() {
    this.mostrarOpcionesEnvio = !this.mostrarOpcionesEnvio;
    this.alturaCaja = this.mostrarOpcionesEnvio ? '50px' : 'auto';
  }
}
