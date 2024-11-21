const express = require('express');
const db = require('../database/db'); // Mengimpor koneksi database
const router = express.Router();

// **GET**: Mendapatkan semua data hewan
router.get('/', (req, res) => {
    db.query('SELECT * FROM animal', (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal Server Error' });
        res.json(results);
    });
});

// **GET**: Mendapatkan data hewan berdasarkan ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM animal WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal Server Error' });
        if (results.length === 0) return res.status(404).json({ message: 'Hewan tidak ditemukan' });
        res.json(results[0]);
    });
});

// **POST**: Menambahkan data hewan baru
router.post('/', (req, res) => {
    const { hewan, species, gender } = req.body; // Ambil nama, spesies, dan jenis kelamin
    if (!hewan || hewan.trim() === '') {
        return res.status(400).json({ message: 'Nama hewan tidak boleh kosong' });
    }
    if (!species || species.trim() === '') {
        return res.status(400).json({ message: 'Spesies hewan tidak boleh kosong' });
    }
    if (!gender || gender.trim() === '') {
        return res.status(400).json({ message: 'Jenis kelamin hewan tidak boleh kosong' });
    }

    db.query('INSERT INTO animal (hewan, species, gender) VALUES (?, ?, ?)', [hewan.trim(), species.trim(), gender.trim()], (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal Server Error' });
        res.status(201).json({ id: results.insertId, hewan: hewan.trim(), species: species.trim(), gender: gender.trim() });
    });
});

// **PUT**: Memperbarui data hewan berdasarkan ID
router.put('/:id', (req, res) => {
    const { hewan, species, gender } = req.body; // Ambil data yang diupdate
    if (!hewan || hewan.trim() === '') {
        return res.status(400).json({ message: 'Nama hewan tidak boleh kosong' });
    }
    if (!species || species.trim() === '') {
        return res.status(400).json({ message: 'Spesies hewan tidak boleh kosong' });
    }
    if (!gender || gender.trim() === '') {
        return res.status(400).json({ message: 'Jenis kelamin hewan tidak boleh kosong' });
    }

    db.query('UPDATE animal SET hewan = ?, species = ?, gender = ? WHERE id = ?', [hewan.trim(), species.trim(), gender.trim(), req.params.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal Server Error' });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Hewan tidak ditemukan' });
        res.json({ id: req.params.id, hewan: hewan.trim(), species: species.trim(), gender: gender.trim() });
    });
});

// **DELETE**: Menghapus data hewan berdasarkan ID
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM animal WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ message: 'Internal Server Error' });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Hewan tidak ditemukan' });
        res.status(204).send(); // Tidak mengembalikan konten
    });
});

module.exports = router;
