const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 1. GET ALL TRANSACTIONS
app.get('/api/sampah', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM waste_transactions ORDER BY id_transaksi DESC');
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 2. GET SEARCH BY STATUS
app.get('/api/sampah/search', async (req, res) => {
    try {
        const { status } = req.query;
        const result = await pool.query('SELECT * FROM waste_transactions WHERE status = $1', [status]);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 3. GET BY ID
app.get('/api/sampah/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM waste_transactions WHERE id_transaksi = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 4. POST CREATE TRANSACTION
app.post('/api/sampah', async (req, res) => {
    try {
        const { id_pengguna, id_kategori, berat_kg, total_harga, status } = req.body;
        const result = await pool.query(
            'INSERT INTO waste_transactions (id_pengguna, id_kategori, berat_kg, total_harga, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [id_pengguna, id_kategori, berat_kg, total_harga, status || 'menunggu']
        );
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 5. PUT UPDATE TRANSACTION
app.put('/api/sampah/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { berat_kg, total_harga, status } = req.body;
        const result = await pool.query(
            'UPDATE waste_transactions SET berat_kg = $1, total_harga = $2, status = $3 WHERE id_transaksi = $4 RETURNING *',
            [berat_kg, total_harga, status, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// 6. DELETE TRANSACTION
app.delete('/api/sampah/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM waste_transactions WHERE id_transaksi = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
        }
        res.json({ success: true, message: 'Data berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
