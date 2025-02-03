"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import HotelSearchBar from "@/app/components/searchBar";
import React from "react";

interface Room {
  roomType?: { name: string };
  price?: { amount: number };
  cancellationPolicies?: { refundable: boolean };
}

interface Hotel {
  id: number;
  hotel?: {
    name?: string;
    image?: string;
    description?: string;
    address?: string;
    stars?: number;
  };
  lowestPrice?: { amount: number };
  rooms?: Room[];
}

const HotelPage = () => {
  const params = useParams();
  const hotelId = params?.hotelId?.toString();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [showThanks, setShowThanks] = useState(false); 

  useEffect(() => {
    if (!hotelId) return;

    const fetchHotel = async () => {
      try {
        const response = await axios.get<Hotel[]>(
          "http://localhost:3333/hotels"
        );
        const selectedHotel = response.data.find(
          (h) => h.id.toString() === hotelId
        );
        setHotel(selectedHotel || null);
      } catch (error) {
        console.error("Erro ao buscar hotel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  const handleReserve = () => {
    setShowThanks(true);
    setTimeout(() => {
      setShowThanks(false);
    }, 3000); 
  };

  return (
    <div className="flex flex-col items-center w-full sm:p-20 font-poppins">
      <div className="mt-[-60px] w-[100%]">
        <HotelSearchBar onSearch={(params) => console.log(params)} />
      </div>
      {loading ? (
        <p className="text-lg mt-4">Carregando...</p>
      ) : hotel ? (
        <div className="bg-white shadow-lg rounded-[14px] p-6 w-full mt-6">
          <div className="flex">
            <img
              src={hotel.hotel?.image || "/fallback.jpg"}
              alt={hotel.hotel?.name || "Imagem não disponível"}
              className="w-[500px] h-[350px] object-cover rounded-lg"
            />

            <div className="ml-6 flex flex-col justify-start">
              <h1 className="text-2xl font-bold text-gray-800">
                {hotel.hotel?.name || "Nome não disponível"}
              </h1>
              <div className="text-gray-600 mt-1">
                <div className="flex items-center gap-2">
                  <img
                    src="/icons/local.svg"
                    alt="Ícone de localização"
                    className="w-[20px] h-[20px]"
                  />
                  <span className="text-caption font-normal">
                    {hotel.hotel?.address || "Endereço não disponível"}
                  </span>
                </div>
              </div>

              <div className="flex items-center mt-2 gap-x-2">
                {Array.from({ length: hotel.hotel?.stars || 0 }).map(
                  (_, index) => (
                    <img
                      key={index}
                      src="/icons/estrela.svg"
                      alt="Estrela"
                      className="w-5 h-5"
                    />
                  )
                )}
              </div>
              <p
                className="mt-4 leading-[2.2] text-[15px] text-caption"
                dangerouslySetInnerHTML={{
                  __html:
                    hotel.hotel?.description?.replace(/\n/g, "<br/>") ||
                    "Descrição não disponível",
                }}
              />
            </div>
          </div>

          <h2 className="text-text font-bold text-[20px] mt-8">
            Quartos disponíveis
          </h2>
          <div className="mt-4 grid gap-4">
            {hotel.rooms?.length ? (
              hotel.rooms.map((room, index) => (
                <div
                  key={index}
                  className="bg-lightgray p-6 rounded-[11px] shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-[16px] mb-[10px]">
                      {room.roomType?.name || "Tipo não especificado"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {room.cancellationPolicies?.refundable ? (
                        <>
                          <img
                            src="/icons/free.svg"
                            alt="Ícone de check"
                            className="w-4 h-4"
                          />
                          <p className="font-bold text-primary text-[12px]">
                            Cancelamento gratuito
                          </p>
                        </>
                      ) : (
                        <>
                          <img
                            src="/icons/multa.svg"
                            alt="Ícone de erro"
                            className="w-4 h-4 text-red"
                          />
                          <p className="font-bold text-red text-[12px]">
                            Multa de cancelamento
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right mr-[30px]">
                      <p className="text-[25px] font-semibold text-primary">
                        R$ {room.price?.amount ?? "N/A"}{" "}
                        <span className="text-[14px] font-normal">/ noite</span>
                      </p>
                      <p className="text-xs text-caption">Pagamento no hotel</p>
                    </div>
                    <button
                      className="bg-primary w-[150px] h-[42px] mt-[3px] text-[14px] text-white px-4 py-2 rounded-[50px] hover:bg-blue-600 transition shadow-[0px_2px_9px_1px_#0080FF4A] border-l-2 border-gray-300"
                      onClick={handleReserve} 
                    >
                      Reservar Agora
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nenhum quarto disponível.</p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-lg mt-4">Hotel não encontrado.</p>
      )}

      {showThanks && (
        <div className="fixed top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-overlay/95 text-white z-50">
          <div className="absolute flex items-center justify-center">
            <img
              src="/icons/thanks.svg"
              alt="Descrição da imagem"
              className="w-[500px] h-[500px]"
            />
          </div>

          <div className="relative mt-[250px] flex flex-col items-center">
            <p className="text-[50px] font-normal">Obrigado!</p>
            <p className="text-[25px] font-normal">Reserva realizada com sucesso.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelPage;
