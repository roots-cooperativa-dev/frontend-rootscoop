export interface IProducto {
  id: string;
  name: string;
  details: string;
  isDeleted: boolean;
  sizes: Size[];
  category: Category;
  files: File[]; 
}

export interface Size {
  id: string;
  size: string;
  price: number;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface File {

  id?: string;
  url?: string;
  name?: string;
}
