// MEDIVIZE/backend/server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises; // Using promises version of fs
const axios = require('axios'); // To make HTTP requests to ML API
const FormData = require('form-data'); // To send multipart/form-data
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// --- CORS Configuration ---
// Defines which frontend origins can make requests to this Express backend
app.use(cors({
  origin: [
    'http://localhost:3000',         // For local React development
    'http://localhost:3010',         // Another local React development port
    'http://localhost:8080',         // The backend itself (less common for direct browser access)
    'https://medivize.netlify.app',  // Your deployed frontend URL
    // The ML API URL was removed from here as it's not an origin that would call this Express server via browser.
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Database Connection Pool ---
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'sql12.freesqldatabase.com',
  user: process.env.DB_USER || 'sql12722940',
  password: process.env.DB_PASSWORD || 'x2wWCIpvYJ',
  database: process.env.DB_NAME || 'sql12722940',
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
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
        console.error('Hint: Check if the database server is running and accessible. For free databases, they might go to sleep if inactive.');
    }
  });

// --- Multer Storage Configuration for File Uploads ---
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
    fileSize: 5 * 1024 * 1024 // 5MB limit
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

// --- Data Formatting Function ---
const formatDrugData = (drugRow) => {
  if (!drugRow) return null;
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

// --- API Routes ---

// Health Check
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

// --- Image Classification Route (INTEGRATED WITH ML API) ---
app.post('/api/drugs/classify', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Gambar tidak ditemukan dalam permintaan. Pastikan field name adalah "image".'
    });
  }

  const imagePath = req.file.path;
  const imageUrl = `/uploads/${req.file.filename}`; // URL relative to this backend

  // ML API Configuration
  // Updated to use your Flask ML API endpoint
  const ML_API_URL = 'https://medivize-backend.netlify.app/predict'; 

  const ML_API_USERNAME = 'testuser'; // Credentials for your ML API
  const ML_API_PASSWORD = 'testpass'; // Credentials for your ML API

  try {
    // 1. Prepare image data to send to ML API
    const imageFileStream = require('fs').createReadStream(imagePath);
    const formData = new FormData();
    formData.append('file', imageFileStream, req.file.originalname); // 'file' is the expected field name by your Flask ML API

    // 2. Call ML API
    console.log(`Calling ML API at ${ML_API_URL} for image: ${req.file.originalname}`);
    let mlResponse;
    try {
        mlResponse = await axios.post(ML_API_URL, formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': 'Basic ' + Buffer.from(`${ML_API_USERNAME}:${ML_API_PASSWORD}`).toString('base64')
            },
            timeout: 30000 // 30 seconds timeout for ML API
        });
    } catch (mlApiError) {
        console.error('Error calling ML API:', mlApiError.response ? JSON.stringify(mlApiError.response.data) : mlApiError.message);
        // Attempt to delete the uploaded file if ML API call fails early
        await fs.unlink(imagePath).catch(e => console.error("Error deleting temp file after ML API failure:", e.message));
        
        let userMessage = 'Gagal menghubungi layanan deteksi obat (ML API).';
        if (mlApiError.response && mlApiError.response.data && mlApiError.response.data.message) {
            userMessage = `ML API Error: ${mlApiError.response.data.message}`;
        } else if (mlApiError.response && mlApiError.response.status) {
            userMessage = `ML API Error: Status ${mlApiError.response.status}`;
        } else if (mlApiError.code === 'ECONNABORTED') {
            userMessage = 'Koneksi ke layanan deteksi obat (ML API) timeout.';
        }

        return res.status(500).json({ // Or a more appropriate status like 502 Bad Gateway or 504 Gateway Timeout
            success: false,
            message: userMessage,
            error: mlApiError.message // Keep original error message for server logs
        });
    }
    
    console.log('ML API Response:', mlResponse.data);

    // Assuming ML API returns { "predicted_class": "...", "confidence": 0.xx, ... }
    const { predicted_class, confidence } = mlResponse.data;

    const classificationResult = {
      drugName: predicted_class || "Tidak Dikenali",
      confidence: confidence !== undefined ? parseFloat(confidence) : 0.0,
      imageUrl: imageUrl, 
      processedAt: new Date().toISOString(),
      drugDetails: null
    };

    // 3. If drug is recognized, fetch details from local DB
    if (classificationResult.drugName && classificationResult.drugName !== "Tidak Dikenali") {
      try {
        const [rows] = await pool.execute(
          'SELECT * FROM drugs WHERE LOWER(Name) LIKE LOWER(?) LIMIT 1',
          [`%${classificationResult.drugName}%`]
        );
        if (rows.length > 0) {
          classificationResult.drugDetails = formatDrugData(rows[0]);
        } else {
            console.log(`No details found in DB for drug: ${classificationResult.drugName}`);
        }
      } catch (dbError) {
        console.error('Error searching drug in database after ML classification:', dbError);
        // Non-fatal error, proceed without drugDetails but maybe log it or inform client partially
      }
    }

    // 4. Send final response to frontend
    res.json({
      success: true,
      data: classificationResult
    });

  } catch (error) { // Catch errors from the broader try block (e.g., issues with fs before ML call)
    console.error('Error in image classification process (outer try-catch):', error);
    // Attempt to delete the uploaded file if it exists and an error occurs
    if (imagePath) { // Check if imagePath was defined
        await fs.unlink(imagePath).catch(e => console.error("Error deleting temp file after general failure:", e.message));
    }
    res.status(500).json({
      success: false,
      message: 'Gagal memproses gambar secara keseluruhan.',
      error: error.message
    });
  }
});


