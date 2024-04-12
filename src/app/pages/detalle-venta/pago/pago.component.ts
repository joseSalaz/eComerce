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

  isLoading = false;

  mostrarOpcionesEnvio: boolean = false;

  constructor(
    private carroService: CarroService, 
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private pago:PagoService,
    private router: Router
    ) {}


    ngOnInit(): void {
      // Escuchar los parámetros de consulta para el proceso de pago con PayPal
      this.activatedRoute.queryParams.subscribe(params => {
        const paymentId = params['paymentId'];
        const payerId = params['PayerID'];
    
        // Verifica si la URL contiene los parámetros esperados de PayPal
        if (paymentId && payerId) {
          this.isLoading = true; // Activa el indicador de carga al iniciar el proceso de ejecución del pago
          this.pago.executePayment(paymentId, payerId).subscribe({
            next: (response) => {
              this.isLoading = false; // Desactiva el indicador de carga después de completar el proceso
            },
            error: (error) => {
              // Manejar el error
              console.error('Error al confirmar el pago:', error);
              this.router.navigate(['']); // Considera redirigir al usuario a una página de error específica
              this.isLoading = false; // Desactiva el indicador de carga también en caso de error
            }
          });
        }
      });
    }
    



  toggleOpcionesEnvio(): void {
    this.mostrarOpcionesEnvio = !this.mostrarOpcionesEnvio;
  }

  procesarPago(): void {

    this.isLoading=true;    
    this.carroService.enviarCarritoAlBackend().subscribe({
      next: (response) => {
        this.isLoading = true;
        // Asumiendo que el backend envía la URL de aprobación en la respuesta.
        const approvalUrl = response.approvalUrl; // Asegúrate de que la propiedad coincida con lo que envía tu backend
        window.location.href = approvalUrl; // Redirige al usuario a PayPal
        
      },
      error: (error) => {
        // Aquí manejas los errores, como mostrar un mensaje al usuario
        console.error('Error al procesar el pago:', error);
      }
    });
  }
}
