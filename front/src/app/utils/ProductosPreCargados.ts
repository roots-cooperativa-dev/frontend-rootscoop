import { IProducto } from "../types";

export const productos: IProducto[] = [
  {
    id: 1,
    nombre: "Remera ROOTS Cooperativa",
    precio: 15000,
    imagen: "/productos/remera.png",
    descripcion: "Remera 100% algodón con diseño exclusivo de la cooperativa",
    categoria: "Indumentaria",
    disponible: true,
  },
  {
    id: 2,
    nombre: "Gorra ROOTS Cooperativa",
    precio: 8000,
    imagen: "/productos/gorra.png",
    descripcion: "Gorra con logo bordado de la cooperativa, ajustable y de alta calidad",
    categoria: "Indumentaria",
    disponible: true,
  },
  {
    id: 3,
    nombre: "Bolsa Ecológica ROOTS",
    precio: 5000,
    imagen: "/productos/bolsa.png",
    descripcion: "Bolsa reutilizable de tela orgánica",
    categoria: "Accesorios",
    disponible: false,
  },
  {
    id: 4,
    nombre: "Mochila ROOTS Cooperativa",
    precio: 12000,
    imagen: "/productos/mochila.png",
    descripcion: "Mochila resistente y espaciosa, ideal para uso diario o viajes, con diseño exclusivo de la cooperativa",
    categoria: "Accesorios",
    disponible: true,
  },
];