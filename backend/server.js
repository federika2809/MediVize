const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises; 
const axios = require("axios"); 
const FormData = require("form-data"); 
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3010",
      "http://localhost:5173",
      "http://localhost:8080",
      "https://medivize.netlify.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const pool = mysql.createPool({
  host: process.env.DB_HOST || "sql12.freesqldatabase.com",
  user: process.env.DB_USER || "sql12722940",
  password: process.env.DB_PASSWORD || "x2wWCIpvYJ",
  database: process.env.DB_NAME || "sql12722940",
  port: process.env.DB_PORT || "3306",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

pool
  .getConnection()
  .then((connection) => {
    console.log("✓ Database connected successfully");
    connection.release();
  })
  .catch((err) => {
    console.error("✗ Database connection failed:", err.message);
  });

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = "/tmp/uploads";
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "drug-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Hanya file gambar (JPEG, JPG, PNG, WEBP) yang diizinkan"));
    }
  },
});

const formatDrugData = (drugRow) => {
  if (!drugRow) return null;
  return {
    name: drugRow.Name || "",
    size: drugRow.Size || "",
    type: drugRow.Type || "",
    purpose: drugRow.Kegunaan || "",
    dosage: drugRow.Dosis || "",
    howToUse: drugRow["Cara Penggunaan"] || "",
    sideEffects: drugRow["Efek Samping"]
      ? drugRow["Efek Samping"].split(",").map((effect) => effect.trim())
      : [],
    warnings: drugRow["Peringatan Penting"] || "",
  };
};

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "MEDIVIZE Backend is running" });
});

app.get("/api/drugs", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM drugs ORDER BY Name ASC");
    res.json({ success: true, data: rows.map(formatDrugData) });
  } catch (error) {
    console.error("Error fetching drugs:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil data obat" });
  }
});

app.get("/api/drugs/by-name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const [rows] = await pool.execute(
      "SELECT * FROM drugs WHERE LOWER(Name) = LOWER(?) LIMIT 1",
      [decodeURIComponent(name)]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Obat tidak ditemukan" });
    }
    res.json({ success: true, data: formatDrugData(rows[0]) });
  } catch (error) {
    console.error("Error fetching drug by name:", error);
    res
      .status(500)
      .json({ success: false, message: "Gagal mengambil detail obat" });
  }
});

app.get("/api/drugs/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Query pencarian tidak boleh kosong",
      });
    }
    const searchTerm = `%${q.trim()}%`;
    const [rows] = await pool.execute(
      "SELECT * FROM drugs WHERE Name LIKE ? OR Type LIKE ? OR Kegunaan LIKE ? ORDER BY Name ASC",
      [searchTerm, searchTerm, searchTerm]
    );
    res.json({ success: true, data: rows.map(formatDrugData) });
  } catch (error) {
    console.error("Error searching drugs:", error);
    res.status(500).json({ success: false, message: "Gagal mencari obat" });
  }
});

app.post("/api/drugs/classify", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Gambar tidak ditemukan. Pastikan field name adalah "image".',
    });
  }

  const imagePath = req.file.path;
  const ML_API_URL = "https://federika-my-drug-classifier-api.hf.space/predict";
  const ML_API_USERNAME = "testuser";
  const ML_API_PASSWORD = "testpass";

  try {
    const imageFileStream = require("fs").createReadStream(imagePath);
    const formData = new FormData();
    formData.append("file", imageFileStream, req.file.originalname);

    const imageBuffer = await fs.readFile(imagePath);
    const imageBase64 = `data:${
      req.file.mimetype
    };base64,${imageBuffer.toString("base64")}`;

    console.log(`Calling ML API at ${ML_API_URL}`);
    const mlResponse = await axios.post(ML_API_URL, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization:
          "Basic " +
          Buffer.from(`${ML_API_USERNAME}:${ML_API_PASSWORD}`).toString(
            "base64"
          ),
      },
      timeout: 30000,
    });

    console.log("ML API Response:", mlResponse.data);
    const { predicted_class, confidence } = mlResponse.data;

    const classificationResult = {
      drugName: predicted_class || "Tidak Dikenali",
      confidence: confidence !== undefined ? parseFloat(confidence) : 0.0,
      imageBase64: imageBase64, 
      processedAt: new Date().toISOString(),
      drugDetails: null,
    };

    if (
      classificationResult.drugName &&
      classificationResult.drugName !== "Tidak Dikenali"
    ) {
      const [rows] = await pool.execute(
        "SELECT * FROM drugs WHERE LOWER(Name) LIKE LOWER(?) LIMIT 1",
        [`%${classificationResult.drugName}%`]
      );
      if (rows.length > 0) {
        classificationResult.drugDetails = formatDrugData(rows[0]);
      }
    }

    res.json({
      success: true,
      data: classificationResult,
    });
  } catch (error) {
    console.error(
      "Error in classification process:",
      error.response ? JSON.stringify(error.response.data) : error.message
    );
    let userMessage = "Gagal memproses gambar.";
    if (error.code === "ECONNABORTED") {
      userMessage = "Koneksi ke layanan deteksi obat (ML API) timeout.";
    } else if (error.response) {
      userMessage = `Error dari layanan deteksi: ${
        error.response.data.message || error.response.status
      }`;
    }
    res.status(502).json({ success: false, message: userMessage });
  } finally {
    if (imagePath) {
      await fs
        .unlink(imagePath)
        .catch((e) =>
          console.error("Error deleting temporary file:", e.message)
        );
    }
  }
});

