"use client";
import Image from "next/image";
import HotelSearchBar from "../components/searchBar";
import { useRouter } from "next/navigation";
import FooterBar from "../components/footerBar";

export default function Home() {
  const router = useRouter();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-1300px flex flex-col gap-8 row-start-2 items-center sm:items-start mb-[200px]">
        <div className="flex items-center justify-center m-auto mb-[10px]">
          <h1 className="font-poppins text-5xl font-semibold leading-tight text-center decoration-skip-none">
            Os melhores <span className="text-primary">Hoteis</span>{" "}
            <span className="text-black">e</span>{" "}
            <span className="text-primary">Destinos</span>
            <br />
            <span className="text-black"> para sua viagem</span>
          </h1>
        </div>
        <div className="w-full">
          <HotelSearchBar onSearch={(params) => console.log(params)} />
        </div>
      </main>
    </div>
  );
}
