import { useState } from "react";
import { getIdUser } from "../../services/Auth";

function CreatePost() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 4) {
      setError("Se permiten un máximo de 4 imágenes");
    } else {
      setFiles(selectedFiles);
      setError("");
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
      } else {
        // Hubo un error al crear el post
        console.error("Error al crear el post");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
  <div className="space-y-12 mx-20 my-20">
    <form onSubmit={handleSubmit} className="border-b border-gray-900/10 pb-12">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Vende tu producto.</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">Toda esta informacion sera publica en el sitio, asegurate de compartir la informacion correcta.</p>
      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label className="block text-sm font-medium leading-6 text-gray-900">Título:</label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>  
            <p className="mt-3 text-sm leading-6 text-gray-600">El titulo de tu producto debe de contener la informacion mas importante.</p>
          </div>
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">Categoria:</label>
          <div className="mt-2">
            <select id="category" name="category" autoComplete="category-name" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              type="text"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              > 
              <option value="">Seleccione una categoría</option>
              <option value="antiguedades" className="capitalize" >Antiguedades</option>
              <option className="capitalize">musica</option>
              <option className="capitalize">cartas</option>
              <option className="capitalize">tecnologia</option>
              <option className="capitalize">comics</option>
              <option className="capitalize">juguetes</option>
              <option className="capitalize">deporte</option>
              <option className="capitalize">libros</option>
              <option className="capitalize">otros</option>
            </select>
          </div>
        </div>
        <div className="sm:col-span-4">
          <label className="block text-sm font-medium leading-6 text-gray-900">Descripción:</label>
          <div className="mt-2">
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-gray-600">Introduce una descripcion apropiada del producto. Una descripcion concreta y detallada permitira que tu producto tenga mayor probabilidad de ser comprado.</p>
        </div>
        <div className="sm:col-span-4">
          <label className="block text-sm font-medium leading-6 text-gray-900">Precio:</label>
          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium leading-6 text-gray-900">Archivos:</label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
              </svg>
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-100 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-100 focus-within:ring-offset-2 hover:text-primary-200">
                  <span>Seleccionar un Archivo</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">o desliza y suelta.</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">Se permiten un máximo de 4 imágenes</p>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary-100 hover:bg-primary-200 text-white px-4 py-2 rounded"
        >
          Vender producto
        </button>
      </div>
    </form>
  </div>
    
  );
}

export default CreatePost;
