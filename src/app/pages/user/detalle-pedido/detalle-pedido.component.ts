import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { Modal } from 'bootstrap';
import { EstadoPedido, EstadoPedidoImagen } from '../../../Interface/estado_pedido';
import { VentaService } from '../../../Service/venta.service';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.scss']
})
export class EstadoPedidoModalComponent implements OnInit {
  @Input() idDetalleVenta: number | null = null;
  @Output() cerrar = new EventEmitter<void>();
  
  estadoPedido: EstadoPedido | null = null;
  imagenesEstado: EstadoPedidoImagen[] = [];
  modal: any;

  constructor(private ventaService: VentaService) {}

  ngOnInit(): void {
    if (this.idDetalleVenta) {
      this.obtenerEstadoPedido(this.idDetalleVenta);
      this.abrirModal();
    }
  }

  private abrirModal(): void {
    const modalElement = document.getElementById('estadoPedidoModal');
    if (modalElement) {
      this.modal = new Modal(modalElement, {
        backdrop: 'static',
        keyboard: false
      });
      this.modal.show();
    }
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

  cerrarModal(): void {
    if (this.modal) {
      this.modal.hide();
      this.cerrar.emit();
    }
  }
}