app.post("/api/drugs", async (req, res) => {
  try {
    const {
      name,
      size,
      type,
      purpose,
      dosage,
      howToUse,
      sideEffects,
      warnings,
    } = req.body;
    if (!name || !purpose || !dosage) {
      return res.status(400).json({
        success: false,
        message: "Nama, kegunaan, dan dosis wajib diisi",
      });
    }
    const [existingRows] = await pool.execute(
      "SELECT Name FROM drugs WHERE Name = ?",
      [name]
    );
    if (existingRows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Obat dengan nama tersebut sudah ada",
      });
    }
    const sideEffectsStr = Array.isArray(sideEffects)
      ? sideEffects.join(", ")
      : sideEffects || "";
    await pool.execute(
      "INSERT INTO drugs (Name, Size, Type, Kegunaan, Dosis, `Cara Penggunaan`, `Efek Samping`, `Peringatan Penting`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        size || "",
        type || "",
        purpose,
        dosage,
        howToUse || "",
        sideEffectsStr,
        warnings || "",
      ]
    );
    res
      .status(201)
      .json({ success: true, message: "Obat berhasil ditambahkan" });
  } catch (error) {
    console.error("Error adding drug:", error);
    res.status(500).json({ success: false, message: "Gagal menambahkan obat" });
  }
});

app.put("/api/drugs/by-name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const {
      newName,
      size,
      type,
      purpose,
      dosage,
      howToUse,
      sideEffects,
      warnings,
    } = req.body;

    const [existingRows] = await pool.execute(
      "SELECT Name FROM drugs WHERE Name = ?",
      [decodeURIComponent(name)]
    );
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Obat tidak ditemukan untuk diperbarui",
      });
    }

    const sideEffectsStr = Array.isArray(sideEffects)
      ? sideEffects.join(", ")
      : sideEffects;
    const updateQuery =
      "UPDATE drugs SET Name = ?, Size = ?, Type = ?, Kegunaan = ?, Dosis = ?, `Cara Penggunaan` = ?, `Efek Samping` = ?, `Peringatan Penting` = ? WHERE Name = ?";
    await pool.execute(updateQuery, [
      newName || name,
      size,
      type,
      purpose,
      dosage,
      howToUse,
      sideEffectsStr,
      warnings,
      decodeURIComponent(name),
    ]);

    res.json({ success: true, message: "Obat berhasil diperbarui" });
  } catch (error) {
    console.error("Error updating drug:", error);
    res.status(500).json({ success: false, message: "Gagal memperbarui obat" });
  }
});

app.delete("/api/drugs/by-name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const [result] = await pool.execute("DELETE FROM drugs WHERE Name = ?", [
      decodeURIComponent(name),
    ]);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Obat tidak ditemukan" });
    }
    res.json({ success: true, message: "Obat berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting drug:", error);
    res.status(500).json({ success: false, message: "Gagal menghapus obat" });
  }
});

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: `Kesalahan unggah file: ${error.message}`,
    });
  } else if (error) {
    console.error("Unhandled error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan internal server." });
  }
  next();
});

app.use("*", (req, res) => {
  res
    .status(404)
    .json({ success: false, message: "Endpoint tidak ditemukan." });
});

app.listen(PORT, () => {
  console.log(`✓ MEDIVIZE Backend server running on port ${PORT}`);
});

module.exports = app;
