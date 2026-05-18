import { Component, OnInit } from '@angular/core';
import { Venta } from '../../../Interface/venta';
import { VentaService } from '../../../Service/venta.service';
import { AuthService } from '../../../Service/auth.service';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.scss']
})
export class UserOrdersComponent implements OnInit {
  ventas: Venta[] = [];

  constructor(private ventaService: VentaService, private authService: AuthService) {}

  ngOnInit(): void {
    const usuarioId = this.authService.getUsuarioId();
    if (usuarioId) {
      this.ventaService.obtenerVentasPorPersona(usuarioId).subscribe(ventas => {
        this.ventas = ventas;
      });
    }
  }
}

