import api from "../api";

export interface Specialty {
  id: number;
  title: string;
  correct_title: string;
}

export async function getSpecialties(): Promise<Specialty[]> {
  const response = await api.get("/admin/specialties");
  return response.data;
}

export async function updateSpecialty(
  specialtyId: number,
  data: { title: string; correct_title: string }
): Promise<Specialty> {
  const response = await api.put(`/admin/specialties/${specialtyId}`, {
    title: data.title,
    correct_title: data.correct_title,
  });
  return response.data;
}
