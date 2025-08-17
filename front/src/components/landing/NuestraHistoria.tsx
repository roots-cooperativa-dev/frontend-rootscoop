"use client";
export const NuestraHistoria = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-chewy text-4xl font-chewy font-black text-center mb-4 text-[#017d74]">
          Nuestra Historia
        </h2>
        <p className="font-bebas text-center text-gray-600 mb-12 text-lg">
          Más de una década construyendo alternativas, tejiendo redes y
          sembrando futuro
        </p>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-bebas text-3xl font-popular mb-6 text-[#922f4e]">
              Desde 2013 trabajando en colectivo
            </h3>
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                <span className="font-popular text-[#642d91]">ROOTS</span> es
                una cooperativa de trabajo que nació un 10 de octubre alla por
                el 2013, un grupo de pibes y pibas por la necesidad de tener un
                espacio de trabajo{" "}
                <span className="font-popular text-[#922f4e]">
                  sano, compañero, libre de explotacion
                </span>{" "}
                Ademas darle una vuelta de tuerca a lo que la gastronomía
                concentrada platense nos ofrece.
              </p>
              <p>
                Transformando un viejo local de una farmacia, reciclando los
                hierros para fabricar las mesas de trabajo, y el mostrador con
                cocina y hornos prestados y aportes de herramientas de cada une
                de nosotres. Arrancamos siendo 6 compañerxs, de a poco fuimos
                aprendiendo, construyendo un grupo de trabajo estable y creando
                también nuevas variedades y sabores. Con el objetivo de obtener
                nuestras primeras herramientas de{" "}
                <span className="font-popular text-[#febb07]">
                  propiedad colectiva
                </span>
                .
              </p>
              <p>
                Hoy somos 20 compañeres que participamos en la coope seguimos
                apostando al trabajo colectivo y creciendo con la convicción de
                crear un espacio de trabajo{" "}
                <span className="font-popular text-[#922f4e]">
                  transformador e Inclusivo
                </span>
                .
              </p>
              <p>
                Elaboramos cerveza artesanal, panificados, pizzas y empanadas,
                producimos eventos culturales, apoyamos y hacemos
                <span className="font-popular text-[#017d74]"> red </span> con
                distintos espacios y hacedores culturales y cooperativos.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="historia/1.png"
                  alt="Cooperativistas trabajando juntos"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="historia/2.png"
                  alt="Fabricación de cerveza artesanal"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-lg">
              <img
                src="historia/5.png"
                alt="Feria de productores con ROOTS"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="historia/4.png"
                  alt="Pizza artesanal en horno"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                <img
                  src="historia/3.png"
                  alt="Empanadas caseras"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
