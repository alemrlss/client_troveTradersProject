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
  const [errorFile, setErrorFile] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 4) {
      setErrorFile("Se permiten un máximo de 4 imágenes");
    } else if (selectedFiles.length < 2) {
      setErrorFile("Se requiere al menos dos imagenes");
    } else {
      setFiles(selectedFiles);
      setErrorFile("");

      // Mostrar los nombres de los archivos seleccionados
      const fileNames = Array.from(selectedFiles).map((file) => file.name);
      const fileNamesString = fileNames.join(", ");
      const fileNamesElement = document.querySelector(".file-names");
      fileNamesElement.textContent = `Archivos seleccionados: ${fileNamesString}`;
    }
  };

  const handleSubmit = async (event) => {
    setError("");
    setErrorFile("");
    setSuccessMessage("");
    event.preventDefault();

    if (files.length === 0) {
      setErrorFile("Debes seleccionar al menos una imagen");
      return;
    }

    if (files.length > 4) {
      setErrorFile("Se permiten un máximo de 4 imágenes");
      return;
    }

    if (files.length < 2) {
      setErrorFile("Se requieren al menos dos imágenes");
      return;
    }
    if (!category || category === "index") {
      setError("Selecciona una categoría válida");
      return;
    }

    if (!title || title.length < 15 || title.length > 40) {
      setError("El título debe tener entre 15 y 40 caracteres");
      return;
    }

    if (!description || description.length < 15 || description.length > 100) {
      setError("La descripción debe tener entre 15 y 100 caracteres");
      return;
    }

    if (isNaN(price) || parseFloat(price) < 0) {
      setError("El precio debe ser un número no negativo");
      return;
    }

    if (files.length > 4) {
      setError("Se permiten un máximo de 4 imágenes");
      return;
    }

    if (files.length < 2) {
      setError("Se permiten un mínimo de 2 imágenes");
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
        setTitle("");
        setDescription("");
        setPrice("");
        setCategory(""); // Reiniciar el campo de selección de categoría
        setFiles([]);
        setSuccessMessage("Publicación creada correctamente");
        const fileNamesElement = document.querySelector(".file-names");
        fileNamesElement.textContent = ``;
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
      title:
        "¿Cómo puedo obtener más información sobre las políticas de seguridad y privacidad del sitio?      ",
      details:
        "Puedes encontrar información detallada sobre nuestras políticas de seguridad y privacidad en la sección 'Políticas' o 'Términos y Condiciones'` de nuestro sitio web",
    },
    {
      title: "¿Cómo puedo eliminar mi publicación?",
      details:
        "Puedes eliminar tu publicación en cualquier momento. Inicia sesión en tu cuenta, ve a 'Mis Publicaciones', selecciona la publicación que deseas eliminar y haz clic en 'Eliminar'. Ten en cuenta que esta acción es irreversible.",
    },
  ];

  return (
    <div className="mx-2 md:mx-4 lg:mx-10 py-8 md:py-16 flex flex-col md:flex-row">
      <div className="mb-4 md:w-1/2 lg:w-1/2 xl:w-1/2 md:mr-4">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg">
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
                style={{ resize: "none" }}
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
                onChange={(event) => {
                  console.log(event.target.value);
                  setCategory(event.target.value);
                }}
                required
              >
                <option value="index">Selecciona una categoría</option>
                <option value="antiguedades">Antiguedades</option>
                <option value="musica">Música</option>
                <option value="cartas">Cartas</option>
                <option value="tecnologia">Tecnología</option>
                <option value="comics">Comics</option>
                <option value="juguetes">Juguetes</option>
                <option value="deportes">Deportes</option>
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

            <p className="block text-gray-800 font-semibold"> Imágenes:</p>
            <div className="mb-4 border border-gray-300 p-2 rounded-lg">
              <label
                htmlFor="images"
                className="block text-gray-800 font-semibold mb-2"
              >
                <p className="text-xs text-gray-400 font-normal">
                  Solo se permite un maximo de 4 imagenes
                </p>
              </label>
              <label className="custom-file-upload flex justify-center bg-gray-200  text-gray-500 font-semibold px-4 py-2 rounded-md cursor-pointer">
                <p className="text-center">Elegir imagenes</p>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  onChange={handleFileChange}
                  required
                  className="hidden"
                />
              </label>
              <div className="file-names text-xs mt-2"></div>
              {errorFile && <p className="text-red-500 mt-2">{errorFile}</p>}
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}
            <div className="text-right">
              <button
                type="submit"
                className="bg-secondary-100 hover:opacity-90 text-white font-bold px-6 py-3 rounded-lg"
              >
                Publicar Producto
              </button>
            </div>

            {successMessage && (
              <div className="mt-4 text-green-600 font-semibold">
                {successMessage}
              </div>
            )}
            {/* Resto del formulario... */}
          </form>
        </div>
      </div>

      <div className="md:w-1/2 lg:w-2/3 xl:w-3/4 mt-4 md:mt-0">
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-4">
          Consejos para crear una buena publicación
        </h2>
        <ul className="pl-4 md:pl-6 border-b pb-4">
          <li className="mb-2 italic">
            <AiOutlineQuestionCircle className="inline-block text-secondary-200 mr-2" />
            Agrega imágenes de alta calidad.
          </li>
          <li className="mb-2 italic">
            <AiOutlineQuestionCircle className="inline-block text-secondary-200 mr-2" />
            Proporciona una descripción detallada y precisa.
          </li>
          {/* Resto de los consejos... */}
        </ul>
        <h2 className="text-xl my-3 mt-4">Preguntas frecuentes</h2>
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
                <div className="w-6 h-6 flex items-center justify-center rounded-full text-secondary-100 font-bold text-xl mr-2">
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
