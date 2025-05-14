import axios from "axios";
import { Component, ComponentCategory } from "@/types/components";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Use your server URL here
});

export async function getComponents(category: ComponentCategory, filters: Record<string, any> = {}): Promise<Component[]> {
  try {
    console.log(`Making API request to /components/${category} with filters:`, filters);
    
    // Format filter parameters for URL
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      // Handle arrays (for sliders)
      if (Array.isArray(value)) {
        // Check if min and max are the same, if so send as single value
        if (value.length === 2 && value[0] === value[1]) {
          params.append(key, value[0].toString());
        } else {
          // Otherwise send the array as a JSON string
          params.append(key, JSON.stringify(value));
        }
      } 
      // Handle boolean values
      else if (typeof value === 'boolean') {
        params.append(key, value.toString());
      }
      // Handle other values
      else if (value !== null && value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    const requestUrl = `/components/${category}${queryString ? `?${queryString}` : ''}`;
    
    console.log('Full request URL:', `${api.defaults.baseURL}${requestUrl}`);
    
    const response = await api.get<Component[]>(requestUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching components:", error);
    throw error;
  }
}

// Add other API functions as needed
