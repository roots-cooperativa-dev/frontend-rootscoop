


import { DetalleProductoDash } from '../../../../components/dashboard/DetalleProductoDash'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <DetalleProductoDash productId={params.id} />
}
