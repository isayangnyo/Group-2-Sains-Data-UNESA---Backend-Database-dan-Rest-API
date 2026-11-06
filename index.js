const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ------------------- 6 REST API ENDPOINTS -------------------

// 1. GET ALL - Ambil semua data transaksi
app.get('/api/sampah', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transaksi_sampah ORDER BY id_transaksi ASC');
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. GET BY SEARCH - Cari transaksi berdasarkan status (menunggu/disetujui/ditolak)
// Contoh URL: /api/sampah/search?status=menunggu
app.get('/api/sampah/search', async (req, res) => {
  const { status } = req.query;
  try {
    const result = await pool.query(
      'SELECT * FROM transaksi_sampah WHERE LOWER(status) = LOWER($1)',
      [status]
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. GET BY ID - Ambil transaksi spesifik berdasarkan id_transaksi
app.get('/api/sampah/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM transaksi_sampah WHERE id_transaksi = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Transaksi tidak ditemukan' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. POST - Tambah transaksi setoran sampah baru
app.post('/api/sampah', async (req, res) => {
  const { id_pengguna, id_kategori, berat_kg, total_harga, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO transaksi_sampah (id_pengguna, id_kategori, berat_kg, total_harga, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id_pengguna, id_kategori, berat_kg, total_harga, status || 'menunggu']
    );
    res.status(201).json({ success: true, message: 'Transaksi berhasil ditambahkan', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. PUT - Update data transaksi berdasarkan id_transaksi
app.put('/api/sampah/:id', async (req, res) => {
  const { id } = req.params;
  const { berat_kg, total_harga, status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE transaksi_sampah SET berat_kg = $1, total_harga = $2, status = $3 WHERE id_transaksi = $4 RETURNING *',
      [berat_kg, total_harga, status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.status(200).json({ success: true, message: 'Transaksi berhasil diperbarui', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. DELETE - Hapus transaksi berdasarkan id_transaksi
app.delete('/api/sampah/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM transaksi_sampah WHERE id_transaksi = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.status(200).json({ success: true, message: 'Transaksi berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});