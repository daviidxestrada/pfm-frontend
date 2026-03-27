import { useEffect, useState } from "react";
import ApartmentCard from "../../components/apartments/ApartmentCard";
import { getApartments } from "../../services/apartmentService";

function ApartmentsPage() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const data = await getApartments();
        setApartments(data);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los apartamentos");
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  if (loading) {
    return <p>Cargando apartamentos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section>
      <h1>Listado de apartamentos</h1>

      {apartments.length === 0 ? (
        <p>No hay apartamentos</p>
      ) : (
        apartments.map((apartment) => (
          <ApartmentCard key={apartment._id} apartment={apartment} />
        ))
      )}
    </section>
  );
}

export default ApartmentsPage;