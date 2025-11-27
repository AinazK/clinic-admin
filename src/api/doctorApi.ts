import api from "../api";

export interface DoctorDocument {
  id: number;
  file_url: string;
  description: string;
}

export interface Doctor {
  id: number;
  fio: string;
  photo: string;
  experience: number;
  is_active: boolean;
  filials: { id: number; title: string; address: string }[];
  specialties: { id: number; title: string; correct_title: string }[];
  documents: DoctorDocument[];
  schedule: {
    date: string;
    filial: string;
    filial_id: number;
    day_id: number;
    time: Record<string, string>;
  }[];
}

export async function getDoctors(): Promise<Doctor[]> {
  const response = await api.get("/admin/doctors/");
  return response.data;
}

export async function getDoctorById(doctorId: number): Promise<Doctor> {
  const response = await api.get(`/admin/doctors/${doctorId}`);
  return response.data;
}

export async function updateDoctor(
  doctorId: number,
  data: {
    fio: string;
    photo?: string | null;
    experience: number;
    is_active: boolean;
    filial_ids: number[];
    specialty_ids: number[];
    documents?: DoctorDocument[];
  }
): Promise<Doctor> {
  const cleanData = {
    fio: data.fio,
    photo: data.photo ?? "",
    experience: data.experience,
    is_active: data.is_active,
    filial_ids: data.filial_ids,
    specialty_ids: data.specialty_ids,
    documents: data.documents ?? [],
  };

  const response = await api.put(`/admin/doctors/${doctorId}`, cleanData);
  return response.data;
}
