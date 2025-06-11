import axios from 'axios';

const API_BASE_URL = 'https://medivize-backend.netlify.app/api'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json', 
  },
});

export const classifyDrugImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  for (let pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]); 
  }

  try {
    const response = await api.post('/drugs/classify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });

    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Image classification error:', error);
    if (error.response) {
      return { 
        success: false, 
        message: error.response.data.message || `Klasifikasi gambar gagal dengan status ${error.response.status}` 
      };
    } else if (error.request) {
      return { success: false, message: 'Tidak ada respons dari server. Periksa koneksi internet Anda.' };
    } else {
      return { success: false, message: `Kesalahan: ${error.message}` };
    }
  }
};

export const getDrugByName = async (drugName) => {
  try {
    console.log('Requesting drug:', drugName); 
    
    const encodedName = encodeURIComponent(drugName);
    const url = `/drugs/by-name/${encodedName}`;
    
    console.log('Request URL:', `${API_BASE_URL}${url}`);
    
    const response = await api.get(url);

    console.log('Response status:', response.status); 
    console.log('Response data:', response.data); 

    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Get drug by name error:', error);
    if (error.response) {
      return { 
        success: false, 
        message: error.response.data.message || `Obat "${drugName}" tidak ditemukan` 
      };
    } else if (error.request) {
      return { 
        success: false, 
        message: 'Network error atau server tidak tersedia. Pastikan server backend berjalan.' 
      };
    } else {
      return { 
        success: false, 
        message: `Kesalahan: ${error.message}` 
      };
    }
  }
};

export const searchDrugs = async (query) => {
  try {
    const response = await api.get(`/drugs/search?q=${encodeURIComponent(query)}`);
    
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Drug search error:', error);
    if (error.response) {
      return { success: false, message: error.response.data.message || 'Drug search failed' };
    } else if (error.request) {
      return { success: false, message: 'Network error atau server tidak tersedia' };
    } else {
      return { success: false, message: `Kesalahan: ${error.message}` };
    }
  }
};

export const getAllDrugs = async () => {
  try {
    const response = await api.get('/drugs');
    
    return { success: true, data: response.data.data };
  } catch (error) {
    console.error('Get all drugs error:', error);
    if (error.response) {
      return { success: false, message: error.response.data.message || 'Failed to fetch drugs' };
    } else if (error.request) {
      return { success: false, message: 'Network error atau server tidak tersedia' };
    } else {
      return { success: false, message: `Kesalahan: ${error.message}` };
    }
  }
};


export const testConnection = async () => {
  try {
    const response = await api.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Connection test failed:', error);
    if (error.response) {
      return { success: false, error: error.response.data.message || `Status: ${error.response.status}` };
    } else if (error.request) {
      return { success: false, error: 'Tidak ada respons dari server.' };
    } else {
      return { success: false, error: error.message };
    }
  }
};

export const debugDrugSearch = async (drugName) => {
  console.log('=== DEBUG DRUG SEARCH ===');
  console.log('Searching for:', drugName);
  
  
  const connectionTest = await testConnection();
  console.log('Connection test:', connectionTest);
  
  
  const searchResult = await searchDrugs(drugName);
  console.log('Search result:', searchResult);
  
  
  const directResult = await getDrugByName(drugName);
  console.log('Direct fetch result:', directResult);
  
  return {
    connection: connectionTest,
    search: searchResult,
    direct: directResult
  };
};
