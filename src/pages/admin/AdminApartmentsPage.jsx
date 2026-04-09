import { useEffect, useState } from "react";

import { createApartment, deleteApartment, getApartments, updateApartment } from "../../services";

const initialForm = {
  title: "",
  description: "",
  city: "",
  price: "",
  images: [],
};

const toFormState = (apartment) => ({
  title: apartment.title ?? "",
  description: apartment.description ?? "",
  city: apartment.city ?? "",
  price: apartment.price ?? "",
  images: apartment.images ?? [],
});

function AdminApartmentsPage() {
  const [apartments, setApartments] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadApartments = async () => {
    try {
      setLoading(true);
      const data = await getApartments();
      setApartments(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los apartamentos del panel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApartments();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleEdit = (apartment) => {
    setEditingId(apartment._id);
    setForm(toFormState(apartment));
    setError("");
    setMessage("Editando apartamento seleccionado.");
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) {
      return;
    }

    try {
      const imagePromises = files.map(
        (file) =>
          new Promise((resolve, reject) => {
            if (!file.type.startsWith("image/")) {
              reject(new Error("Solo se permiten archivos de imagen."));
              return;
            }

            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("No se pudo leer una de las imagenes."));
            reader.readAsDataURL(file);
          })
      );

      const uploadedImages = await Promise.all(imagePromises);

      setForm((currentForm) => ({
        ...currentForm,
        images: [...currentForm.images, ...uploadedImages],
      }));
      setError("");
      setMessage("Imagenes adjuntadas correctamente.");
    } catch (uploadError) {
      console.error(uploadError);
      setError(uploadError.message || "No se pudieron adjuntar las imagenes.");
      setMessage("");
    } finally {
      event.target.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setForm((currentForm) => ({
      ...currentForm,
      images: currentForm.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleCancelEdit = () => {
    resetForm();
    setMessage("Edicion cancelada.");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.city.trim() ||
      !String(form.price).trim()
    ) {
      setError("Completa titulo, descripcion, ciudad y precio.");
      return;
    }

    const numericPrice = Number(form.price);

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      setError("El precio debe ser un numero mayor que 0.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      city: form.city.trim(),
      price: numericPrice,
      images: form.images,
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateApartment(editingId, payload);
        setMessage("Apartamento actualizado correctamente.");
      } else {
        await createApartment(payload);
        setMessage("Apartamento creado correctamente.");
      }

      resetForm();
      await loadApartments();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "No se pudo guardar el apartamento.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (apartmentId) => {
    const confirmed = window.confirm(
      "Se eliminara el apartamento seleccionado. ¿Quieres continuar?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(apartmentId);
      setError("");
      setMessage("");
      await deleteApartment(apartmentId);

      if (editingId === apartmentId) {
        resetForm();
      }

      setApartments((currentApartments) =>
        currentApartments.filter((apartment) => apartment._id !== apartmentId)
      );
      setMessage("Apartamento eliminado correctamente.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "No se pudo eliminar el apartamento.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="admin-page">
      <div className="admin-page-header">
        <p className="admin-eyebrow">Modulo</p>
        <h2>Apartamentos</h2>
        <p>
          Gestion desde panel del catalogo de apartamentos con alta, edicion y
          borrado.
        </p>
      </div>

      <div className="admin-apartments-layout">
        <section className="admin-form-card">
          <div className="admin-form-header">
            <h3>{editingId ? "Editar apartamento" : "Nuevo apartamento"}</h3>
            <p>
              Adjunta imagenes desde tu equipo. Se guardaran en la base de datos
              junto con el apartamento.
            </p>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <label className="admin-field">
              <span>Titulo</span>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Apartamento con terraza"
              />
            </label>

            <label className="admin-field">
              <span>Ciudad</span>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Malaga"
              />
            </label>

            <label className="admin-field">
              <span>Precio por noche</span>
              <input
                type="number"
                name="price"
                min="1"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="120"
              />
            </label>

            <label className="admin-field">
              <span>Descripcion</span>
              <textarea
                name="description"
                rows="5"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe el apartamento y sus puntos fuertes."
              />
            </label>

            <label className="admin-field">
              <span>Imagenes</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </label>

            {form.images.length > 0 && (
              <div className="admin-image-grid">
                {form.images.map((image, index) => (
                  <article key={`${index}-${image.slice(0, 20)}`} className="admin-image-item">
                    <img src={image} alt={`Imagen ${index + 1}`} className="admin-image-preview" />
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() => handleRemoveImage(index)}
                    >
                      Quitar imagen
                    </button>
                  </article>
                ))}
              </div>
            )}

            {(error || message) && (
              <div className={error ? "admin-feedback admin-error" : "admin-feedback admin-success"}>
                {error || message}
              </div>
            )}

            <div className="admin-form-actions">
              <button type="submit" className="admin-primary-button" disabled={saving}>
                {saving
                  ? "Guardando..."
                  : editingId
                    ? "Guardar cambios"
                    : "Crear apartamento"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={handleCancelEdit}
                >
                  Cancelar edicion
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-list-card">
          <div className="admin-form-header">
            <h3>Catalogo actual</h3>
            <p>
              {loading
                ? "Cargando apartamentos..."
                : `${apartments.length} apartamentos en el panel.`}
            </p>
          </div>

          {loading ? (
            <p>Cargando apartamentos...</p>
          ) : apartments.length === 0 ? (
            <p>No hay apartamentos creados todavia.</p>
          ) : (
            <div className="admin-apartment-list">
              {apartments.map((apartment) => (
                <article key={apartment._id} className="admin-apartment-item">
                  <div className="admin-apartment-summary">
                    <h3>{apartment.title}</h3>
                    <p>{apartment.city}</p>
                    <p>{apartment.price} EUR por noche</p>
                    <p>{apartment.description}</p>
                  </div>

                  <div className="admin-apartment-actions">
                    <button
                      type="button"
                      className="admin-secondary-button"
                      onClick={() => handleEdit(apartment)}
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="admin-danger-button"
                      disabled={deletingId === apartment._id}
                      onClick={() => handleDelete(apartment._id)}
                    >
                      {deletingId === apartment._id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default AdminApartmentsPage;
