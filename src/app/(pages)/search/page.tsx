"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import HotelSearchBar from "@/app/components/searchBar";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [hotels, setHotels] = useState<any[]>([]);
  const router = useRouter();
  const [city, country] = query
    ? query
        .split(",")
        .map((part) => capitalizeFirstLetter(part.trim().toLowerCase()))
    : ["", ""];

  useEffect(() => {
    if (!query) {
      router.push("/");
    }
  }, [query, router]);

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    if (city || country) {
      const fetchHotels = async () => {
        try {
          const response = await axios.get("http://localhost:3333/hotels");
          const allHotels = response.data;

          const filteredHotels = allHotels.filter((hotel: any) => {
            const address = hotel.hotel.address.toLowerCase();
            const matchCity = city && address.includes(city.toLowerCase());
            const matchCountry =
              country && address.includes(country.toLowerCase());

            if (city && country) {
              return matchCity && matchCountry;
            }
            return matchCity || matchCountry;
          });

          setHotels(filteredHotels);
        } catch (error) {
          console.error(error);
        }
      };
      fetchHotels();
    }
  }, [city, country]);

  return (
    <div className="grid grid-rows-[20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="mt-[50px]">
        <HotelSearchBar onSearch={(params) => console.log(params)} />
        <h1 className="text-2xl mt-[30px] ml-[10px] font-semibold self-start w-full max-w-4xl text-left">
          {city && (
            <span className="text-[20px] font-extrabold text-text">{city}</span>
          )}
          {city && country && ", "}
          {country && (
            <span className="text-[20px] font-normal text-text">{country}</span>
          )}
        </h1>

        <p className="text-caption ml-[10px] font-normal mt-2 mb-[25px] mt-[-3px]">
          {hotels.length === 1
            ? "1 hotel encontrado"
            : `${hotels.length} hotéis encontrados`}
        </p>
      </div>

      <main className="w-1300px flex flex-col gap-8 row-start-2 items-center sm:items-start mb-[200px]">
        <div className="flex items-center justify-center m-auto mb-[10px]">
          {hotels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white shadow-lg overflow-hidden w-[380px] xl:w-[513px] h-[340px] xl:h-[360px] rounded-[14px] relative flex flex-col justify-between"
                >
                  <div className="relative w-full h-[240px] xl:h-[250px]">
                    {" "}
                    <img
                      src={hotel.hotel.image}
                      alt={hotel.hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-transparent shadow-[0px_-68px_76px_0px_#0080FF59_inset] pointer-events-none"></div>
                    <div className="absolute bottom-4 px-3 py-1 rounded-md shadow-md font-poppins">
                      <p className="text-lg font-semibold text-white text-[27px]">
                        R${" "}
                        {Number(hotel.lowestPrice.amount)
                          .toFixed(2)
                          .replace(/\.00$/, "")}
                        <span className="font-normal text-gray text-sm text-[10px]">
                          {" "}
                          / noite
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-xl font-semibold mb-2">
                      {hotel.hotel.name}
                    </h2>

                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex gap-x-1">
                        {Array.from({ length: hotel.hotel.stars }).map(
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

                      <button
                        onClick={() => router.push(`/hotel/${hotel.id}`)}
                        className="bg-primary w-[160px] text-[14px] text-white px-4 py-2 rounded-[50px] hover:bg-blue-600 transition shadow-[0px_2px_9px_1px_#0080FF4A] border-l-2 border-gray-300"
                      >
                        Ver mais
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            null
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
