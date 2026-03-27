import { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { getApartmentById } from "../../services/apartmentService";


function ApartmentDetailPage() {
    const { id } = useParams();

    const [apartment, setApartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchApartment = async () => {
            try {
                const data = await getApartmentById(id);
                setApartment(data);
            } catch (error) {
                console.error(error);
                setError("No se pudieron cargar los apartamentos");
            } finally {
                setLoading(false);
            }
        };

        fetchApartment();
    }, [id]);

    if (loading) {
        return <p>Cargando apartamento...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!apartment) {
        return <p>No se encontró el apartamento</p>;
    }


    return (
        <section>
            <h1>{apartment.title}</h1>
            <p><strong>Ciudad: </strong> {apartment.city}</p>
            <p><strong>Precio: </strong>{apartment.price} € / noche</p>

            <p> {apartment.description} </p>

            {/* Imágenes (si existen)*/}
            {apartment.images && apartment.images.length > 0 && (
                <div>
                    <h3>Imágenes</h3>
                    {apartment.images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={apartment.title}
                            width= "200"
                            />
                    ))}
                </div>
            )}
        </section>
    );
}

export default ApartmentDetailPage;