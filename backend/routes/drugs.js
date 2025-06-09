const express = require('express');
const router = express.Router();
const db = require('../db');

const formatDrugData = (drugRow) => {
  return {
    name: drugRow.Name || '',
    size: drugRow.Size || '',
    type: drugRow.Type || '',
    purpose: drugRow.Kegunaan || '',
    dosage: drugRow.Dosis || '',
    howToUse: drugRow['Cara Penggunaan'] || '',
    sideEffects: drugRow['Efek Samping'] ? drugRow['Efek Samping'].split(',').map(effect => effect.trim()) : [],
    warnings: drugRow['Peringatan Penting'] || ''
  };
};

router.get('/drugs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM drugs WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Obat tidak ditemukan' 
      });
    }
    
    const formattedDrug = formatDrugData(rows[0]);
    res.json({
      success: true,
      data: formattedDrug
    });
  } catch (err) {
    console.error('Error fetching drug by ID:', err);
    res.status(500).json({ 
      success: false,
      message: 'Gagal mengambil data obat', 
      error: err.message 
    });
  }
});

router.get('/drugs/by-name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);
    
    console.log('Searching for drug:', decodedName); // Debug log
    
    const [rows] = await db.execute(
      'SELECT * FROM drugs WHERE Name = ? OR Name LIKE ? LIMIT 1',
      [decodedName, `%${decodedName}%`]
    );
    
    if (rows.length === 0) {
      console.log('No drug found for:', decodedName); // Debug log
      return res.status(404).json({
        success: false,
        message: `Obat dengan nama '${decodedName}' tidak ditemukan dalam database.`
      });
    }
    
    const formattedDrug = formatDrugData(rows[0]);
    console.log('Found drug:', formattedDrug.name); // Debug log
    
    res.json({
      success: true,
      data: formattedDrug
    });
  } catch (error) {
    console.error('Error fetching drug by name:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail obat',
      error: error.message
    });
  }
});

router.get('/drugs/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query pencarian tidak boleh kosong'
      });
    }
    
    const searchTerm = `%${q.trim()}%`;
    const [rows] = await db.execute(
      'SELECT * FROM drugs WHERE Name LIKE ? OR Type LIKE ? OR Kegunaan LIKE ? ORDER BY Name ASC',
      [searchTerm, searchTerm, searchTerm]
    );
    
    const formattedDrugs = rows.map(formatDrugData);
    
    res.json({
      success: true,
      data: formattedDrugs,
      count: formattedDrugs.length,
      query: q
    });
  } catch (error) {
    console.error('Error searching drugs:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mencari obat',
      error: error.message
    });
  }
});

router.get('/drugs', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM drugs ORDER BY Name ASC');
    
    const formattedDrugs = rows.map(formatDrugData);
    
    res.json({
      success: true,
      data: formattedDrugs,
      count: formattedDrugs.length
    });
  } catch (error) {
    console.error('Error fetching drugs:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data obat',
      error: error.message
    });
  }
});

module.exports = router;