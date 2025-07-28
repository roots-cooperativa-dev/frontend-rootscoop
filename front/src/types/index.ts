export interface LoginDto {
  email: string;
  password: string;
}

interface Iuser {
  name: string;
  email: string;
  birthdate: string;
  phone: number;
  username: string;
  password: string;
  confirmPassword: string;
}
export interface UserGoogle {
  id: string;
  name: string;
  email: string;
  birthdate: string;
  phone: string;
  address: any;
  username: string;
  isAdmin: boolean;
  isDonator: boolean;
  donates: any[];         // podés tiparlo mejor si querés
  orders: any[];
  appointments: any[];
  cart: any[]; 
}
enum Irole {
  ADMIN = "admin",
  USER = "user",
}
export interface RegisterDto {
  name: string;
  email: string;
  birthdate: string;
  phone: number;
  username: string;
  password: string;
  confirmPassword: string;
}

