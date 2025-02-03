"use client";

const FooterBar = () => {
  return (
    <footer className="w-full h-[66px] bg-white shadow-md flex items-center justify-center text-black text-[13px] font-normal font-poppins">
      © {new Date().getFullYear()} | Todos os direitos reservados
    </footer>
  );
};

export default FooterBar;
