import { useState } from "react";
import { getIdUser } from "../../services/Auth";
import { AiOutlineQuestionCircle } from "react-icons/ai"; // Agrega el icono de pregunta
import { FaAngleDown } from "react-icons/fa";
function CreatePost() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 4) {
      setError("Se permiten un máximo de 4 imágenes");
    } else {
      setFiles(selectedFiles);
      setError("");

      // Mostrar los nombres de los archivos seleccionados
      const fileNames = Array.from(selectedFiles).map((file) => file.name);
      const fileNamesString = fileNames.join(", ");
      const fileNamesElement = document.querySelector(".file-names");
      fileNamesElement.textContent = `Archivos seleccionados: ${fileNamesString}`;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (files.length > 4) {
      setError("Se permiten un máximo de 4 imágenes");
      return;
    }

    // Crear un objeto FormData para enviar los datos y archivos
    const formData = new FormData();
    formData.append("category", category);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("author_id", getIdUser());

    // Agregar los archivos al FormData
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      // Enviar la solicitud al backend
      const response = await fetch("http://localhost:3001/posts", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // La creación del post fue exitosa
        console.log("Post creado exitosamente");
        // Restablecer los campos del formulario
        setTitle("");
        setDescription("");
        setPrice("");
        setFiles([]);
        setSuccessMessage("Publicación creada correctamente");
      } else {
        // Hubo un error al crear el post
        console.error("Error al crear el post");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
    // Resto del código de manejo del formulario
  };
  const [expandedStep, setExpandedStep] = useState(null);

  const toggleStep = (stepIndex) => {
    setExpandedStep(expandedStep === stepIndex ? null : stepIndex);
  };

  const steps = [
    {
      title: "¿Cómo publico un producto?",
      details:
        "Para publicar un producto, sigue estos pasos: Completa el formulario con los detalles del producto. Carga hasta 4 imágenes de alta calidad del producto. Haz clic en 'Publicar Producto' para completar la publicación.",
    },
    {
      title: "¿Puedo editar mi publicación después de crearla?",
      details:
        "Sí, puedes editar tu publicación después de crearla. Inicia sesión en tu cuenta, ve a 'Mis Publicaciones' y selecciona la publicación que deseas editar. Luego, haz clic en 'Editar' para realizar los cambios necesarios.",
    },
    {
      title: "¿Cuánto tiempo estará mi publicación en línea?",
      details:
        "Tu publicación estará en línea durante 30 días a partir de la fecha de creación. Después de ese período, podrás optar por volver a publicarla si aún está disponible.",
    },
    {
      title: "¿Cómo puedo eliminar mi publicación?",
      details:
        "Puedes eliminar tu publicación en cualquier momento. Inicia sesión en tu cuenta, ve a 'Mis Publicaciones', selecciona la publicación que deseas eliminar y haz clic en 'Eliminar'. Ten en cuenta que esta acción es irreversible.",
    },
  ];

  return (
    <div className="mx-10 mt-8 flex">
      <div className="flex-1 bg-white p-6 rounded-lg  mr-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-800 font-semibold"
            >
              Título:
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary-200"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Escribe el título de tu producto"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-800 font-semibold"
            >
              Descripción:
            </label>
            <textarea
              id="description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary-200"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Escribe una descripción detallada de tu producto"
              rows="3"
              required
              style={{ resize: "none" }} // Agregar esta línea
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-gray-800 font-semibold"
            >
              Categoría:
            </label>
            <select
              id="category"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary-200"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="antiguedades">Antiguedades</option>
              <option value="musica">Música</option>
              <option value="cartas">Cartas</option>
              <option value="tecnología">Tecnología</option>
              <option value="comics">Comics</option>
              <option value="juguetes">Juguetes</option>
              <option value="deporte">Deporte</option>
              <option value="libros">Libros</option>
              <option value="otros">Otros</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-800 font-semibold"
            >
              Precio:
            </label>
            <input
              type="number"
              id="price"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-secondary-200"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Escribe el precio en números"
              required
            />
          </div>

          <div className="mb-4 border border-gray-300 p-2 rounded-lg">
            <label
              htmlFor="images"
              className="block text-gray-800 font-semibold mb-2"
            >
              Imágenes:
              <p className="text-xs text-gray-400 font-normal">
                Solo se permite un maximo de 4 imagenes
              </p>
            </label>
            <label className="custom-file-upload bg-gray-900 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded cursor-pointer">
              Elegir imagenes
              <input
                type="file"
                id="images"
                multiple
                onChange={handleFileChange}
                required
                className="hidden" // Oculta el input nativo
              />
            </label>
            <div className="file-names text-xs mt-2"></div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-secondary-100 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-lg"
            >
              Publicar Producto
            </button>
          </div>

          {successMessage && (
            <div className="mt-4 text-green-600 font-semibold">
              {successMessage}
            </div>
          )}
        </form>{" "}
      </div>

      <div className="flex-1 bg-white p-6 rounded-lg border-l">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Consejos para crear una buena publicación
        </h2>
        <ul className="pl-6 border-secondary-100 border-b pb-5">
          <li className="mb-2 italic">
            <AiOutlineQuestionCircle className="inline-block text-secondary-200 mr-2" />
            Agrega imágenes de alta calidad de tu objeto.
          </li>
          <li className="mb-2 italic">
            <AiOutlineQuestionCircle className="inline-block text-secondary-200 mr-2" />
            Proporciona una descripción detallada y precisa.
          </li>
          <li className="mb-2 italic">
            <AiOutlineQuestionCircle className="inline-block text-secondary-200 mr-2" />
            Especifica el precio de manera clara.
          </li>
          <li className="mb-2 italic">
            <AiOutlineQuestionCircle className="inline-block text-secondary-200 mr-2" />
            Selecciona la categoría adecuada para tu objeto.
          </li>
        </ul>

        <h2 className="text-2xl my-3">Preguntas frecuentes</h2>
        <div className="flex flex-col space-y-2">
          {steps.map((step, index) => (
            <div
              key={index}
              onClick={() => toggleStep(index)}
              className={`p-2 rounded cursor-pointer ${
                expandedStep === index ? "bg-gray-100" : "bg-white"
              }`}
            >
              <div className="flex items-center">
                <div className="w-6 h-6 flex items-center justify-center rounded-full  text-secondary-100 font-bold text-2xl mr-2">
                  <FaAngleDown />
                </div>
                <div>{step.title}</div>
              </div>
              {expandedStep === index && (
                <div className="text-gray-500 mt-2 animate-flip-down animate-duration-300 animate-delay-0">
                  {step.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
