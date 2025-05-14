
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const getComponents = async (category: string, filters?: any) => {
  const params = filters ? { ...filters } : {};
  const response = await api.get(`/components/${category}`, { params });
  return response.data;
};

export const validateBuild = async (components: string[]) => {
  try {
    const response = await api.post('/validation/validate-build', { components });
    return response.data;
  } catch (error) {
    console.error("Error al validar la configuración:", error);
    throw error;
  }
};
