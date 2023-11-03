const express = require('express');
const bodyparser = require('body-parser');
const PORT = 8080;
const multer = require('multer');
const cors = require('cors');
let FARMER_DATA = [];

const app = express();
app.use(cors());

app.use(bodyparser.urlencoded({
    extended: true
}));

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
        imageUrl: (fileName !== undefined) ? `http://localhost:${PORT}/uploads/${fileName}` : ''
    }];
    res.send('SUCCESS');
});

app.listen(PORT, () => console.log(`Server Listning on port ${PORT}`));