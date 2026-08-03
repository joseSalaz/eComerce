import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from '../../../../Service/categoria.service';
import { Categorium } from '../../../../Interface/categorium';

@Component({
  selector: 'app-filtrador',
  templateUrl: './filtrador.component.html',
  styleUrl: './filtrador.component.scss'
})
export class FiltradorComponent implements OnInit {
  categorias: Categorium[] = [];
  isMenuVisible: boolean = false;
  isProcessing: boolean = false;
  hoveredCategoriaId: number | null = null;

  constructor(
    private router: Router,
    private categoriaService: CategoriaService,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.obtenerCategorias();
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

  redireccionarALibros(idCategoria: number) {
    this.router.navigate(['/categoria', idCategoria, 'libros']);
    this.isMenuVisible = false; 
  }

  cargarSubcategorias(idCategoria: number): void {
    this.categoriaService.getSubCategoriasPorId(idCategoria).subscribe(subcategorias => {
      const categoriaIndex = this.categorias.findIndex(c => c.idCategoria === idCategoria);
      if (categoriaIndex !== -1) {
        this.categorias[categoriaIndex].subcategorias = subcategorias;
        this.categorias = [...this.categorias];
        this.hoveredCategoriaId = idCategoria;
        this.cd.detectChanges();
      }
    }, (error: any) => {
      console.error('Error al cargar subcategorías', error);
    });
  }

  // Método para desplegar subcategorías en móviles
  toggleSubcategoriasMovil(idCategoria: number, event: Event): void {
    event.stopPropagation(); // Evita que se disparen otros clicks
    
    if (this.hoveredCategoriaId === idCategoria) {
      this.hoveredCategoriaId = null; // Cierra si ya está abierta
    } else {
      this.cargarSubcategorias(idCategoria); // Carga del servidor y abre
    }
  }

  redireccionarALibrosSubcategoria(idCategoria: number, idSubcategoria: number) {
    this.router.navigate([
      '/categoria',
      idCategoria,
      'subcategoria',
      idSubcategoria,
      'libros'
    ]);
    this.isMenuVisible = false;
  }

  toggleMenuMovil(): void {
    this.isMenuVisible = !this.isMenuVisible;
  }

  mostrarSubcategorias(categoriaId: number): boolean {
    return categoriaId === this.hoveredCategoriaId;
  }

  esconderSubcategorias(): void {
    this.hoveredCategoriaId = null;
  }
}