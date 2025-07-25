export interface IProducto {
  id: string;
  name: string;
  details: string;
  isDeleted: boolean;
  sizes: Size[];
  category: ICategory;
  files: File[];
}

export interface CartProduct{
  id: string,
  name: string,
  details: string,
  size: string,
  price: number,
  quantity: number,
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

export interface ProductoQueryParams {
  page?: number
  limit?: number
  name?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
}



export interface IUsuario {
  id: string;
  name: string;
  email: string;
  birthdate: string;
  phone: string;
  username: string;
  isAdmin: boolean;
  isDonator: boolean;
  donates: any[];
  password?: string;
}

export interface IOrder {
  id: string;
  date: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    birthdate: string;
    username: string;
    password: string;
    phone: string;
    isAdmin: boolean;
    isDonator: boolean;
    createdAt: string;
    updatedAt: string;
  };
  orderDetail: {
    id: string;
    total: string;
    products: {
      id: string;
      name: string;
      details: string;
      isDeleted: boolean;
      sizes: {
        id: string;
        size: string;
        price: number;
        stock: number;
      }[];
    }[];
  };
}

export interface IOrdersResponse {
  data: IOrder[];
  total: number;
}

export interface IVisita {
    id: string
    title: string
    description: string
    people: number
    status: string
    availableSlots?: any[] 
}
export interface ISlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxAppointments: number;
  appointments: IAppointment[];
}
export interface IAppointment {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
    birthdate: string;
    phone: string;
    username: string;
    isAdmin: boolean;
    isDonator: boolean;
  };
  slot: ISlot;
}