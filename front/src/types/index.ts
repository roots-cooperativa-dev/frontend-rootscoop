interface LoginDto {
    email: string
    password: string
}

interface Iuser {
    name: string;
    email: string;
    birthdate: string
    phone: number;
    username: string
    password: string
    confirmPassword: string
}
enum Irole {
    ADMIN = "admin",
    USER = "user"
}
interface RegisterDto {
    name: string
    email: string
    birthdate: string
    phone: number
    username: string
    password: string
    confirmPassword: string
}
