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
  address: any;
  id: string;
  email: string;
  name: string;
  birthdate: string;
  username: string;
  phone: string;
  isAdmin?: boolean;
  isDonator?:boolean;
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

