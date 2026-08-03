export interface Libro {
    idLibro: number;
    titulo?: string;
    isbn?: number;
    tamanno?: string;
    descripcion?: string;
    condicion?: string;
    impresion?: string;
    tipoTapa?: string;
    estado?: boolean;
    idSubcategoria: number;
    idTipoPapel: number;
    idProveedor: number;
    imagen: string;
    precioVenta?: number;
}

export interface LibroCatalogo {
    libro: Libro;
    precio: number;
}

export interface ApiResponseLibros {
    success: boolean;
    data: LibroCatalogo[];
}


export interface LibroFiltroResponse {

  idLibro:number;

  titulo:string;

  imagen:string;

  precioVenta:number;

  razonSocial:string;

}