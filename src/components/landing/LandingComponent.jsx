import image from "../../assets/img/carousel1.png"
function LandingComponent() {
    return(

<div className="min-h-screen flex items-center justify-center bg-primary-200 p-0">
      <div className="w-screen h-screen flex md:shadow-none">
        <div className="flex-1 flex flex-col justify-center items-center md:flex-row md:w-1/2">
          <div className="p-8">
            <p className="text-gray-600">La plataforma de comercio ideal para los coleccionistas.</p>
            <h1 className="text-3xl font-semibold mb-4">Vende mas, compra los coleccionables que mas buscabas y participa en un mercado de objetos coleccionables.</h1>
            <p className="text-gray-600">Estamos emocionados por que seas parte de TroveTraders, haz click abajo para continuar.</p>
          </div>
        </div>
        <div className="flex-1 hidden md:flex justify-center items-center">
          <img src={image} alt="Landing Page Image" className="max-h-full md:max-w-full" />
        </div>
      </div>
    </div>
    )

}

export default LandingComponent;