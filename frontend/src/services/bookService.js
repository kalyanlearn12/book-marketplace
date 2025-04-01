import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || '/api/books';

const getBooks = async (type = '') => {
  try {
    const url = type ? `${API_URL}?type=${type}` : API_URL;
    const response = await axios.get(url);
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