// Add a new drug
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
      'INSERT INTO drugs (Name, Size, Type, Kegunaan, Dosis, `Cara Penggunaan`, `Efek Samping`, `Peringatan Penting`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, size || '', type || '', purpose, dosage, howToUse || '', sideEffectsStr, warnings || '']
    );
    res.status(201).json({
      success: true,
      message: 'Obat berhasil ditambahkan',
      data: { name: name }
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

// Update a drug by name
app.put('/api/drugs/by-name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);
    const { newName, size, type, purpose, dosage, howToUse, sideEffects, warnings } = req.body;

    const [existingRows] = await pool.execute('SELECT Name FROM drugs WHERE Name = ?', [decodedName]);
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Obat tidak ditemukan untuk diperbarui'
      });
    }

    if (newName && newName !== decodedName) {
      const [nameCheckRows] = await pool.execute('SELECT Name FROM drugs WHERE Name = ?', [newName]);
      if (nameCheckRows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Nama obat baru sudah digunakan oleh obat lain'
        });
      }
    }

    const sideEffectsStr = Array.isArray(sideEffects) ? sideEffects.join(', ') : sideEffects || '';
    const finalName = newName || decodedName;
    
    const currentDrugData = formatDrugData(existingRows[0]);
    
    const updateValues = [
        finalName,
        size !== undefined ? size : currentDrugData.size,
        type !== undefined ? type : currentDrugData.type,
        purpose !== undefined ? purpose : currentDrugData.purpose,
        dosage !== undefined ? dosage : currentDrugData.dosage,
        howToUse !== undefined ? howToUse : currentDrugData.howToUse,
        sideEffectsStr, // If sideEffects is not in body, this will be currentDrugData's sideEffects or ''
        warnings !== undefined ? warnings : currentDrugData.warnings,
        decodedName
    ];
    
    // A more robust way to handle updates: build query based on provided fields
    // For simplicity, current approach updates all fields, using existing values if new ones aren't provided.

    await pool.execute(
      'UPDATE drugs SET Name = ?, Size = ?, Type = ?, Kegunaan = ?, Dosis = ?, `Cara Penggunaan` = ?, `Efek Samping` = ?, `Peringatan Penting` = ? WHERE Name = ?',
      updateValues
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

// Delete a drug by name
app.delete('/api/drugs/by-name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const decodedName = decodeURIComponent(name);
    const [result] = await pool.execute('DELETE FROM drugs WHERE Name = ?', [decodedName]);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Obat tidak ditemukan untuk dihapus'
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

// --- Error Handling Middleware ---
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Ukuran file terlalu besar. Maksimal 5MB.'
      });
    }
    return res.status(400).json({
        success: false,
        message: `Kesalahan unggah file: ${error.message}`
    });
  } else if (error) { 
    console.error('Unhandled error caught by middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan internal server.',
      error: error.message // In production, you might not want to send the raw error message
    });
  }
  next(); // Should not be reached if error is handled
});

// 404 Not Found Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan.'
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✓ MEDIVIZE Backend server running on port ${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
  console.log(`✓ Uploaded images served from: http://localhost:${PORT}/uploads/<filename> (if running locally)`);
});

module.exports = app;
