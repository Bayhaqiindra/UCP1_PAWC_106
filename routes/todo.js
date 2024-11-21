const express = require('express');

const router = express.Router();

let animals = [
    {
        id: 1, hewan: 'Kambing', completed: false
    },
    {
        id: 2, hewan: 'Ayam', completed: false
    },
];

// **GET** - Mengambil semua data
router.get('/', (req, res) => {
    res.json(animals); // Memastikan array `animals` digunakan (bukan `animal` yang salah)
});

// **POST** - Menambahkan data baru
router.post('/', (req, res) => {
    const newAnimal = {
        id: animals.length + 1, // Pastikan array `animals` digunakan untuk ID
        hewan: req.body.hewan, // Perbaiki field dari `task` menjadi `hewan`
        completed: false
    };
    animals.push(newAnimal); // Menambahkan data baru ke array `animals`
    res.status(201).json(newAnimal); // Mengembalikan data baru dengan status 201
});

// **DELETE** - Menghapus data berdasarkan ID
router.delete('/:id', (req, res) => {
    const animalIndex = animals.findIndex(a => a.id === parseInt(req.params.id));
    if (animalIndex === -1) return res.status(404).json({ message: 'Hewan tidak ditemukan' });
    const deletedAnimal = animals.splice(animalIndex, 1)[0];
    res.status(200).json({ message: `Hewan '${deletedAnimal.hewan}' telah dihapus` });
});

// **PUT** - Memperbarui data berdasarkan ID
router.put('/:id', (req, res) => {
    const animal = animals.find(a => a.id === parseInt(req.params.id));
    if (!animal) return res.status(404).json({ message: 'Hewan tidak ditemukan' });
    animal.hewan = req.body.hewan || animal.hewan; // Memperbarui nama hewan jika ada dalam `req.body`
    res.status(200).json({
        message: `Hewan dengan ID ${animal.id} telah diperbarui`,
        updatedAnimal: animal
    });
});

module.exports = router;
