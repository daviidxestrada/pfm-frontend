import { Link } from "react-router-dom";

function ApartmentCard({ apartment }) {
  return (
    <article>
      <h2>{apartment.title}</h2>
      <p>{apartment.city}</p>
      <p>{apartment.price} € / noche</p>

      <Link to={`/apartments/${apartment._id}`}>
        Ver detalle
      </Link>
    </article>
  );
}

export default ApartmentCard;