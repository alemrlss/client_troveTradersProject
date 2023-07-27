import banner from "../../assets/img/213ab356-cdae-4299-9c4f-12728ea785fd.jpg";

function BannerArea() {
  return (
    <section className="w-full animate-fade animate-once animate-duration-1000 animate-delay-0 animate-ease-in-out relative">
      <img src={banner} alt="Banner" className="w-full h-auto" />
      <div className="flex flex-col">
        <p className="absolute w-2/6 top-8 left-6 md:top-8 md:left-8 md:w-2/6 md:text-9xl xl:text-6xl xl:top-24 xl:left-12 xl:w-2/6 text-black font-bold sm:text-lg md:text- lg:text-2xl animate-fade-down animate-once animate-duration-500 animate-delay-0 animate-ease-linear">
          Realiza tus compras y ventas de manera segura
        </p>
        <button className=" xl:mb-12 absolute xl:text-4xl xl:mt-8  bottom-12 text-xs left-4 md:bottom-52 md:left-8 xl:bottom-36 xl:left-12 px-6 py-3 rounded-md text-white font-bold bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition-all duration-300 animate-fade-up animate-once animate-duration-500 animate-delay-0 animate-ease-linear">
          Mas informacion..
        </button>
      </div>
    </section>
  );
}

export default BannerArea;
