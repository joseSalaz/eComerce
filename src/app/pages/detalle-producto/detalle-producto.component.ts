import { Component,OnInit } from '@angular/core';
import { AutorService } from '../../Service/autor.service';
import { Autor } from '../../Interface/autor';
import { HttpHeaders } from '@angular/common/http';
import { Libro } from '../../Interface/libro';
import { ActivatedRoute } from '@angular/router';
import { LibroService } from '../../Service/libro.service';
@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss']
})
export class DetalleProductoComponent {
  libro: any;
  idLibro: string='';
  cantidad: number = 1; 
  altura: number = 0;
  ancho: number = 0;
  constructor(
    private route: ActivatedRoute,
    private libroservice: LibroService
    ) { }
  incrementarCantidad(): void {
    this.cantidad++;
  }

  decrementarCantidad(): void {
    if (this.cantidad > 1) {
      this.cantidad--; 
    }
  }
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.idLibro = id;
    } else {
    }
    this.libroservice.getLibroPorId(this.idLibro).subscribe(
      (data: any) => {
        this.libro = data; 
        console.log(this.libro);
        const tamannoSplit = this.libro.tamanno.split('*');
        if (tamannoSplit.length === 2) {
          this.altura = parseFloat(tamannoSplit[0]);
          this.ancho = parseFloat(tamannoSplit[1]);
        }
      },
      (error: any) => {
        console.error('Error al obtener los detalles del libro:', error);
      }
      
    );
  }
  
}
