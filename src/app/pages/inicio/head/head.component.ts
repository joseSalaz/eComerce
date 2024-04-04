import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../../Service/auth.service';
import { Router } from '@angular/router';
import { sesioncosntans } from '../../../constans/sesion.constans';
import { Console, error, log } from 'console';
import { CarroService } from '../../../Service/carro.service';
import { CategoriaService } from '../../../Service/categoria.service';
import { Categorium } from '../../../Interface/categorium';
import { ItemCarrito } from '../../../Interface/carrito';
import { UsuarioGoogle } from '../../../Interface/usuario';
import { UsuarioRegistradoResponse } from '../../../Interface/usuarioRegistradoResponse';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.scss']
})
export class HeadComponent implements OnInit {
  vernombre: boolean = false;
  displayname: string = "";
  mostrarCarrito = false;
  totalItems: number = 0;
  categorias: Categorium[] = [];
  isMenuVisible: boolean = false;
  isProcessing: boolean=false;


  constructor(
    private authService: AuthService,
    private router: Router,
    private carroService:CarroService,
    private categoriaService:CategoriaService
  ) {}

  ngOnInit(): void {
    this.totalItems = this.carroService.obtenerCantidadProductos();
    this.carroService.itemsCarrito.subscribe((items: ItemCarrito[]) => {
      this.totalItems = items.reduce((acc, item) => acc + item.cantidad, 0);
      this.obtenerCategorias(); // Asegúrate de que este método no dependa de `items`
    });
  
    this.authService.sesion$.subscribe(userProfile => {
      if (userProfile && userProfile.usu && userProfile.usu.length > 0) {
        // Asumiendo que 'usu' es un arreglo y que los datos de perfil están en el primer elemento
        const profileData = userProfile.usu[0];
        this.vernombre = !!profileData.name; 
        this.displayname = profileData.name || '';
        this.registrarOVerificarUsuario(profileData);
      } else {
        this.vernombre = false;
        this.displayname = '';
      }
    });
    
  }
registrarOVerificarUsuario(profileData:any) {
    if (this.isProcessing) return; // Previene ejecuciones duplicadas

    this.isProcessing = true; // Estado de carga activo
    const usuarioParaRegistrar = {
        correo: profileData.email,
        sub: profileData.sub,
    };

    this.authService.verificarUsuario(usuarioParaRegistrar).subscribe({
        next: (usuarioRegistrado) => {
            localStorage.setItem('usuarioData', JSON.stringify(usuarioRegistrado));
            this.isProcessing = false; // Restablece el estado de carga
        },
        error: (error) => {
            console.error('Hubo un error al registrar o verificar al usuario', error);
            this.isProcessing = false; // Restablece el estado de carga
        }
    });
}
  
  obtenerCategorias(): void {
    this.categoriaService.getList().subscribe(
      categorias => {
        this.categorias = categorias;
      },
      error => {
        console.error('Error al obtener las categorías:', error);
      }
    );
  }
  
checkSession(): void {
  const userProfile: any = this.authService.getProfile(); 
}

@HostListener('document:click', ['$event'])
onDocumentClick(event: Event): void {
  this.isMenuVisible = false;
}

toggleMenu(event: MouseEvent): void {
  // Evita que el evento de clic se propague a elementos superiores
  event.stopPropagation();
  
  // Alterna la visibilidad del menú desplegable
  this.isMenuVisible = !this.isMenuVisible;
}


onSelectOption(option: string): void {
  this.isMenuVisible = false; // Cierra el menú al seleccionar una opción
  if (option === 'miperfil') {
    this.router.navigate(['/user']);
  } else if (option === 'cerrarSesion') {
    this.authService.logout();
    this.router.navigate(['/inicio']);
  }
}


  toggleCarrito() {
    this.mostrarCarrito = !this.mostrarCarrito;
  }

  onClick() {
    this.authService.logout();
    this.router.navigate(['/inicio']);
  }
  redireccionarALibros(idCategoria: number) {
    this.router.navigate(['/categoria', idCategoria, 'libros']);
}
}

