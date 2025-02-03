"use client";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

type ButtonProps = {
  label: string;
  icon?: string;
  onClick: () => void;
};

type TopBarProps = {
  logoSrc: string;
};

const TopBar = ({ logoSrc }: TopBarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isReservasPage = pathname === "/search" || /^\/hotel\/\d+$/.test(pathname);

  const getButtons = (): ButtonProps[] => {
    if (pathname === "/") {
      return [
        {
          label: "Iniciar Sessão",
          icon: "login.svg",
          onClick: () => alert("Aqui você logaria!"),
        },
      ];
    } else if (pathname === "/search" || /^\/hotel\/\d+$/.test(pathname)) {
      return [
        {
          label: "Página Inicial",
          icon: "telainicial.svg",
          onClick: () => router.push("/"),
        },
        {
          label: "Iniciar Sessão",
          icon: "login.svg",
          onClick: () => alert("Voltando..."),
        }
      ];
    }
    return [];
  };

  return (
    <div
      className={`w-full ${
        isReservasPage ? "bg-white shadow-[0px_0px_9px_0px_#00000017]" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between p-4 w-[88%] mx-auto">
        <div
          className="font-sans poppins-bold text-[20px] leading-[26px] text-text text-right decoration-transparent cursor-pointer"
          onClick={() => router.push("/")}
        >
          infotravel
        </div>

        <div className="flex space-x-4">
          {getButtons().map((button, index) => (
            <button
              key={index}
              onClick={button.onClick}
              className="flex items-center gap-2 text-caption font-poppins text-[12px] font-medium leading-[26px] text-right hover:text-primary transition-colors"
              style={{ background: "none", border: "none", padding: 0 }}
            >
              {button.icon && (
                <Image
                  src={`/icons/${button.icon}`}
                  alt={button.label}
                  width={12}
                  height={12}
                />
              )}
              <span>{button.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
