import { Link } from "react-router-dom";

function ApartmentCard({ apartment }) {
  const coverImage = apartment.images?.[0];

  return (
    <article className="apartment-card">
      <div className="apartment-card-media">
        {coverImage ? (
          <img src={coverImage} alt={apartment.title} className="apartment-cover-image" />
        ) : (
          <div className="apartment-cover-placeholder">
            <span>{apartment.city}</span>
          </div>
        )}
      </div>

      <div className="apartment-card-body">
        <div className="apartment-card-top">
          <p className="page-eyebrow">{apartment.city}</p>
          <span className="price-pill">{apartment.price} EUR / noche</span>
        </div>

        <h2>{apartment.title}</h2>
        <p className="apartment-card-text">{apartment.description}</p>

        <Link to={`/apartments/${apartment._id}`} className="site-cta site-cta-secondary">
          Ver detalle
        </Link>
      </div>
    </article>
  );
}

export default ApartmentCard;
