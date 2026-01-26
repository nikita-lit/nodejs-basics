//multer seadistus failide üleslaadimiseks
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    //salvestame faili uploads kausta
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    //tekitame unikaalse faili nime
    filename: (req, file, cb) => {
        const unique = Date.now() + path.extname(file.originalname);
        cb(null, unique);
    }
});

const upload = multer({ storage });

module.exports = {
    upload
};