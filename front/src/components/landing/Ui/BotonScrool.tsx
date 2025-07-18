'use client'
import { ChevronUp } from "lucide-react" 
export const BotonScroll = () => {
    const handleScroll = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={handleScroll}
            className="fixed bottom-5 right-5 z-50 bg-[#017d74]/90 hover:bg-[#015d54] text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out hover:scale-110 backdrop-blur-sm"
            aria-label="Volver arriba"
        >
            <ChevronUp className="w-5 h-5" />
        </button>
    );
};
