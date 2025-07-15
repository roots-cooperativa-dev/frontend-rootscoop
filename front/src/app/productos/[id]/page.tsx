import { fetchProductoById } from "../../utils/ProductsHelper";
import ProductoDetalle from "../../../components/productos/DetalleComponent";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        id: string;
    };
}

const ProductoPage = async ({ params }: PageProps) => {
    const producto = await fetchProductoById(params.id);

    if (!producto) {
        notFound();
    }

    return <ProductoDetalle producto={producto} />;
};

export default ProductoPage;
