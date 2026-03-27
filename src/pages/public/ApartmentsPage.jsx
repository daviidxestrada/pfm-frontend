import { useEffect, useState } from "react";
import { getApartments } from "../../services/apartmentService";

function ApartmentsPage() {
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const data = await getApartments();
        setApartments(data);
      } catch (error) {
        console.error("Error al cargar apartamentos", error);
      }
    };

    fetchApartments();
  }, []);

  return (
    <div>
      <h1>Listado de apartamentos</h1>

      {apartments.length === 0 ? (
        <p>No hay apartamentos</p>
      ) : (
        apartments.map((apt) => (
          <div key={apt._id}>
            <h3>{apt.title}</h3>
            <p>{apt.city}</p>
            <p>{apt.price}€</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ApartmentsPage;