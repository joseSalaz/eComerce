import { Component, Input } from '@angular/core';
import { AutorCategoria } from '../../../Interface/autor';
import { Proveedor } from '../../../Interface/proveedor';
import { FormsModule } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrl: './filtro.component.scss'
})
export class FiltroComponent {
  // Recibe la lista desde el padre 
  @Input() filtros: AutorCategoria[] = [];
  @Input() proveedores: Proveedor[] = [];
  @Output() filtroChange = new EventEmitter<any>();
  autoresSeleccionados: number[] = [];
  proveedoresSeleccionados: number[] = [];

  precioMinimo?: number;
  precioMaximo?: number;
  //control para casos de movil
  menuMovilAbierto: boolean = false;
  mostrarContenido = 5;
  mostrarProveedores = 5;
  toggleMenuMovil() {
    this.menuMovilAbierto = !this.menuMovilAbierto;
  }

  cargarMasAutores(): void {
    this.mostrarContenido += 5;
  }

  cargarMasProveedores(): void {
    this.mostrarProveedores += 5;
  }
  mostrarMenosAutores(): void {
    this.mostrarContenido = 5;
  }
  mostrarMenosProveedores(): void {
    this.mostrarProveedores = 5;
  }
  seleccionarAutor(idAutor: number, event: Event): void {

    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.autoresSeleccionados.push(idAutor);
    } else {
      this.autoresSeleccionados =
        this.autoresSeleccionados.filter(x => x !== idAutor);
    }

    this.emitirFiltro();
  }
  seleccionarProveedor(idProveedor: number, event: Event): void {

    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.proveedoresSeleccionados.push(idProveedor);
    } else {
      this.proveedoresSeleccionados =
        this.proveedoresSeleccionados.filter(x => x !== idProveedor);
    }

    this.emitirFiltro();
  }
  emitirFiltro(): void {

    this.filtroChange.emit({
      autores: this.autoresSeleccionados,
      proveedores: this.proveedoresSeleccionados,
      precioMinimo: this.precioMinimo,
      precioMaximo: this.precioMaximo
    });

  }
  limpiarFiltros(): void {

    this.autoresSeleccionados = [];
    this.proveedoresSeleccionados = [];

    this.precioMinimo = undefined;
    this.precioMaximo = undefined;

    this.emitirFiltro();

  }
}
