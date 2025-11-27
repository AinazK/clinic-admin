import api from "../api";

export interface Filial {
  id: number;
  title: string;
  address: string;
}

export async function getFilials(): Promise<Filial[]> {
  const response = await api.get("/admin/filials");
  return response.data;
}

export async function updateFilial(
  filialId: number,
  data: { title: string; address: string }
): Promise<Filial> {
  const response = await api.put(`/admin/filials/${filialId}`, {
    title: data.title,
    address: data.address,
  });
  return response.data;
}
