import { Card, CardContent } from "../../../../components/ui/card";

export default function TestimoniosBox() {
  return (
    <div className="p-6">
      <h2 className="text-center text-xl font-bold mb-6">
        <span className="bg-[#017d74] text-xl font-semibold bg-clip-text text-transparent font-chewy">
          Voces de nuestra comunidad
        </span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border border-[#febb07]">
          <CardContent className="p-4">
            <p className="text-m mb-3 font-popular">
              “Apoyo a ROOTS porque creo en su proyecto. Ver cómo crecen y se
              mantienen fieles a sus valores me da esperanza de que otro mundo
              es posible.”
            </p>
            <footer className="text-sm font-semibold text-[#febb07] flex items-center gap-2">
              <span className="text-[#febb07] text-xl leading-none">•</span>
              <span className="text-[#febb07] font-bebas text-lg">
                Ana, colaboradora desde 2020
              </span>
            </footer>
          </CardContent>
        </Card>

        <Card className="border border-[#922f4e]">
          <CardContent className="p-4">
            <p className="text-sm mb-3 font-popular">
              “Mi suscripción mensual es mi forma de ser parte de ROOTS sin
              estar físicamente ahí. Es mi granito de arena para la economía
              social.”
            </p>
            <footer className="text-sm font-semibold text-[#922f4e] flex items-center gap-2">
              <span className="text-[#922f4e] text-xl leading-none">•</span>
              <span className="text-[#922f4e] font-bebas text-lg">
                Carlos, suscriptor mensual
              </span>
            </footer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
