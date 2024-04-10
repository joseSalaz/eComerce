import { Component, OnInit } from '@angular/core';
import { CarroService } from '../../../Service/carro.service';
import { HttpClient } from '@angular/common/http';
import { PagoService } from '../../../Service/pago.service';
import { ActivatedRoute, Router, Routes } from '@angular/router';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.scss'] // Asegúrate de que la extensión sea .scss si estás usando SASS/SCSS
})
export class PagoComponent implements OnInit {

  mostrarOpcionesEnvio: boolean = false;

  constructor(
    private carroService: CarroService, 
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private pago:PagoService,
    private router: Router
    ) {}


  ngOnInit(): void {
     // Ahora usamos activatedRoute aquí
     this.activatedRoute.queryParams.subscribe((params: any) => { // Debes reemplazar 'any' por el tipo adecuado si es posible
      const paymentId = params['paymentId'];
      const payerId = params['PayerID'];

      if (paymentId && payerId) {
        // El usuario ha sido redirigido desde PayPal con los parámetros necesarios
        this.pago.executePayment(paymentId, payerId).subscribe({
          error: (error) => {
            // Maneja el error
            console.error(error);
            this.router.navigate(['']); // Redirige a la página de error
          }
        });
      }
    });
  }



  toggleOpcionesEnvio(): void {
    this.mostrarOpcionesEnvio = !this.mostrarOpcionesEnvio;
  }

  procesarPago(): void {
    // Aquí asumimos que `enviarCarritoAlBackend` es un método de tu servicio
    // que realiza una solicitud HTTP al backend y devuelve la URL de aprobación de PayPal.
    
    this.carroService.enviarCarritoAlBackend().subscribe({
      next: (response) => {
        // Asumiendo que el backend envía la URL de aprobación en la respuesta.
        const approvalUrl = response.approvalUrl; // Asegúrate de que la propiedad coincida con lo que envía tu backend
        window.location.href = approvalUrl; // Redirige al usuario a PayPal
        // this.carroService.limpiarCarro();
      },
      error: (error) => {
        // Aquí manejas los errores, como mostrar un mensaje al usuario
        console.error('Error al procesar el pago:', error);
      }
    });
  }
}
