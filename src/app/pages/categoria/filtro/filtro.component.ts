import { Component, Input } from '@angular/core';
import { AutorCategoria } from '../../../Interface/autor';
import { Proveedor } from '../../../Interface/proveedor';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrl: './filtro.component.scss'
})
export class FiltroComponent {
  // Recibe la lista desde el padre 
  @Input() filtros: AutorCategoria[] = [];
  @Input() proveedores: Proveedor[] = [];
  //control para casos de movil
  mostrarContenido: boolean = false; 
  menuMovilAbierto: boolean = false;  

  toggleMenuMovil() {
    this.menuMovilAbierto = !this.menuMovilAbierto;
  }
}
