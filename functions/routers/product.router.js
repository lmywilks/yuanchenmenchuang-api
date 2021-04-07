const express = require('express');
const router = express.Router();

const Auth = require('../utils/auth');
const Product = require('../controllers/product.controller');

const multer = require('multer');

var upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
});

router.post('/', Auth, Product.Create);
router.get('/', Product.List);
router.get('/:productId', Product.Retrieve);
router.put('/:productId', Auth, Product.Update);
router.delete('/:productId', Auth, Product.Delete);
router.post('/:productId/image',  upload.single('file'), Product.Upload);
router.delete('/:productId/image/:filename', Auth, Product.DeleteImage);

module.exports = router;
