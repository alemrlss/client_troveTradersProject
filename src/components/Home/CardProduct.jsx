/* eslint-disable react/prop-types */
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

function CardProduct({ post }) {
  return (
    <div className="bg-white rounded-lg shadow-xl border border-secondary-100 overflow-hidden">
      <div className="relative aspect-w-2 aspect-h-1">
        <div className="absolute inset-0">
          {post.photos.map((photo, index) => (
            <img
              key={index}
              src={`http://localhost:3001/images/posts/${photo}`}
              alt={`Foto ${index + 1}`}
              className={`object-cover w-full h-full ${
                index === 0 ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        <div className="absolute inset-0 flex items-end justify-end">
          <Link
            to={`/post/${post._id}`}
            className="bg-secondary-100 flex items-center text-white font-semibold py-2 px-4 rounded-md shadow-lg shadow-gray-500 my-4 mx-1 transition-transform hover:scale-105"
          >
            Ver más <FaArrowRight className="ml-1 h-3 w-4" />
          </Link>
        </div>
      </div>
      <div className="p-4">
        <p className="text-gray-400 text-right text-xs mb-2">
          Creado: {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <h3 className="text-lg font-semibold text-gray-900">
          {post.title.slice(0, 35)}
          {post.title.length > 35 && "..."}
        </h3>
        <p className="text-gray-600 mt-1 leading-5 text-xs">
          {post.description.slice(0, 65)}
          {post.description.length > 65 && "..."}
        </p>
        <p className="text-gray-900 font-bold mt-2 text-right">
          Precio: {post.price}$
        </p>
      </div>
    </div>
  );
}

export default CardProduct;
