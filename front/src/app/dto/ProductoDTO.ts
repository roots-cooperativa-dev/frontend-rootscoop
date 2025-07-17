export interface ProductoDTO {
  name: string;
  details: string;
  category_Id: string;
  sizes: {
    size: string;
    price: number;
    stock: number;
  }[];
  file_Ids: string[];
}
