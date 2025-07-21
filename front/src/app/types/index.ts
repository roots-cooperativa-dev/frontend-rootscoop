export interface IProducto {
  id: string;
  name: string;
  details: string;
  isDeleted: boolean;
  sizes: Size[];
  category: ICategory;
  files: File[]; 
}

export enum Irole {
    ADMIN = "admin",
    USER = "user"
}

export interface Size {
  id: string;
  size: string;
  price: number;
  stock: number;
}

export interface File {

  id: string;
  url: string;
  name: string;
}

export interface ICategory {
  id: string;
  name: string;
}