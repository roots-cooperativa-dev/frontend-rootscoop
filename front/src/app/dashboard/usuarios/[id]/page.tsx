import { DetalleUsuario } from "@/src/components/dashboard/DetalleUsuario";
const UsuarioDetallePage = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Detalles del Usuario</h1>
            <DetalleUsuario />
        </div>
    );
}
export default UsuarioDetallePage;