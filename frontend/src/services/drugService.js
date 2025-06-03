// MEDIVIZE/frontend/src/services/drugService.js
const API_BASE_URL = 'http://localhost:8080/api'; 

export const classifyDrugImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const response = await fetch(`${API_BASE_URL}/drugs/classify`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.message || 'Image classification failed' };
    }
  } catch (error) {
    console.error('Image classification error:', error);
    return { success: false, message: 'Network error atau server tidak tersedia' };
  }
};

export const getDrugByName = async (drugName) => {
  try {
    console.log('Requesting drug:', drugName); // Debug log
    
    const encodedName = encodeURIComponent(drugName);
    const url = `${API_BASE_URL}/drugs/by-name/${encodedName}`;
    
    console.log('Request URL:', url); // Debug log
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Response status:', response.status); // Debug log
    
    const data = await response.json();
    console.log('Response data:', data); // Debug log

    if (response.ok) {
      return { success: true, data: data.data };
    } else {
      return { 
        success: false, 
        message: data.message || `Obat "${drugName}" tidak ditemukan` 
      };
    }
  } catch (error) {
    console.error('Get drug by name error:', error);
    return { 
      success: false, 
      message: 'Network error atau server tidak tersedia. Pastikan server backend berjalan.' 
    };
  }
};

export const searchDrugs = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/drugs/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();

    if (response.ok) {
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.message || 'Drug search failed' };
    }
  } catch (error) {
    console.error('Drug search error:', error);
    return { success: false, message: 'Network error atau server tidak tersedia' };
  }
};

export const getAllDrugs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/drugs`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();

    if (response.ok) {
      return { success: true, data: data.data };
    } else {
      return { success: false, message: data.message || 'Failed to fetch drugs' };
    }
  } catch (error) {
    console.error('Get all drugs error:', error);
    return { success: false, message: 'Network error atau server tidak tersedia' };
  }
};

// Additional utility functions for debugging
export const testConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    console.error('Connection test failed:', error);
    return { success: false, error: error.message };
  }
};

export const debugDrugSearch = async (drugName) => {
  console.log('=== DEBUG DRUG SEARCH ===');
  console.log('Searching for:', drugName);
  
  // Test connection
  const connectionTest = await testConnection();
  console.log('Connection test:', connectionTest);
  
  // Test search
  const searchResult = await searchDrugs(drugName);
  console.log('Search result:', searchResult);
  
  // Test direct fetch
  const directResult = await getDrugByName(drugName);
  console.log('Direct fetch result:', directResult);
  
  return {
    connection: connectionTest,
    search: searchResult,
    direct: directResult
  };
};