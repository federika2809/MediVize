// MEDIVIZE/backend/server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3010', 'http://localhost:8080'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'medivize',
  port: process.env.DB_PORT || '3306',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

pool.getConnection()
  .then(connection => {
    console.log('✓ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('✗ Database connection failed:', err.message);
  });

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'drug-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar (JPEG, JPG, PNG, WEBP) yang diizinkan'));
    }
  }
});

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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'MEDIVIZE Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Get all drugs
app.get('/api/drugs', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM drugs ORDER BY Name ASC');
    
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

// Get drug by name
app.get('/api/drugs/by-name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);
    
    const [rows] = await pool.execute(
  'SELECT * FROM drugs WHERE LOWER(Name) = LOWER(?) OR LOWER(Name) LIKE LOWER(?) LIMIT 1',
  [decodedName, `%${decodedName}%`]
);

    
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
  } catch (error) {
    console.error('Error fetching drug by name:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil detail obat',
      error: error.message
    });
  }
});

// Search drugs
app.get('/api/drugs/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Query pencarian tidak boleh kosong'
      });
    }
    
    const searchTerm = `%${q.trim()}%`;
    const [rows] = await pool.execute(
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

// Drug image classification
app.post('/api/drugs/classify', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Gambar tidak ditemukan'
      });
    }
    
    const imagePath = req.file.path;
    const imageUrl = `/uploads/${req.file.filename}`;

    await new Promise(resolve => setTimeout(resolve, 2000)); 
    
    const classificationResult = {
      drugName: "Tidak Dikenali",
      confidence: 0.0, 
      imageUrl: imageUrl,
      processedAt: new Date().toISOString()
    };
    
    if (classificationResult.drugName && classificationResult.drugName !== "Tidak Dikenali") {
      try {
        const [rows] = await pool.execute(
          'SELECT * FROM drugs WHERE Name LIKE ? LIMIT 1',
          [`%${classificationResult.drugName}%`]
        );
        
        if (rows.length > 0) {
          classificationResult.drugDetails = formatDrugData(rows[0]);
        }
      } catch (dbError) {
        console.error('Error searching drug in database:', dbError);
      }
    }
    
    res.json({
      success: true,
      data: classificationResult
    });
    
  } catch (error) {
    console.error('Error in image classification:', error);
    
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting uploaded file:', unlinkError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Gagal memproses gambar',
      error: error.message
    });
  }
});

// Add new drug
app.post('/api/drugs', async (req, res) => {
  try {
    const { name, size, type, purpose, dosage, howToUse, sideEffects, warnings } = req.body;
    
    if (!name || !purpose || !dosage) {
      return res.status(400).json({
        success: false,
        message: 'Nama, kegunaan, dan dosis obat wajib diisi'
      });
    }
    
    const [existingRows] = await pool.execute('SELECT Name FROM drugs WHERE Name = ?', [name]);
    if (existingRows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Obat dengan nama tersebut sudah ada'
      });
    }
    
    const sideEffectsStr = Array.isArray(sideEffects) ? sideEffects.join(', ') : sideEffects || '';
    
    await pool.execute(
      'INSERT INTO drugs (Name, Size, Type, Kegunaan, Dosis, `Cara Penggunaan`, `Efek Samping`, Peringatan Penting) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, size || '', type || '', purpose, dosage, howToUse || '', sideEffectsStr, warnings || '']
    );
    
    res.status(201).json({
      success: true,
      message: 'Obat berhasil ditambahkan',
      data: {
        name: name
      }
    });
  } catch (error) {
    console.error('Error adding drug:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan obat',
      error: error.message
    });
  }
});

// Update drug by name
app.put('/api/drugs/by-name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);
    const { newName, size, type, purpose, dosage, howToUse, sideEffects, warnings } = req.body;
    
    const [existingRows] = await pool.execute('SELECT Name FROM drugs WHERE Name = ?', [decodedName]);
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Obat tidak ditemukan'
      });
    }
    
    if (newName && newName !== decodedName) {
      const [nameCheckRows] = await pool.execute('SELECT Name FROM drugs WHERE Name = ?', [newName]);
      if (nameCheckRows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Nama obat baru sudah digunakan'
        });
      }
    }
    
    const sideEffectsStr = Array.isArray(sideEffects) ? sideEffects.join(', ') : sideEffects || '';
    const finalName = newName || decodedName;
    
    await pool.execute(
      'UPDATE drugs SET Name = ?, Size = ?, Type = ?, Kegunaan = ?, Dosis = ?, `Cara Penggunaan` = ?, `Efek Samping` = ?, Peringatan Penting = ? WHERE Name = ?',
      [finalName, size || '', type || '', purpose, dosage, howToUse || '', sideEffectsStr, warnings || '', decodedName]
    );
    
    res.json({
      success: true,
      message: 'Obat berhasil diperbarui'
    });
  } catch (error) {
    console.error('Error updating drug:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui obat',
      error: error.message
    });
  }
});

// Delete drug by name
app.delete('/api/drugs/by-name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);
    
    const [result] = await pool.execute('DELETE FROM drugs WHERE Name = ?', [decodedName]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Obat tidak ditemukan'
      });
    }
    
    res.json({
      success: true,
      message: 'Obat berhasil dihapus'
    });
  } catch (error) {
    console.error('Error deleting drug:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus obat',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Ukuran file terlalu besar. Maksimal 5MB'
      });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan internal server',
    error: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

app.listen(PORT, () => {
  console.log(`✓ MEDIVIZE Backend server running on port ${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
});




module.exports = app;