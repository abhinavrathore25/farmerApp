require('dotenv').config();
const express = require('express');
const path = require("path");
const bodyparser = require('body-parser');
const PORT = process.env.PORT || 8080;
const multer = require('multer');
const cors = require('cors');
let FARMER_DATA = [];

const app = express();
app.use(cors());

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, "./build")));

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({ storage: storage });

app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));

app.get('/getFarmerData', (req, res) => {
    res.send(FARMER_DATA);
});

app.post('/formData', upload.single('image'), (req, res) => {
    const fileName = req.file?.originalname;
    const formData = JSON.parse(req.body.farmerData);
    FARMER_DATA = [...FARMER_DATA, {
        ...formData,
        imageUrl: (fileName !== undefined) ? `https://farmerapp-backend.onrender.com/uploads/${fileName}` : ''
    }];
    console.log(FARMER_DATA);
    res.send('SUCCESS');
});

// This route serves the React app
app.get('*', (req, res) => res.sendFile(path.join(__dirname, "./build/index.html")));

app.listen(PORT, () => console.log(`Server Listning on port ${PORT}`));