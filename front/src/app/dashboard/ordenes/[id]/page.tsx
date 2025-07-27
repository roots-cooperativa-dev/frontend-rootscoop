import { DetalleOrden } from "@/src/components/dashboard/DetalleOrden";
const OrdenDetallePage = ({ params }: { params: { id: string } }) => {
    return (
        <div>
            <DetalleOrden OrdenID={params.id}/>
        </div>
    )
}
export default OrdenDetallePage;