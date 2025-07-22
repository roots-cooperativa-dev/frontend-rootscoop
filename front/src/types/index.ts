interface LoginDto {
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
interface UserGoogle {
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
interface RegisterDto {
  name: string;
  email: string;
  birthdate: string;
  phone: number;
  username: string;
  password: string;
  confirmPassword: string;
}

interface Iproduct {
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