export interface Autor {
  idAutor: number;
  nombre: string;
  apellido: string;
  codigo: number;
  descripcion: string;
}

export interface AutorCategoria {
  idAutor: number;
  nombre?: string;
  apellido?: string;
}

