export interface IProducto {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion: string;
  categoria: string;
  disponible: boolean;
}

export enum Irole {
    ADMIN = "admin",
    USER = "user"
}
