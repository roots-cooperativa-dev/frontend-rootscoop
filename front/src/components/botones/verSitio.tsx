import Link from "next/link";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";

const ButtonHome = () => {
  return (
    <>
      <Button
        variant="outline"
        className="border-[#017d74] text-[#017d74] bg-transparent hidden md:flex"
        asChild
      >
        <Link href="/">
          <Eye className="w-4 h-4 mr-2" />
          Ver sitio
        </Link>
      </Button>
    </>
  );
};

export default ButtonHome;
