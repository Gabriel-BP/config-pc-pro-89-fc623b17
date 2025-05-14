import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const getComponents = async (category: string, filters?: any) => {
  try {
    const params = filters ? { ...filters } : {};
    console.log(`Fetching components for category ${category} with filters:`, params);
    const response = await api.get(`/components/${category}`, { params });
    
    // Debug the API response
    console.log(`API response for ${category}:`, response.data);
    
    // Check if the response has a nested 'data' property (pagination structure)
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // If it's already an array, return it directly
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    // Otherwise return an empty array to avoid errors
    console.error(`Unexpected response format for ${category}:`, response.data);
    return [];
  } catch (error) {
    console.error(`Error fetching ${category} components:`, error);
    return [];
  }
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
