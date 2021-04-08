const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'jpg'
}

const storage = multer.diskStorage({
    destination: (reg, file, callback) => {
        callback(null, 'images')
    },
    filename: (reg, file, callBack) => {
      const name = file.originalame.split(' ').join('_');
      const extension = MIME_TYPES[file.mimetype];
      callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');
