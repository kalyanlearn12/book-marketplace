import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const getBooks = async (type = '') => {
  try {
    const endpoint = '/books' + (type ? `?type=${type}` : '');
    const url = `${API_URL}${endpoint}`;
    console.log("Final URL:", url); 

    console.log({
      env: import.meta.env.VITE_API_BASE_URL,
      constructedUrl: url
    });

    const response = await axios.get(url);
    console.log("API Data:", response.data);
     
    // Ensure data is an array
     if (!Array.isArray(response.data)) {
      throw new Error("API did not return an array");
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

// Add debug function
export const testConnection = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('API Connection Successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Connection Failed:', error);
    throw error;
  }
};

export default {
  getBooks,
  testConnection
};