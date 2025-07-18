import { Navbar } from "../components/landing/Navbar"
import { HeroSection } from "../components/landing/HeroSection"
import { CarrouselSection } from "../components/landing/Carrousel"
import { LoqueHacemos } from "../components/landing/LoqueHacemos"
import { Valores } from "../components/landing/Valores"
import { NuestraHistoria } from "../components/landing/NuestraHistoria"
import { VocesRoots } from "../components/landing/VocesRoots"
import { ProductoDestacado } from "../components/landing/ProductoDestacado"
import { TopDonantes } from "../components/landing/TopDonantes"
import { Servicios } from "../components/landing/Servicios"
import { Footer } from "../components/landing/Footer"
import { BotonScroll } from "../components/landing/Ui/BotonScrool"

export default function Home() {
  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
        <Navbar />
      </header>
      <section className="relative h-screen overflow-hidden">
        <HeroSection />
      </section>
      <section id="carrusel" className="py-20 bg-white">
        <CarrouselSection />
      </section>
      <section className="py-16 bg-gray-50">
        <LoqueHacemos />
      </section>
      <section className="py-16 bg-white">
        <Valores />
      </section>
      <section id="historia" className="py-16 bg-gray-50">
        <NuestraHistoria />
      </section>
      <section className="py-16 bg-white">
        <VocesRoots />
      </section>
      <section className="py-16 bg-gray-50">
        <ProductoDestacado />
      </section>
      <section className="py-16 bg-white">
        <TopDonantes />
      </section>
      <section className="py-16 bg-gray-50">
        <Servicios />
      </section>
      <Footer />
      <BotonScroll />
    </>
  )
}
