const express = require('express');
const db = require('../database/db'); // Mengimpor koneksi database
const router = express.Router();

// **GET**: Mendapatkan semua data karyawan
router.get('/', (req, res) => {
  db.query('SELECT * FROM karyawan', (err, results) => {
    if (err) return res.status(500).json({ message: 'Internal Server Error' });
    res.json(results);
  });
});

// **GET**: Mendapatkan data karyawan berdasarkan ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM karyawan WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Internal Server Error' });
    if (results.length === 0) return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    res.json(results[0]);
  });
});

// **POST**: Menambahkan data karyawan baru
router.post('/', (req, res) => {
  const { nama, posisi } = req.body;
  if (!nama || nama.trim() === '') {
    return res.status(400).json({ message: 'Nama karyawan tidak boleh kosong' });
  }
  if (!posisi || posisi.trim() === '') {
    return res.status(400).json({ message: 'Posisi karyawan tidak boleh kosong' });
  }

  db.query('INSERT INTO karyawan (nama, posisi) VALUES (?, ?)', [nama.trim(), posisi.trim()], (err, results) => {
    if (err) return res.status(500).json({ message: 'Internal Server Error' });
    res.status(201).json({ id: results.insertId, nama: nama.trim(), posisi: posisi.trim() });
  });
});

// **PUT**: Memperbarui data karyawan berdasarkan ID
router.put('/:id', (req, res) => {
  const { nama, posisi } = req.body;
  if (!nama || nama.trim() === '') {
    return res.status(400).json({ message: 'Nama karyawan tidak boleh kosong' });
  }
  if (!posisi || posisi.trim() === '') {
    return res.status(400).json({ message: 'Posisi karyawan tidak boleh kosong' });
  }

  db.query('UPDATE karyawan SET nama = ?, posisi = ? WHERE id = ?', [nama.trim(), posisi.trim(), req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Internal Server Error' });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    res.json({ id: req.params.id, nama: nama.trim(), posisi: posisi.trim() });
  });
});

// **DELETE**: Menghapus data karyawan berdasarkan ID
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM karyawan WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Internal Server Error' });
    if (results.affectedRows === 0) return res.status(404).json({ message: 'Karyawan tidak ditemukan' });
    res.status(204).send();
  });
});

module.exports = router;
