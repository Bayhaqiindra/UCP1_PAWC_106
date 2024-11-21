const express = require('express');
const animalRoutes = require('./routes/tododb.js'); // Mengganti rute todo menjadi animal
const karyawanRoutes = require('./routes/KaryawanRoutes'); // Menambahkan rute karyawan
const app = express();
require('dotenv').config();
const port = process.env.PORT;

// Middleware dan Modul Tambahan
const session = require('express-session');
const authRoutes = require('./routes/authRoutes'); // Otentikasi
const { isAuthenticated } = require('./middlewares/middleware.js'); // Middleware otentikasi

const expressLayout = require('express-ejs-layouts');
const db = require('./database/db'); // Koneksi ke database

// Middleware Express
app.use(expressLayout);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menggunakan rute untuk animal dan karyawan
app.use('/animals', animalRoutes); // Menambahkan rute animal
app.use('/karyawan', karyawanRoutes); // Menambahkan rute karyawan

// Konfigurasi express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set ke true jika menggunakan HTTPS
  })
);

// Rute Otentikasi
app.use('/', authRoutes);

// Konfigurasi View Engine
app.set('view engine', 'ejs');

// Halaman Utama
app.get('/', isAuthenticated, (req, res) => {
  res.render('index', {
    layout: 'layouts/main-layouts.ejs',
  });
});

// Halaman Animal View
app.get('/animal-view', isAuthenticated, (req, res) => {
  db.query('SELECT * FROM animal', (err, animals) => {
    if (err) return res.status(500).send('Internal Server Error');
    res.render('animal', {
      layout: 'layouts/main-layouts.ejs',
      animals: animals,
    });
  });
});

// Halaman Karyawan View
app.get('/karyawan-view', isAuthenticated, (req, res) => {
  db.query('SELECT * FROM karyawan', (err, karyawan) => {
    if (err) return res.status(500).send('Internal Server Error');
    res.render('karyawan', {
      layout: 'layouts/main-layouts.ejs',
      karyawan: karyawan,
    });
  });
});

// Rute untuk 404 (Page Not Found)
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// Menjalankan Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
