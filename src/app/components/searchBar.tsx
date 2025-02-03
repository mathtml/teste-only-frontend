"use client";

import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const HotelSearchBar = ({ onSearch }: { onSearch: (params: any) => void }) => {
  const [local, setLocal] = useState("");
  const [entrada, setEntrada] = useState<Date | undefined>(undefined);
  const [saida, setSaida] = useState<Date | undefined>(undefined);
  const [adultos, setAdultos] = useState(1);
  const [criancas, setCriancas] = useState(0);
  const [openHospedes, setOpenHospedes] = useState(false);
  const [hotels, setHotels] = useState<any[]>([]);
  const [tempAdultos, setTempAdultos] = useState(adultos);
  const [tempCriancas, setTempCriancas] = useState(criancas);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (local.length >= 3) {
      const fetchHotels = async () => {
        try {
          const response = await axios.get(`http://localhost:3333/hotels`, {
            params: { city: local },
          });
          setHotels(response.data);
        } catch (error) {}
      };
      fetchHotels();
    } else {
      setHotels([]);
    }
  }, [local]);

  const handleSearch = () => {
    if (!local || !entrada || !saida) {
      alert("Por favor, preencha todos os campos para pesquiasr");
      return;
    }
  
    window.location.href = `/search?query=${local}`;
  };
 

  useEffect(() => {
    const savedLocal = localStorage.getItem("local");
    const savedEntrada = localStorage.getItem("entrada");
    const savedSaida = localStorage.getItem("saida");
    const savedAdultos = localStorage.getItem("adultos");
    const savedCriancas = localStorage.getItem("criancas");

    if (savedLocal) setLocal(savedLocal);
    if (savedEntrada) setEntrada(new Date(savedEntrada));
    if (savedSaida) setSaida(new Date(savedSaida));
    if (savedAdultos) setAdultos(Number(savedAdultos));
    if (savedCriancas) setCriancas(Number(savedCriancas));
  }, []);

  // Armazena os dados no localStorage sempre que houver alterações
  useEffect(() => {
    localStorage.setItem("local", local);
    if (entrada) localStorage.setItem("entrada", entrada.toISOString());
    if (saida) localStorage.setItem("saida", saida.toISOString());
  }, [local, entrada, saida, adultos, criancas]);
  

  const handleClickOption = (city: string, country: string) => {
    setLocal(`${city}, ${country}`); 
    setShowSuggestions(false); 
    localStorage.setItem("local", String(city));
  };

  const handleApply = () => {
    setAdultos(tempAdultos);
    setCriancas(tempCriancas);
    setOpenHospedes(false);
  
    localStorage.setItem("adultos", String(tempAdultos));
    localStorage.setItem("criancas", String(tempCriancas));
  };
  const getCityAndCountryFromAddress = (address: string) => {
    const addressParts = address.split(",").map((part) => part.trim());

    const city = addressParts[addressParts.length - 3];
    const country = addressParts[addressParts.length - 2];

    return { city, country };
  };
  const filterHotelsByCity = (search: string) => {
    return hotels.filter((hotel) => {
      const { city, country } = getCityAndCountryFromAddress(
        hotel.hotel.address
      );
      const fullCityAndCountry = `${city}, ${country}`.toLowerCase();
      return fullCityAndCountry.includes(search.toLowerCase());
    });
  };

  return (
    <main className="w-full">
      <div className="bg-white p-3 w-[85vw] h-[80px] shadow-md rounded-[11px] shadow-[0px_0px_9px_0px_#00000017]">
        <div className="grid grid-cols-[auto_37px_auto_37px_auto_37px_auto_37px_auto] items-center w-full">
          <div className="flex flex-col relative">
            <div className="flex items-center gap-2">
              <img
                src="/icons/destino.svg"
                alt="Ícone de Saída"
                className="w-[16px] h-[16px]"
              />
              <label className="label-custom">Destino</label>
            </div>
            <input
              type="text"
              placeholder="Digite o destino"
              value={local}
              onChange={(e) => {
                setLocal(e.target.value);
                setShowSuggestions(e.target.value.length >= 3);
              }}
              className="input-custom w-[200px] xl:w-[400px]"
            />
            {showSuggestions && local.length >= 2 && (
              <div
                className="absolute bg-white border-gray-300 mt-1 w-full max-h-48 rounded-[15px] shadow-lg z-10 overflow-hidden"
                style={{ top: "calc(100% + 30px)" }}
              >
                {filterHotelsByCity(local).length > 0 ? (
                  filterHotelsByCity(local).map((hotel) => {
                    const { city, country } = getCityAndCountryFromAddress(
                      hotel.hotel.address
                    );
                    return (
                      <div
                        key={hotel.id}
                        className="p-3 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleClickOption(city, country)}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">
                            <img
                              src="/icons/destino.svg"
                              alt="Ícone de Saída"
                              className="w-[18px] h-[18px]"
                            />
                          </span>

                          <div className="flex flex-col">
                            <p className="text-sm font-semibold text-text">
                              {city}
                            </p>{" "}
                            <p className="text-sm text-caption">
                              {country}
                            </p>{" "}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : null }
                
              </div>
            )}
          </div>

          <div className="border border-[#E3E6E9] w-[50px] h-0 rotate-90"></div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <img
                src="/icons/entrada.svg"
                alt="Ícone de Saída"
                className="w-[16px] h-[16px]"
              />
              <label className="label-custom">Entrada</label>
            </div>
            <DatePicker
              selected={entrada}
              onChange={(date) => {
                setEntrada(date ?? undefined);
                if (date && saida && date > saida) {
                  setSaida(undefined);
                }
              }}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/MM/yyyy"
              className="input-custom"
              minDate={new Date()}
              selectsStart
              startDate={entrada ?? undefined}
              endDate={saida ?? undefined}
            />
          </div>

          <div className="border border-[#E3E6E9] w-[50px] h-0 rotate-90"></div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <img
                src="/icons/entrada.svg"
                alt="Ícone de Saída"
                className="w-[16px] h-[16px]"
              />
              <label className="label-custom">Saída</label>
            </div>
            <DatePicker
              selected={saida}
              onChange={(date) => setSaida(date ?? undefined)}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/MM/yyyy"
              className="input-custom w-[100px] xl:w-[300px]"
              minDate={entrada}
              selectsEnd
              startDate={entrada ?? undefined}
              endDate={saida ?? undefined}
            />
          </div>

          <div className="border border-[#E3E6E9] w-[50px] h-0 rotate-90"></div>

          <div className="flex flex-col relative w-[140px]">
            <div className="flex items-center gap-2">
              <img
                src="/icons/saida.svg"
                alt="Ícone de Saída"
                className="w-[16px] h-[16px]"
              />
              <label className="label-custom">Hóspedes</label>
            </div>
            <button
              onClick={() => {
                setOpenHospedes(!openHospedes);
                setTempAdultos(adultos);
                setTempCriancas(criancas);
              }}
              className="input-custom"
            >
              {adultos} Adulto{adultos > 1 ? "s" : ""}, {criancas} Criança
              {criancas > 1 ? "s" : ""}
            </button>
            {openHospedes && (
              <div
                className="absolute top-full mt-8 left-0 w-[177px] h-[200px] bg-white shadow-md rounded-[8px] flex flex-col justify-center p-3"
                style={{ boxShadow: "0px 0px 9px 0px #00000017" }}
              >
                <div className="absolute -top-1.5 left-2 w-2 h-2 bg-white rotate-45 shadow-md"></div>

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold leading-[26px] text-left font-[Poppins]">
                      Adultos
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <button
                        onClick={() =>
                          setTempAdultos((prev) => Math.max(1, prev - 1))
                        }
                        className="w-[15px] h-[15px] bg-[#E3EBF3] rounded-full flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <span className="text-[12px] font-semibold leading-[26px] text-left font-[Poppins]">
                        {tempAdultos}
                      </span>
                      <button
                        onClick={() => setTempAdultos((prev) => prev + 1)}
                        className="w-[15px] h-[15px] bg-[#E3EBF3] rounded-full flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="w-[155px] h-0 border-t border-[#E3EBF3] mx-auto"></div>

                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold leading-[26px] text-left font-[Poppins]">
                      Crianças
                    </span>
                    <div className="flex items-center justify-between mt-1">
                      <button
                        onClick={() =>
                          setTempCriancas((prev) => Math.max(0, prev - 1))
                        }
                        className="w-[15px] h-[15px] bg-[#E3EBF3] rounded-full flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <span className="text-[12px] font-semibold leading-[26px] text-left font-[Poppins]">
                        {tempCriancas}
                      </span>
                      <button
                        onClick={() => setTempCriancas((prev) => prev + 1)}
                        className="w-[15px] h-[15px] bg-[#E3EBF3] rounded-full flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="w-[155px] h-0 border-t border-[#E3EBF3] mx-auto"></div>

                  <button
                    onClick={handleApply}
                    className="w-[70px] h-[20px] border border-primary text-primary text-[10px] font-semibold leading-[26px] rounded-full flex items-center justify-center ml-auto bg-transparent"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col mr-[60px] ml-[-40px]">
            <button
              onClick={handleSearch}
              className="bg-primary w-[160px] h-[45px] mt-[3px] text-[14px] text-white px-4 py-2 rounded-[50px] hover:bg-blue-600 transition shadow-[0px_2px_9px_1px_#0080FF4A] border-l-2 border-gray-300"
            >
              Pesquisar
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HotelSearchBar;
