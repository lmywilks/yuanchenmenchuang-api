const express = require('express');
const router = express.Router();

const Info = require('../controllers/info.controller');
const Auth = require('../utils/auth');

router.get('/', Info.Retrieve);
router.put('/main', Auth, Info.Update);

module.exports = router;
