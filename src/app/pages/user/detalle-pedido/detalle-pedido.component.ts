import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EstadoPedido, EstadoPedidoImagen } from '../../../Interface/estado_pedido';
import { VentaService } from '../../../Service/venta.service copy';
import { Router } from '@angular/router';
import { AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.scss']
})
export class DetallePedidoComponent implements OnInit, AfterViewInit  {
  estadoPedido: EstadoPedido | null = null;
  idDetalleVenta: number | null = null;
  imagenesEstado: EstadoPedidoImagen[] = []; // 🔥 SE AGREGA ESTA PROPIEDAD

  constructor(
    private route: ActivatedRoute,
    private ventaService: VentaService,
    private router: Router
  ) {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');
    }, 500);
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idDetalleVenta = Number(params['id']);
  
      if (this.idDetalleVenta) {
        
        this.obtenerEstadoPedido(this.idDetalleVenta);
      } else {
        console.error('⚠️ Error: idDetalleVenta es undefined al recibir el parámetro.');
      }
    });
  }
  
  

  obtenerEstadoPedido(idDetalleVenta: number): void {
    this.ventaService.obtenerEstadoPedido(idDetalleVenta).subscribe({
      next: (estado) => {
        this.estadoPedido = estado;
        this.imagenesEstado = estado.estadoPedidoImagenes || [];
        
      },
      error: (error) => {
        console.error('⚠️ Error al obtener estado del pedido:', error);
      }
    });
  }
  

  volver(): void {

    this.router.navigate(['/user']);
  }
}
