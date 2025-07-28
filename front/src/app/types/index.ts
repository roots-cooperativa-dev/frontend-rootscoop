export interface IProducto {
  id: string;
  name: string;
  details: string;
  deletedAt?: string | null; // ✅ importante
  sizes: Size[];
  category: ICategory;
  files: File[];
}


export interface CartProduct {
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
  deletedAt?: string | null; 
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
  createdAt: string; // o Date, según tu backend
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
  date: string | number | Date;
  fechaCreacion: string | number | Date;
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

export interface IOrderDetailProduct {
  isDeleted: any;
  id: string;
  name: string;
  details: string;
  isActive: boolean;
  sizes: Size[];
}

export interface IOrderDetail {
  id: string;
  total: string;
  products: IOrderDetailProduct[];
}

export interface IUserInOrder {
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
}

export interface IOrderById {
  id: string;
  date: string;
  status: string;
  user: IUserInOrder;
  orderDetail: IOrderDetail;
}


export interface IUserAddress {
  id: string;
  street: string;
  latitude: string;
  longitude: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  birthdate: string;
  username: string;
  password: string;
  phone: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isDonator: boolean;
  createdAt: string;
  updatedAt: string;
  address: IUserAddress | null;
}

export interface IVisit {
  id: string;
  title: string;
  description: string;
  people: number;
  status: string;
}

export interface IVisitSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  maxAppointments: number;
  currentAppointmentsCount: number;
  visitId: string;
  visit: IVisit;
}

export interface IFullAppointment {
  id: string;
  userId: string;
  status: string;
  bookedAt: string;
  numberOfPeople: number;
  visitSlotId: string;
  description: string;
  visitSlot: IVisitSlot;
  user: IUser;
}

export interface IAppointmentsPaginatedResponse {
  data: IFullAppointment[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
export interface AppointmentsQueryParams {
  status?: "pending" | "approved" | "rejected" | "cancelled" | "completed" | undefined
  page?: number;
  limit?: number;
}
