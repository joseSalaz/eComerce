import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarroService } from '../../../Service/carro.service';
import { Libro } from '../../../Interface/libro';
import { ItemCarrito } from '../../../Interface/carrito';

@Component({
  selector: 'app-respuestas',
  templateUrl: './respuestas.component.html',
  styleUrl: './respuestas.component.scss'
})
export class RespuestasComponent {
  @Input() showModal: boolean = false;  // Variable para controlar la visibilidad del modal
  @Input() isSuccess: boolean = false;
  librosCarro: Libro[] = [];
  itemsCarrito: ItemCarrito[] = [];
  paymentId: string | null = null;
  payerId: string | null = null;
 
  constructor(
    private route: ActivatedRoute,
    private carroService: CarroService,
    private router: Router, 
    ) { }


  confirmarPago() {
    if (this.paymentId && this.payerId) {
      this.carroService.confirmarPago(this.paymentId, this.payerId).subscribe({
        next: (response:any) => {
          // Aquí podrías redirigir al usuario a una página de éxito o mostrar un mensaje
          console.log('Pago confirmado con éxito:', response);
          // this.router.navigate(['/exito']); // Redirige a una ruta de éxito en tu app
        },
        error: (error:any) => {
          // Aquí manejas los errores, como mostrar un mensaje al usuario
          console.error('Error al confirmar el pago:', error);
        }
      });
    } else {
      console.error('Payment ID o Payer ID no están disponibles.');
    }
  }

 

  close() {
    this.showModal = false;
  }

}
