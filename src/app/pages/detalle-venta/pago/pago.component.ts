import { Component, OnInit } from '@angular/core';
import { CarroService } from '../../../Service/carro.service';
import { HttpClient } from '@angular/common/http';
declare let window: any;
@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrl: './pago.component.scss'
})
export class PagoComponent implements OnInit {

  mostrarOpcionesEnvio: boolean = false;
  alturaCaja: string = 'auto';

  constructor(
    private carroService: CarroService,
    private http:HttpClient) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


  toggleOpcionesEnvio() {
    this.mostrarOpcionesEnvio = !this.mostrarOpcionesEnvio;
    this.alturaCaja = this.mostrarOpcionesEnvio ? '500px' : 'auto';
  }
  procesarPago(): void {
    this.carroService.enviarCarritoAlBackend().subscribe({
      next: (response) => {
        // Aquí manejas la respuesta del backend, como redirigir al usuario a PayPal
        const approvalUrl = response.ApprovalUrl; // Asumiendo que el backend responde con este campo
        window.location.href = approvalUrl; // Redirige al usuario a PayPal
      },
      error: (error) => {
        // Aquí manejas los errores, como mostrar un mensaje al usuario
        console.error('Error al procesar el pago:', error);
      }
    });
  }
}