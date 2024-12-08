const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 5000;

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '3399399',
    database: process.env.DB_NAME || 'bulutbilisim',
});

// --- MySQL Bağlantısını Kontrol Etme ---
db.connect((err) => {
    if (err) {
        console.error('MySQL bağlantı hatası:', err);
        return;
    }
    console.log('MySQL bağlantısı başarılı!');
});

// --- Upload Klasörü ---
const uploadFolder = path.join(__dirname, 'uploads');

// --- Multer Ayarları ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// --- Middleware ---
app.use(express.json());
app.use(express.static('uploads'));

// --- Frontend için Statik Dosyalar ---
app.use(express.static(path.join(__dirname, '.')));

// --- Ana Rota Frontend'i Yüklesin ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Dosya Yükleme API'si ---
app.post('/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('Dosya yüklenemedi.');
    }

    const query = 'INSERT INTO files (filename, filepath) VALUES (?, ?)';
    db.query(query, [file.originalname, file.path], (err, results) => {
        if (err) {
            console.error('Veritabanına kaydedilemedi:', err);
            return res.status(500).send('Veritabanı hatası');
        }

        const fileLink = `http://localhost:${port}/files/${results.insertId}`;
        res.json({ link: fileLink });
    });
});

// --- Dosya Getirme API'si ---
app.get('/files/:id', (req, res) => {
    const fileId = req.params.id;

    const query = 'SELECT filepath FROM files WHERE id = ?';
    db.query(query, [fileId], (err, results) => {
        if (err || results.length === 0) {
            console.error('Dosya bulunamadı veya sorgu hatası:', err);
            return res.status(404).send('Dosya bulunamadı');
        }

        const filePath = results[0].filepath;
        res.download(filePath);
    });
});

// --- Sunucuyu Dinlemeye Başla ---
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

