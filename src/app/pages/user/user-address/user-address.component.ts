import { Component, OnInit } from '@angular/core';
import { Direccion } from '../../../Interface/direccion';
import { DireccionService } from '../../../Service/direccion.service';
import { AuthService } from '../../../Service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-address',
  templateUrl: './user-address.component.html',
  styleUrls: ['./user-address.component.scss']
})
export class UserAddressComponent implements OnInit {
  direcciones: Direccion[] = [];
  nuevaDireccion: Direccion = {
    idPersona: 0, direccion1: '', referencia: '',
    departamento: '', provincia: '', distrito: '',
    codigoPostal: '', esPredeterminada: false
  };

  constructor(private direccionService: DireccionService, private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarDirecciones();
  }

  cargarDirecciones(): void {
    const usuarioId = this.authService.getUsuarioId();
    if (usuarioId) {
      this.direccionService.getDireccionesByUsuario(usuarioId).subscribe(direcciones => {
        this.direcciones = direcciones;
      });
    }
  }

  agregarDireccion(): void {
    const usuarioId = this.authService.getUsuarioId();
    this.nuevaDireccion.idPersona = usuarioId;

    this.direccionService.createDireccion(this.nuevaDireccion).subscribe(() => {
      this.cargarDirecciones();
      this.nuevaDireccion = { idPersona: usuarioId, direccion1: '', referencia: '', departamento: '', provincia: '', distrito: '', codigoPostal: '', esPredeterminada: false };
      Swal.fire('✅ Dirección agregada', 'Se ha guardado correctamente.', 'success');
    });
  }
}
