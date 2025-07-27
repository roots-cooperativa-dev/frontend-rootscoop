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

<<<<<<< HEAD
=======
export interface Iproduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  categoryId: number;
  category: Icategory;
}
interface Icategory {
    id: number;
    name: string;
    products?: Iproduct[];
}
>>>>>>> f38542eccdf4482a707960aa6371f6697e8df89d
