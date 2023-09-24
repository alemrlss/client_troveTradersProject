import { useState } from "react";
import { getIdUser } from "../../services/Auth";

function CreatePost() {
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto" id="modal">
      <h2 className="text-2xl text-center font-bold">Crea un POST</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">Título:</label>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Descripción:</label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Precio:</label>
        <input
          type="number"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Archivos:</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="w-full"
        />
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Crear Post
      </button>
    </form>
  );
}

export default CreatePost;
