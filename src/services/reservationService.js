import api from "./api";

export const getReservations = async () => {
  const response = await api.get("/reservations");
  return response.data;
};

export const getReservationById = async (id) => {
  const response = await api.get(`/reservations/${id}`);
  return response.data;
};

export const createReservation = async (data) => {
  const response = await api.post("/reservations", data);
  return response.data;
};

export const deleteReservation = async (id) => {
  const response = await api.delete(`/reservations/${id}`);
  return response.data;
};